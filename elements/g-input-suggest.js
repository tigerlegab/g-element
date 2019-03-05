import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class GInputSuggest extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                }

                .suggest-items {
                    background: #fff;
                    position: absolute;
                    z-index: 100;
                    width: calc(100% - 33px);
                    max-height: 250px;
                    overflow-y: auto;
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
                    margin-bottom: 16px;
                    display: none;
                }
            </style>
            
            <iron-ajax id="ajax" url="{{dataUrl}}" last-response="{{data}}"></iron-ajax>

            <paper-input id="myInput" label="{{label}}" placeholder="{{placeholder}}" always-float-label readonly on-focus="_focus" value="{{value}}">
                <iron-icon icon="my-icons:arrow-drop-down" slot="suffix"></iron-icon>
            </paper-input>
            
            <div id="suggestItems" class="suggest-items">
                <template is="dom-repeat" items="{{data}}">
                    <paper-item value="[[item]]" on-tap="_selectItem">
                    [[_fieldItem(item)]]
                    <paper-ripple></paper-ripple>
                    </paper-item>
                </template>
            </div>
        `;
    }

    static get properties() {
        return {
            data: {
                type: Array,
                value: []
            },
            value: {
                type: String,
                value: "",
                notify: true
            },
            field: {
                type: String,
                value: ""
            },
            dataUrl: {
                type: String,
                value: null,
                observer: '_dataUrlChanged'
            },
            required: {
                type: Boolean,
                value: null
            },
            label: String,
            placeholder: String
        };
    }

    ready() {
        super.ready();
        // bind listener method
        this.clickOutsideListenerBinded = this._clickOutsideListener.bind(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._clickOutsideUnlisten();
    }

    clickOutsideListen() {
        // run this method to start listening
        this._clickOutsideUnlisten()
        window.addEventListener('click', this.clickOutsideListenerBinded, false);
    }

    _clickOutsideUnlisten() {
        window.removeEventListener('click', this.clickOutsideListenerBinded, false);
    }

    _clickOutsideListener(ev) {
        // check if the user has clicked on my component or on my children
        var isOutside = !ev.path.find(function (path) {
            return path === this
        }.bind(this));

        if (isOutside) {
            this.onClickOutside();
            this._clickOutsideUnlisten();
        }
    }

    onClickOutside() {
        // overwrite this method to be notified
        this.$.suggestItems.style.display = "none";
    }

    _dataUrlChanged(url) {
        if (url) {
            this.data = [];
            this.$.ajax.generateRequest();
        }
    }

    _fieldItem(item) {
        if (this.field) return item[this.field];
        else return item;
    }

    _focus() {
        this.$.suggestItems.style.display = "block";
        this.clickOutsideListen();
    }

    _selectItem(e) {
        if (this.field) this.value = e.target.value[this.field];
        else this.value = e.target.value;

        this._clickOutsideUnlisten();
        this.$.suggestItems.style.display = "none";
    }

    validate() {
        if (this.required !== null) {
            if ((this.required == true || this.required == "") && this.value) {
                this.$.myInput.invalid = false;
                return true;
            }
            else {
                this.$.myInput.invalid = true;
                return false;
            }
        }
    }

}

window.customElements.define('g-input-suggest', GInputSuggest);