import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class GFileUpload extends PolymerElement {
    static get template() {
        return html`
        <style>
        :host { display: block; }
        :host([hidden]), [hidden] {
            display: none !important;
        }

        .file-upload-label {
            display: block;
            padding: 0.5em 1.5em;
            color: gray;
            border: 2px dashed gray;
            transition: 0.3s;
            text-align: center;
            width: var(--g-file-upload-label-width, 150px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .file-upload-label:hover {
            cursor: pointer;
            background: #eeee;
        }
        </style>

        <input id="upload" hidden="" type="file" on-change="_filesChanged" accept="[[accept]]" multiple="[[multiple]]">
        <slot id="slot" name="file-upload-label">
            <label class="file-upload-label">[[_label]]</label>
        </slot>
    `;
    }

    static get properties() {
        return {
            /**
             * Whether accept multiple files
             */
            multiple: {
                type: Boolean,
                value: false,
            },
            /**
             * Acceptable file types can be specified with the accept attribute,
             * which takes a comma-separated list of allowed file extensions
             * or MIME types.
             * 
             * @default "image/*"
             */
            accept: {
                type: String,
                value: 'image/*'
            },
            /**
            * Set to true to mark the input as required.
            */
            required: {
                type: Boolean,
                value: false
            },
            /**
             * Array of files
             */
            files: {
                type: Array,
                notify: true,
                value: []
            },
            /**
             * Label of the input file
             */
            text: {
                type: String,
                value: "Choose a file",
            },
            /**
             * Set to true to compress image using `compressorjs`.
             * Documentation: `https://github.com/fengyuanchen/compressorjs`
             */
            compress: {
                type: Boolean,
                value: false
            },
            /**
            * Compressorjs default options.
            * Playground: `https://fengyuanchen.github.io/compressorjs/`
            */
            options: {
                type: Object,
                value: {
                    strict: true,
                    checkOrientation: false,
                    maxWidth: undefined,
                    maxHeight: undefined,
                    minWidth: 0,
                    minHeight: 0,
                    width: undefined,
                    height: undefined,
                    quality: 0.8,
                    mimeType: '',
                    convertSize: 5000000
                }
            },
            /**
            * Compressor holder.
            */
            _Compressor: Function
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._observer = new FlattenedNodesObserver(this.$.slot, (info) => {
            this._addedUploadLabel(info.addedNodes);
            this._removedUploadLabel(info.removedNodes);
        });
    }

    ready() {
        super.ready();
        this._label = this.text;
        if (this.compress) {
            import('../../src/compressor.js').then(compressor => {
                this._Compressor = compressor.default;
                this._Compressor.setDefaults(this.options);
            });
        }
    }

    _addedUploadLabel(nodes) {
        const fileUploadLabel = this._getElementNodes(nodes);
        if (fileUploadLabel.length > 0) {
            fileUploadLabel[0].addEventListener('click', this._onClick.bind(this));
        }
    }

    _removedUploadLabel(nodes) {
        const fileUploadLabel = this._getElementNodes(nodes);
        if (fileUploadLabel.length > 0) {
            fileUploadLabel[0].removeEventListener('click', this._onClick.bind(this));
        }
    }

    _getElementNodes(nodes) {
        return nodes.filter((node) => (node.nodeType === Node.ELEMENT_NODE));
    }

    _onClick(event) {
        this._debounceJob = Debouncer.debounce(this._debounceJob, timeOut.after(50), () => {
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "composed": true,
                "cancelable": false
            });

            this.$.upload.dispatchEvent(clickEvent);
            event.preventDefault();
        });
    }

    _filesChanged(event) {
        const files = event.target.files;
        this.set('files', []);

        if (!files) return;
        if (files.length == 0) {
            this._label = this.text;
            return;
        }

        if (this.compress && this._Compressor) {
            if (this.multiple) {
                for (var index = 0, file; file = files[index]; index++) {
                    this._compress(file).then(result => {
                        this.push('files', result);
                    }).catch(error => {
                        this.dispatchEvent(new CustomEvent('compress-error', {
                            bubbles: false, composed: false, detail: error,
                        }));
                    });
                }

                this._label = `${index} ${index > 1 ? "files" : "file"} selected`;
            } else {
                this._compress(files[0]).then(file => {
                    this.set('files', [file]);
                    this._label = file.name;
                }).catch(error => {
                    this.dispatchEvent(new CustomEvent('compress-error', {
                        bubbles: false, composed: false, detail: error,
                    }));
                });
            }
        } else {
            this.set('files', files);
            if (this.multiple) this._label = files.length;
            else this._label = files[0].name;
        }
    }

    _compress(file) {
        return new Promise((resolve, reject) => {
            if (file.type.split("/")[0] === "image") {
                const Compressor = this._Compressor;
                new Compressor(file, {
                    success(result) {
                        resolve(result);
                    },
                    error(error) {
                        reject(error);
                    }
                });
            } else {
                resolve(file);
            }
        });
    }

    validate() {
        if (this.required) return this.files.length > 0;
        return this.required;
    }
}

window.customElements.define("g-file-upload", GFileUpload);
