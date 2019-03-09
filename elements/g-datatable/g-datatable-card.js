import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './g-datatable.js';
import '../g-icons.js';

Polymer({
    _template: html`
        <custom-style>
            <style is="custom-style" include="iron-flex iron-flex-alignment iron-positioning paper-material-styles"></style>
            <style is="custom-style">
                :host {
                    display: block;
                    @apply --paper-font-common-base;
                }

                .paper-material {
                    border-radius: 2px;
                    background: white;
                    @apply --g-datatable-card;
                }

                #selectionToolbar {
                    display: none;
                    background: var(--g-datatable-selection-toolbar-color, var(--paper-pink-50));
                    @apply --g-datatable-selection-toolbar;
                    padding: 0px 12px 0px 24px;
                }

                #selectionToolbar .selectionHeader,
                #selectionToolbar .toolbar ::content paper-icon-button {
                    color: var(--g-datatable-selection-toolbar-text-color, var(--accent-color));
                }

                #selectionToolbar[data-visible] { display: flex; }
                #selectionToolbar .toolbar { display: none; }

                #selectionToolbar .toolbar[data-visible] { display: flex; }

                #toolbar-main {
                    padding-right: 12px;
                    @apply --g-datatable-toolbar-main;
                }

                #topBlock {
                    height: 64px;
                    padding: 0px 6px 0px 24px;
                    position: relative;
                    @apply --g-datatable-top-toolbar;
                }

                #topBlock .header {
                    font-size: 20px;
                    @apply --paper-font-common-base;
                    color: var(--g-datatable-top-toolbar-text-color);
                    @apply --g-datatable-top-toolbar-header;
                }

                #selectionToolbar> ::content paper-icon-button, .toolbar> ::content paper-icon-button,
                #selectionToolbar> ::content paper-icon, .toolbar> ::content paper-icon,
                #selectionToolbar> ::content iron-icon, .toolbar> ::content iron-icon {
                    color: var(--g-datatable-selection-toolbar-icon-color, var(--accent-color));
                }

                #toolbar-main ::content paper-icon-button,
                #toolbar-main ::content paper-icon,
                #toolbar-main ::content iron-icon {
                    color: var(--g-datatable-top-toolbar-icon-color);
                }

                #topBlock .selectionHeader {
                    font-size: 16px;
                    @apply --paper-font-common-base;
                }

                #bottomBlock {
                    height: 56px;
                    padding: 0px 6px;
                    border-top: 1px solid var(--g-datatable-divider-color, var(--divider-color));
                    color: var(--g-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54));
                    align-items: center;
                    font-size: 12px;
                    text-align: center;
                    font-weight: 500;
                    @apply --g-datatable-navigation-bar;
                }

                #bottomBlock paper-dropdown-menu {
                    vertical-align: middle;
                    margin-right: 18px;

                    --paper-input-container-underline: { display: none; };
                    --paper-input-container-input: {
                        text-align: right;
                        font-size: 12px;
                        font-weight: 500;
                        color: var(--g-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54));
                    };
                    --paper-dropdown-menu-icon: {
                        color: var(--g-datatable-navigation-bar-text-color, rgba(0, 0, 0, .54));
                    };
                }

                #datatable-holder {
                    overflow-x: auto;
                }
            </style>
        </custom-style>

        <div class="paper-material" elevation="1">
            <div class="horizontal center layout" id="topBlock">
                <div class="flex header">
                    <span>[[header]]</span>
                </div>
                <div id="toolbar-main" class="toolbar">
                    <slot name="toolbar-main"></slot>
                </div>
                <div id="selectionToolbar" class="horizontal center layout fit" data-visible$="[[_selectedToolbarVisible]]">
                    <div class="flex selectionHeader">
                        <slot name="selection-header">
                            <span>[[_numberOfSelectedItems]]</span> selected
                        </slot>
                    </div>
                    <div class="toolbar" data-visible$="[[_singleSelectToolbarVisible]]">
                        <slot name="toolbar-select-single"></slot>
                    </div>
                    <div class="toolbar" data-visible$="[[_multiSelectToolbarVisible]]">
                        <slot name="toolbar-select-multi"></slot>
                    </div>
                    <div class="toolbar" data-visible>
                        <slot name="toolbar-select"></slot>
                    </div>
                </div>
            </div>
            <div id="datatable-holder">
                <slot></slot>
            </div>
            <div class="horizontal center layout" id="bottomBlock">
                <div class="flex"></div>
                <div>
                    <slot name="footer-tool"></slot>
                </div>
                <span>
                    <span>[[_getRangeStart(page, pageSize, _numberOfItems)]]</span> -
                    <span>[[_getRangeEnd(page, pageSize, _numberOfItems)]]</span> of&nbsp;
                    <span>[[_numberOfItems]]</span>
                </span>
                <paper-icon-button icon="g-icons:first-page" on-tap="firstPage" disabled="[[_prevPageDisabled(page)]]"></paper-icon-button>
                <paper-icon-button icon="g-icons:prev-page" on-tap="prevPage" disabled="[[_prevPageDisabled(page)]]"></paper-icon-button>
                <paper-icon-button icon="g-icons:next-page" on-tap="nextPage" disabled="[[_nextPageDisabled(page, pageSize, _numberOfItems)]]"></paper-icon-button>
                <paper-icon-button icon="g-icons:last-page" on-tap="lastPage" disabled="[[_nextPageDisabled(page, pageSize, _numberOfItems)]]"></paper-icon-button>
            </div>
        </div>
    `,

    is: 'g-datatable-card',

    properties: {
        /**
         * Heading shown above the data table
         *
         * @attribute String
         * @default ''
         * @type Object
         */
        header: String,
        /**
         * Array of objects containing the data to be shown in the table.
         *
         * @attribute data
         * @type Array
         * @required
         */
        data: {
            type: Array
        },
        /**
         * Fecth data from the given url using fetch api.
         *
         * @attribute dataUrl
         * @type String
         */
        dataUrl: {
            type: String,
            observer: '_dataUrlChanged'
        },
        /**
         * Number of items per page
         *
         * @attribute pageSize
         * @default 10
         * @type Number
         */
        pageSize: {
            type: Number,
            value: 10
        },
        /**
         * Current page shown
         *
         * @attribute Number
         * @default 1
         * @type Object
         */
        page: {
            type: Number,
            value: 1,
            notify: true
        },
        /**
         * Fix table header to the top of the page on scroll
         *
         * @attribute headerFixed
         * @type Boolean
         * @default false
         */
        headerFixed: {
            type: Boolean,
            value: false
        },
        /**
         * This is required for headerFixed to work
         *
         * @height headerFixed
         * @type String
         * @default 442px
         */
        height: {
            type: String,
            value: '442px'
        },
        /**
         * datatable element holder
         *
         * @private
         */
        _datatable: {
            type: Object
        },
        /**
         * Total number of items
         * 
         * @private
         */
        _numberOfItems: {
            type: Number,
            computed: '_setNumberOfItems(data.length)'
        },
        /**
         * Current page index
         * 
         * @private
         */
        _pageIndex: {
            type: Number,
            value: 0
        },
        _selectedToolbarVisible: Boolean,
        _singleSelectToolbarVisible: Boolean,
        _multiSelectToolbarVisible: Boolean,
        _numberOfSelectedItems: Number,
    },

    observers: [
        'setVisibleData(data.splices, _pageIndex)',
        'setDatatableFixedHeight(height)'
    ],

    ready() {
        this._datatable = dom(this).querySelector("g-datatable");
        this._datatable.addEventListener("selection-changed", this._setSelectedToolbarVisible.bind(this));
        this.setDatatableFixedHeight();
    },

    /**
     * Set current visble data for datatable
     * Call this function to reset datatable visible data
     */
    setVisibleData() {
        if (this.data && this._datatable) {
            const _dataCache = JSON.parse(JSON.stringify(this.data));
            if (this._numberOfSelectedItems && this._numberOfSelectedItems > 0) this.deselectAll();
            if (_dataCache.length > 0) this._datatable.data = _dataCache.splice(this._pageIndex, this.pageSize);
            else this._datatable.data = [];
        }
    },

    /**
     * If headerFixed is `true` set datatable height
     * Call this function to manually update the datatable height
     */
    setDatatableFixedHeight() {
        if (this.headerFixed && this.height && this._datatable) {
            var holder = this.shadowRoot.querySelector('#datatable-holder');
            if (!this._datatable.headerFixed) {
                var header = this.shadowRoot.querySelector('#topBlock');
                holder.style.height = this.height;
                holder.onscroll = () => {
                    var stop = holder.scrollTop - (holder.clientTop || 0);
                    if (stop == 0) header.style.borderBottom = "none";
                    if (stop > 0) header.style.borderBottom = "1px solid #ddd";
                };
            }
            if (this._datatable.headerFixed && !this._datatable.height) {
                this._datatable.height = this.height;
            }
        }
    },

    /**
     * Set data from the given url
     */
    _dataUrlChanged(url) {
        if (url) {
            this.set('data', []);
            fetch(url, { method: "GET" })
                .then(response => { return response.json(); })
                .then(response => { this.set('data', response); })
                .catch(error => { this.fire('fetch-error', error); });
        }
    },

    _getRangeStart() {
        if (this._numberOfItems > 0) return (this.page - 1) * this.pageSize + 1;
        return 0;
    },

    _getRangeEnd() {
        return Math.min((this.page * this.pageSize), this._numberOfItems);
    },

    /**
     * Navigate to the next page
     */
    nextPage() {
        this.set("page", this.page + 1);
        this.set("_pageIndex", this._pageIndex + this.pageSize);
    },

    /**
     * Navigate to the previous page
     */
    prevPage() {
        this.set("page", this.page - 1);
        this.set("_pageIndex", this._pageIndex - this.pageSize);
    },

    /**
     * Navigate to the first page
     */
    firstPage() {
        this.set("page", 1);
        this.set("_pageIndex", 0);
    },

    /**
     * Navigate to the last page
     */
    lastPage() {
        this.set("page", Math.ceil(this._numberOfItems / this.pageSize));
        this.set("_pageIndex", this.data.length - this.pageSize);
    },

    _prevPageDisabled() {
        return this.page == 1;
    },

    _nextPageDisabled() {
        return this.page * this.pageSize >= this._numberOfItems;
    },

    _setSelectedToolbarVisible() {
        if (this._datatable.multiSelection) {
            const numberOfSelectedItems = this._datatable.selectedKeys.length;
            this._selectedToolbarVisible = numberOfSelectedItems > 0;
            this._multiSelectToolbarVisible = numberOfSelectedItems > 1;
            this._numberOfSelectedItems = numberOfSelectedItems;
            this._singleSelectToolbarVisible = numberOfSelectedItems == 1;
        } else {
            this._selectedToolbarVisible = this._datatable.selectedKey;
            this._numberOfSelectedItems = this._datatable.selectedKey ? 1 : 0;
            this._singleSelectToolbarVisible = this._datatable.selectedKey;
        }
    },

    _setNumberOfItems(length) {
        return length;
    },

    /**
     * Deselect all items
     */
    deselectAll() {
        if (this._datatable.multiSelection) this._datatable.deselectAll(false);
        else {
            this._datatable.selectedKey = null;
            this._datatable.selectedKeys = [];
        }
        this._setSelectedToolbarVisible();
    },

    /**
     * Select the specific item
     * @param item
     */
    select(item) {
        this._datatable.select(item, false);
        this._setSelectedToolbarVisible();
    },
});