import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-fab/paper-fab.js';
import './g-file-upload.js';

class GImageUpload extends PolymerElement {
    static get template() {
        return html`
        <style is="custom-style">
            :host {
                display: block;
            }

            .container {
                position: relative;
                width: fit-content;
            }

            iron-image {
                border-radius: var(--g-image-upload-border-radius, 50%);
                @apply --g-image-upload;
            }

            paper-fab {
                display: block;
                position: absolute;
                cursor: pointer;
                right: 0;
                bottom: 0;

                --paper-fab-background: var(--g-image-upload-button-background);
                @apply --g-image-upload-button;
            }
        </style>

        <div class="container">
            <iron-image src="[[src]]" 
                        placeholder="[[placeholder]]" 
                        sizing="[[sizing]]" 
                        preload="[[preload]]" 
                        fade="[[fade]]" 
                        alt="[[alt]]" 
                        width="[[width]]" 
                        height="[[height]]">
            </iron-image>
            
            <g-file-upload id="file" files="{{files}}" compress="[[compress]]" required="[[required]]">
                <paper-fab slot="file-upload-label" mini="" icon="[[icon]]"></paper-fab>
            </g-file-upload>
        </div>
        `;
    }

    static get properties() {
        return {
            /**
             * Set to true to mark the input as required.
             */
            required: {
                type: Boolean,
                value: false
            },
            /**
             * A short text alternative for the image.
             */
            alt: String,
            /**
             * When preload is true, setting fade to true will cause the image to fade into place.
             */
            fade: {
                type: Boolean,
                value: false
            },
            /**
             * Icon applied to paper-fab
             * @default image:camera-alt
             */
            icon: {
                type: String,
                value: 'g-icons:camera-alt',
            },
            /**
             * Default image for background when is no image selected
             */
            placeholder: {
                type: String
            },
            /**
             * When true, any change to the src property will cause the placeholder image to be shown until the new image has loaded.
             */
            preload: {
                type: Boolean,
                value: false,
            },
            /**
             * Sets a sizing option for the image. Valid values are contain
             * (full aspect ratio of the image is contained within the element
             * and letterboxed) or cover (image is * cropped in order to fully
             * cover the bounds of the element), or null (default: image takes
             * natural size).
             * @default cover
             */
            sizing: {
                type: String,
                value: "cover"
            },
            /**
             * Image source.
             * @default ''
             */
            src: {
                type: String,
                value: ''
            },
            /**
             * Image width.
             * @default 128
             */
            width: {
                type: Number,
                value: 128
            },
            /**
             * Image height.
             * @default 128
             */
            height: {
                type: Number,
                value: 128
            },
            /**
             * The image file.
             */
            image: {
                type: Object,
                notify: true
            },
            /**
             * Set to true to compress image using `compressorjs`.
             * Documentation: `https://github.com/fengyuanchen/compressorjs`
             */
            compress: {
                type: Boolean,
                value: false
            },
        };
    }

    static get observers() {
        return [
            '_fileChanged(files.0)'
        ];
    }

    _fileChanged(file) {
        const URL = window.URL || window.webkitURL;
        this.image = file ? file : null;
        if (!this._src) this._src = this.src;
        this.src = file ? URL.createObjectURL(file) : this._src;
    }

    validate() {
        if (this.required) return this.$.file.validate();
        return this.required;
    }
}

window.customElements.define("g-image-upload", GImageUpload);
