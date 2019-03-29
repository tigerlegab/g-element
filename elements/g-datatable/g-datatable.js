import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { CollectionHelpers } from '../../src/collectionHelpers.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-media-query/iron-media-query.js';

import './g-datatable-styles.js';
import './g-datatable-column.js';

Polymer({
    _template: html`
        <style include="g-datatable-styles"></style>

        <iron-media-query query="(max-width: [[responseWidth]])" query-matches="{{mobileView}}"></iron-media-query>

        <div id="container" fixed-header$="[[headerFixed]]">
			<table mobile-view$="[[mobileView]]">
				<thead>
					<tr mobile-view$="[[mobileView]]">
						<template is="dom-if" if="[[selectable]]">
							<th mobile-view$="[[mobileView]]">
								<template is="dom-if" if="[[multiSelection]]">
									<div class="partialSelectionContainer">
										<div class="partialSelection" data-checked$="[[_partialSelection]]"></div>
										<paper-checkbox on-change="toggleAll" checked$="[[_allChecked(selectedKeys.splices, data.*)]]"
											style="position:absolute;left:0px;top:0px;"></paper-checkbox>
									</div>
								</template>
							</th>
						</template>

						<template id="columnRepeat" is="dom-repeat" items="[[_columns]]" as="column">
							<th class="column" data-column="[[column]]" mobile-view$="[[mobileView]]" style$="[[column._styleString]]">
								<span id="title">[[column.header]]</span>
							</th>
						</template>
                    </tr>
                    <tr class="progress" data-progress$="[[progress]]" mobile-view$="[[mobileView]]">
						<th colspan$="[[_numberOfColumnsPlusOne(_columns.splices)]]">
                            <paper-progress indeterminate></paper-progress>
						</th>
					</tr>
					<tr hidden$="[[!_noItemsVisible(_rowKeys.splices)]]" mobile-view$="[[mobileView]]">
						<th colspan$="[[_numberOfColumnsPlusOne(_columns.splices)]]" style="text-align:center;">
							<slot name="no-results">No data found.</slot>
						</th>
					</tr>
				</thead>
                
                <tbody mobile-view$="[[mobileView]]">
                    <template id="rowRepeat" is="dom-repeat" items="[[_rowKeys]]" as="rowKey" on-dom-change="_restructureData">
                        <tr data-key$="[[rowKey]]" mobile-view$="[[mobileView]]" data-selected$="[[_isRowSelected(rowKey, selectedKeys.splices)]]" style$="[[_customRowStyle(rowKey)]]">
                            <template is="dom-if" if="[[selectable]]">
                                <td on-tap="_cellTapped" mobile-view$="[[mobileView]]">
                                    <paper-checkbox checked$="[[_isRowSelected(rowKey, selectedKeys.splices)]]" on-change="_setSelection"></paper-checkbox>
                                </td>
                            </template>

                            <template id="cellRepeat" is="dom-repeat" items="[[_columns]]" as="column" on-dom-change="_restructureData">
                                <td data-empty class="bound-cell" mobile-view$="[[mobileView]]"	data-column="[[column]]" on-tap="_cellTapped">
                                    <div>
                                        <p class="mobileHeader" hidden$="[[!mobileView]]"></p>
                                        <span></span>
                                    </div>
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
			</table>
		</div>
    `,

    is: 'g-datatable',

    properties: {
        /**
         * Read only array of all the `g-datatable-column`'s
         *
         * @attribute _columns
         * @type Array
         */
        _columns: {
            type: Array
        },
        /**
         * Array of objects containing the data to be shown in the table.
         *
         * @attribute data
         * @type Array
         * @required
         */
        data: {
            type: Array,
            value: [],
            notify: true
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
         * Whether to show checkboxes on the left to allow row selection.
         *
         * @attribute selectable
         * @type Boolean
         * @default false
         */
        selectable: {
            type: Boolean
        },
        /**
         * Whether to allow selection of more than one row.
         *
         * @attribute multiSelection
         * @type Boolean
         * @default false
         */
        multiSelection: {
            type: Boolean,
            value: false
        },
        /**
         * If `multi-selection` then this contains an array of selected row keys.
         *
         * @attribute selectedIds
         * @type Array
         * @default []
         */
        selectedKeys: {
            type: Array,
            notify: true,
            value: []
        },
        /**
         * If `multi-selection` is off then this contains the key of the selected row.
         *
         * @attribute selectedId
         * @type Object
         */
        selectedKey: {
            type: Object,
            notify: true
        },
        /**
         * If `multi-selection` is off then this contains the selected row.
         *
         * @attribute selectedId
         * @type Object
         */
        selectedItem: {
            type: Object,
            notify: true,
            computed: '_getByKey(selectedKey)'
        },
        /**
         * If `multi-selection` is on then this contains an array of the selected rows.
         *
         * @attribute selectedId
         * @type Object
         */
        selectedItems: {
            type: Array,
            notify: true,
            computed: '_getSelectedItems(selectedKeys.splices)'
        },
        /**
         * Whether to show the progress bar. As the progress bar is often not used in standalone
         * `<g-datatable>'s the `<paper-progress>` element isn't included by default and needs to be
         * manually imported.
         *
         * @attribute progress
         * @type Boolean
         * @default false
         */
        progress: {
            type: Boolean,
            value: false
        },
        /**
         * Response width to show datatable on mobile devices
         *
         * @attribute responseWidth
         * @type String
         * @default '767px'
         */
        responseWidth: {
            type: String,
            value: '767px'
        },
        /**
         * Fix column header to the top of the page on scroll
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
         * @attribute headerFixed
         * @type String
         */
        height: {
            type: String
        },
        /**
         * Indicates wheter the query match in iron media query
         *
         * @attribute mobileView
         * @type Boolean
         */
        mobileView: {
            type: Boolean,
            notify: true
        },
        /**
         * @private
         */
        _rowKeys: Array,
        _partialSelection: Boolean,
    },

    observers: [
        '_setRowKeys(data.splices)',
        '_setPartialSelection(selectedKeys.splices, data.*)',
        '_setFixedTableBodyHeight(mobileView, height)'
    ],

    ready() {
        this.set('_columns', []);
        this.set('selectedKeys', []);
        this._observer = dom(this).observeNodes(function (info) {
            this._queryAndSetColumns();
        });
    },

    _dataUrlChanged(url) {
        if (url) {
            this.set('data', []);
            fetch(url, { method: "GET" })
                .then(response => { return response.json(); })
                .then(response => { this.set('data', response); })
                .catch(error => { this.fire('fetch-error', error); });
        }
    },

    _queryAndSetColumns() {
        var columns = this.queryAllEffectiveChildren('g-datatable-column');
        var self = this;
        columns.forEach(function (column, index) {
            if (!column.beenAttached.state.ready) {
                column.parentNodeRef = self;
                self.async(function () {
                    column.beenAttached.ready();
                });
                column.index = index;
            }
        });
        var inactiveColumns = columns.filter(function (column) { return !column.inactive });
        this.set('_columns', inactiveColumns);
    },

    _setRowKeys() {
        if (this.data) {
            var rowKeys = [];
            this._dataKeyCollection = new CollectionHelpers(this.data);
            this.data.forEach(function (row) {
                var key = this._getKeyByItem(row);
                if ('filter' in this) {
                    if (this.filter(row, key, this.data)) {
                        rowKeys.push(key);
                    }
                } else {
                    rowKeys.push(key);
                }
            }.bind(this));
            this.set("_rowKeys", rowKeys);
        }
    },

    /**
     * If you have been changing data on the `data` property outside of the official Polymer functions
     * calling this function *may* get you the updates you want.
     */
    reload() {
        this._setRowKeys();
    },

    /**
     * Hardcore reset of the entire element. Sets `data` to `[]` and resets all cells.
     */
    reset() {
        this.set('data', []);
        this._reset();
    },

    _reset() {
        var cells = this.shadowRoot.querySelectorAll('.bound-cell');
        Array.prototype.forEach.call(cells, this._resetCell.bind(this));
        this.$.rowRepeat.render();
        var cellRepeatList = this.shadowRoot.querySelector('#cellRepeat');
        Array.prototype.forEach.call(cellRepeatList, function (cr) { return cr.render(); });
    },

    _resetCell(cell) {
        cell.setAttribute('data-empty', true);
        cell.removeAttribute('data-row-key');
        delete cell.dataColumn;
        delete cell.instance;
    },

    _restructureData() {
        this.debounce('restructure data', function () {
            var rows = this.shadowRoot.querySelectorAll('tbody tr');
            // loop through the rows
            for (var rowI = 0; rowI < rows.length; rowI++) {
                var row = rows[rowI];
                //find the data that belongs with the row
                var rowData = this.get(['data', rowI]);
                //prevent errors if row empty
                if (!rowData) return;
                var cells = dom(row).querySelectorAll('.bound-cell');
                var self = this;
                cells.forEach(function (cell, index) {
                    if (!cell.dataColumn) {
                        console.warn(cell);
                    }

                    if (cell) {
                        cell.removeAttribute('data-empty');
                        var prop = cell.dataColumn.property;
                        var data = rowData[prop];
                        cell.setAttribute('data-row-key', row.dataset.key);
                        cell.dataBoundColumn = cell.dataColumn;

                        if (cell.dataColumn.cellStyle.length > 0) {
                            cell.setAttribute('style', cell.dataColumn.cellStyle);
                        } else {
                            cell.setAttribute('style', '');
                        }

                        if (cell.style['text-align'] == '' && cell.dataColumn.align) {
                            cell.style['text-align'] = cell.dataColumn.align;
                        }

                        if (cell.style['min-width'] == '' && cell.dataColumn.width) {
                            cell.style['min-width'] = cell.dataColumn.width;
                        }

                        if (cell.dataColumn.template && !cell.dataColumn.dialog) {
                            var instance = cell.dataColumn._createCellInstance(
                                rowData,
                                row.dataset.key
                            );
                            cell.instance = instance;
                            cell.instanceType = 'inline';
                            cell.querySelector('p').textContent = self._columns[index].header;
                            var spanTag = cell.querySelector('span');
                            spanTag.textContent = '';
                            spanTag.appendChild(instance.root);
                        } else {
                            if (cell.instance) delete cell.instance;
                            //added text to span
                            cell.querySelector('p').textContent = self._columns[index].header;
                            cell.querySelector('span').textContent = cell.dataColumn._formatValue(data);
                            // cell.textContent = data;
                        }
                    }
                });

            }
        });
    },

    /**
     * Triggered by clicking the top left checkmark. If all are checked it will deselect all checked items.
     * If some or none are checked it will select all items
     */
    toggleAll() {
        if (this.data) {
            var allChecked = this._allChecked();
            this.data.forEach(function (item) {
                if (allChecked) {
                    this.deselect(item);
                } else {
                    this.select(item);
                }
            }.bind(this))
        }
    },

    /**
     * Select the specified item. Ignore the `notify` parameter.
     *
     * @param item
     * @param Boolean [notify=false] whether to trigger a `selection-changed` event.
     */
    select(item, notify) {
        notify = typeof notify === 'undefined' ? true : notify;

        var key = this._getKeyByItem(item);
        if (this.multiSelection) {
            if (this.selectedKeys.indexOf(key) == -1) {
                this.push('selectedKeys', key);
            }
        } else {
            this.set('selectedKey', key);
        }
        if (notify) this._fireCustomEvent(this, "selection-changed", { selected: [key] });
    },

    /**
     * Deselect the specified item. Ignore the `notify` parameter.
     *
     * @param item
     * @param Boolean [notify=false] whether to trigger a `selection-changed` event.
     */
    deselect(item, notify) {
        notify = typeof notify === 'undefined' ? true : notify;

        var key = this._getKeyByItem(item);
        if (this.multiSelection) {
            var i = this.selectedKeys.indexOf(key);
            this.splice('selectedKeys', i, 1);
        } else {
            this.set('selectedKey', null);
            this.set('selectedKeys', []);
        }
        if (notify) this._fireCustomEvent(this, "selection-changed", { deselected: [key] });
    },

    /**
     * Deselect all currently selected items. Ignore the `notify` parameter.
     */
    deselectAll(notify) {
        if (this.multiSelection) {
            this.selectedItems.forEach(function (item) {
                this.deselect(item, notify);
            }.bind(this));
        } else {
            this.deselect(this.selectedItem, notify);
        }
    },

    _allChecked() {
        if (this.data) {
            var allChecked = true;
            this.data.forEach(function (item) {
                var key = this._getKeyByItem(item);
                if (this.selectedKeys.indexOf(key) == -1) {
                    allChecked = false;
                }
            }.bind(this));
            return allChecked && this.data.length > 0;
        }
    },

    _someChecked() {
        return this.selectedKeys.length > 0 && !this._allChecked();
    },

    _isRowSelected(key) {
        if (this.multiSelection) {
            return this.selectedKeys.indexOf(key) > -1;
        } else {
            return this.selectedKey == key;
        }
    },

    _setSelection(ev) {
        var key = ev.model.rowKey;
        if (ev.target.checked) {
            if (!this.multiSelection) this.selectedKey = key;
            this.push('selectedKeys', key);
            this._fireCustomEvent(this, "selection-changed", { selected: [key] });
        } else {
            if (!this.multiSelection) this.selectedKey = null;
            this.splice('selectedKeys', this.selectedKeys.indexOf(key), 1);
            this._fireCustomEvent(this, "selection-changed", { deselected: [key] });
        }
    },

    _toggleSelection(key) {
        if (this.selectable) {
            var checked = this.multiSelection ? this.selectedKeys.indexOf(key) > -1 : this.selectedKey == key;
            if (checked) {
                if (!this.multiSelection) this.selectedKey = null;
                this.splice('selectedKeys', this.selectedKeys.indexOf(key), 1);
                this._fireCustomEvent(this, "selection-changed", { deselected: [key] });
            } else {
                if (!this.multiSelection) this.selectedKey = key;
                this.push('selectedKeys', key);
                this._fireCustomEvent(this, "selection-changed", { selected: [key] });
            }
        }
    },

    /**
     * Wrapper for platform custom event emitter
     */
    _fireCustomEvent(context, eventName, eventBody, eventSettings) {
        if (!eventBody) {
            eventBody = {};
        }
        if (!eventSettings) {
            eventSettings = {
                bubbles: false,
                composed: false
            }
        }
        var newEvent = new CustomEvent(eventName, { detail: eventBody, bubbles: eventSettings.bubbles, composed: eventSettings.composed });
        context.dispatchEvent(newEvent);
        return newEvent;
    },

    _cellTapped(ev) {
        var path = ev.composedPath();
        var cell;
        for (var i = 0; i < path.length; i++) {
            if (path[i].nodeName.toLowerCase() == 'td') {
                cell = path[i];
            }

            if (path[i].nodeName.toLowerCase() == 'tr') {
                break;
            }
        }

        var rowModel = this.$.rowRepeat.modelForElement(cell);
        if (ev.model.column) {
            this._toggleSelection(rowModel.rowKey);
        }
    },

    _getKeyByItem(item) {
        return this._dataKeyCollection.getKey(item);
    },

    _getByKey(key) {
        if (key === null) return null;
        if (typeof key === 'object') return key.map(this._getByKey.bind(this));
        return this._dataKeyCollection.getItem(key);
    },

    _getSelectedItems() {
        var data = this.multiSelection ? this._getByKey(this.selectedKeys) : [];
        return data;
    },

    _numberOfColumnsPlusOne() {
        return this._columns.length + 1;
    },

    /**
     * Method that can be overwritten to apply a custom style to specific rows.
     *
     * IMPORTANT: This is a property, not a method you should call directly.
     */
    customRowStyle(rowItem) {

    },

    _customRowStyle(rowKey) {
        return this.customRowStyle(this._getByKey(rowKey));
    },

    _noItemsVisible() {
        if (this._rowKeys) return this._rowKeys.length === 0;
        else return true;
    },

    _setPartialSelection() {
        this.set('_partialSelection', this._someChecked());
    },

    _setFixedTableBodyHeight(mobileView, height) {
        if (this.headerFixed && !mobileView && height) {
            this.shadowRoot.querySelector('#container').style.height = height;
        }
    },
});