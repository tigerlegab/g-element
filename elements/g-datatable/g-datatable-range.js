import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../g-icons.js';

Polymer({
    _template: html`
        <custom-style>
            <style is="custom-style" include="iron-flex iron-flex-alignment iron-positioning"></style>
            <style is="custom-style">
                :host {
                    display: block;
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
            </style>
        </custom-style>

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
    `,

    is: 'g-datatable-range',

    properties: {
        /**
         * Array or Array of objects containing the data to be shown in the table.
         *
         * @attribute data
         * @type Array
         * @required
         */
        data: {
            type: Array
        },
        /**
         * Array or Array of objects containing the data to be shown in the table.
         *
         * @attribute visibleData
         * @type Array
         * @readOnly
         */
        visibleData: {
            type: Array,
            notify: true,
            readOnly: true
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
        }
    },

    observers: [
        'setVisibleData(data.splices, _pageIndex)'
    ],

    /**
     * Set the current visible data
     */
    setVisibleData() {
        if (this.data) {
            const _dataCache = JSON.parse(JSON.stringify(this.data));
            if (_dataCache.length > 0) this._setVisibleData(_dataCache.splice(this._pageIndex, this.pageSize));
            else this._setVisibleData([]);
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
        this.set("_pageIndex", (this.page - 1) * this.pageSize);
    },

    _prevPageDisabled() {
        return this.page == 1;
    },

    _nextPageDisabled() {
        return this.page * this.pageSize >= this._numberOfItems;
    },

    _setNumberOfItems(length) {
        return length;
    }
});