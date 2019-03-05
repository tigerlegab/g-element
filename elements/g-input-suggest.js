import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-list/iron-list.js';
import './g-icons.js';

class GInputSuggest extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                    box-sizing: border-box;
                    position: relative;

                    --paper-input-container-focus-color: var(--primary-color);
                    
                    --paper-icon-button: {
                        height: 24px;
                        width: 24px;
                        padding: 2px;
                    }
                }
                
                :host([hidden]), [hidden] {
                    display: none !important;
                }

                .default-icon-button {
                    line-height: 8px;
                }
                
                .suggest-items {
                    background: #fff;
                    position: absolute;
                    z-index: 100;
                    width: calc(100% - 1px);
                    max-height: 250px;
                    overflow-y: auto;
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
                    margin-bottom: 16px;
                    display: none;
                }

                .item {
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    min-height: var(--g-input-suggest-item-min-height, 36px);
                    padding: 0 16px;
                    line-height: 18px;
                    color: #333;
                    cursor: pointer;
                    font-size: 14px;
                }

                .item:hover {
                    background: #eee;
                }

                paper-spinner {
                    width: 18px;
                    height: 18px;
                }
            </style>
        
            <paper-input id="myInput"
                        label="[[label]]"
                        type="[[type]]"
                        disabled="{{disabled}}"
                        readonly="[[!searchable]]"
                        error-message="[[errorMessage]]"
                        required="[[required]]"
                        value="{{text}}"
                        allowed-pattern="[[allowedPattern]]"
                        pattern="[[pattern]]"
                        always-float-label="[[alwaysFloatLabel]]"
                        placeholder="[[placeholder]]"
                        invalid="{{invalid}}"
                        on-click="_tapped">

                    <slot name="prefix" slot="prefix"></slot>
                    <slot name="suffix" slot="suffix"></slot>

                    <paper-spinner slot="suffix" active="[[searching]]"></paper-spinner>
                    <paper-icon-button slot="suffix" class="default-icon-button" icon="g-icons:close" hidden="[[_computedHidden(searching, text, 'close')]]" on-tap="_clear"></paper-icon-button>
                    <paper-icon-button slot="suffix" class="default-icon-button" icon="[[_computedIcon(searchable)]]" hidden="[[_computedHidden(searching, text, '')]]"></paper-icon-button>
            </paper-input>

            <div id="suggestItems" class="suggest-items">
                <iron-list id="list" items="[[listItems]]" style="[[_computedHeight(listItems.length)]]" selection-enabled selected-item="{{selectedItem}}" scroll-target="suggestItems">
                    <template>
                        <div>
                            <div class="item" style="[[_computedStyle(selected)]]">
                                [[_textItem(item)]]
                            </div>
                        </div>
                    <template>
                </iron-list>
            </div>
        `;
    }

    static get properties() {
        return {
            /**
             * Setter/getter manually invalid input
             */
            invalid: {
                type: Boolean,
                notify: true,
                value: false
            },
            /**
             * `errorMessage` The error message to display when the input is invalid.
             */
            errorMessage: {
                type: String
            },
            /**
             * `label` Text to display as the input label
             */
            label: String,
            /**
             * `alwaysFloatLabel` Set to true to always float label
             */
            alwaysFloatLabel: {
                type: Boolean,
                value: false
            },
            /**
             * The placeholder text
             */
            placeholder: String,
            /**
             * `required` Set to true to mark the input as required.
             */
            required: {
                type: Boolean,
                value: false
            },
            /**
             * `searchable` Set to true to mark the input as searchable or readonly.
             */
            searchable: {
                type: Boolean,
                value: false
            },
            /**
             * `disabled` Set to true to mark the input as disabled.
             */
            disabled: {
                type: Boolean,
                value: false
            },
            /**
             * `items` Array or Array of objects for selectons
             */
            items: {
                type: Array,
                value: []
            },
            /**
             * Url to fetch for the items using fetch api
             */
            itemsUrl: {
                type: String,
                observer: '_itemUrlChanged'
            },
            /**
             * Property of local datasource to as the text property and will be used in sort and filter
             */
            textProperty: String,
            /**
             * Property of local datasource to as the value property
             */
            valueProperty: String,
            /**
             * `value` Selected string/object from the suggestions
             */
            value: {
                type: Object,
                notify: true
            },
            /**
             * The current/selected text of the input
             */
            text: {
                type: String,
                notify: true,
                value: ''
            },
            /**
             * `pattern` Pattern to validate input field
             */
            pattern: String,
            /**
             * `allowedPattern` allowedPattern to validate input field
             */
            allowedPattern: String,
            /**
             * Object containing the information of the currently selected item
             */
            selectedItem: {
                type: Object,
                notify: true,
                observer: '_selectedItemChanged'
            },
            /**
             * Indicates whether the clear button is tapped or not
             */
            clearTapped: {
                type: Boolean,
                value: false
            },
            /**
             * computed `items` Array or Array of objects for selectons
             */
            listItems: {
                type: Array,
                value: []
            }
        };
    }

    static get observers() {
        return [
            '_computeListItems(items, text)'
        ];
    }

    ready() {
        super.ready();
        this.clickOutsideListenerBinded = this._clickOutsideListener.bind(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._clickOutsideUnlisten();
    }

    clickOutsideListen() {
        this._clickOutsideUnlisten()
        window.addEventListener('click', this.clickOutsideListenerBinded, false);
    }

    _clickOutsideUnlisten() {
        window.removeEventListener('click', this.clickOutsideListenerBinded, false);
    }

    _clickOutsideListener(ev) {
        var isOutside = !ev.path.find(function (path) {
            return path === this
        }.bind(this));

        if (isOutside) {
            this.onClickOutside();
            this._clickOutsideUnlisten();
        }
    }

    onClickOutside() {
        this.$.suggestItems.style.display = "none";
        if (!this.selectedItem) {
            this.text = "";
            if (this.valueProperty) this.value = null;
        }
    }

    _itemUrlChanged(url) {
        if (url) {
            this.items = [];
            fetch(url, { method: "GET" })
                .then(response => { return response.json(); })
                .then(response => { this.items = response; })
                .catch(error => { this.dispatchEvent(new CustomEvent('fetch-error', { bubbles: false, composed: false, detail: error })); });
        }
    }

    _selectedItemChanged(item) {
        if (item) {
            if (this.textProperty) this.text = item[this.textProperty];
            else this.text = item;
            if (this.valueProperty) this.value = item[this.valueProperty];
            this._hideList();
        }
    }

    _tapped() {
        if (!this.clearTapped && !this.searchable) this._showList();
        if (this.clearTapped) this.clearTapped = false;
    }

    _computeListItems(items, text) {
        if (items.length > 0) {
            var list = JSON.parse(JSON.stringify(items));
            if (this.searchable) {
                if (text) {
                    if (!this.selectedItem) this._searching(list, text);
                    if (this.selectedItem && this.selectedItem[this.textProperty] !== text) this._searching(list, text)
                }
                else {
                    this.listItems = list;
                    if (this._debounceJob) this._debounceJob.cancel();
                    if (this.searching) this.searching = false;
                    if (this.selectedItem) {
                        if (this.valueProperty) this.value = null;
                        this.$.list.clearSelection();
                    }
                    this._hideList();
                }
            } else {
                if (!this.selectedItem) this.listItems = list;
            }
        }
    }

    _searching(list, text) {
        this.searching = true;
        this._debounceJob = Debouncer.debounce(this._debounceJob, timeOut.after(500), () => {
            if (this.textProperty) list = list.filter((item) => { return item[this.textProperty].toUpperCase().indexOf(text.toUpperCase()) > -1; });
            this.listItems = list;
            this._showList();
            this.searching = false;
        });
    }

    _showList() {
        this.$.suggestItems.style.display = "block";
        if (!this.selectedItem) {
            this.$.list.scroll(0, 0);
            this.$.list.dispatchEvent(new CustomEvent('resize', { bubbles: true, composed: true }));
        }
        this.clickOutsideListen();
    }

    _hideList() {
        this.$.suggestItems.style.display = "none";
        this._clickOutsideUnlisten();
    }

    _clear() {
        this.text = "";
        if (this.valueProperty) this.value = null;
        this.$.list.clearSelection();
        this.clearTapped = true;
        this.$.myInput.blur();
    }

    _textItem(item) {
        if (this.textProperty) return item[this.textProperty];
        return item;
    }

    _computedHeight(e) {
        if (e > 10) return 'height: 250px;';
    }

    _computedStyle(selected) {
        if (selected) return "font-weight: bold;";
        return "font-weight: 400;";
    }

    _computedIcon(searchable) {
        if (searchable) return 'g-icons:search';
        return 'g-icons:arrow-drop-down';
    }

    _computedHidden(searching, text, type) {
        if (searching) return searching;
        if (type === 'close') return !text;
        return text;
    }

    validate() {
        return this.$.myInput.validate();
    }
}

window.customElements.define('g-input-suggest', GInputSuggest);