import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import { Whenever } from '../../src/whenever.js';

Polymer({
    _template: html`
        <style>
          :host {
            display: block;
          }
        </style>

        <template is="dom-repeat" items="[[value]]" as="arrayItem">
            <div class="array-item">[[_getArrayItemLabel(column, arrayItem)]]</div>
        </template>
    `,

    is: 'g-datatable-column',

    properties: {
        /**
         * String displayed in `<th></th>`
         *
         * @attribute header
         * @type String
         * @required
         */
        header: {
            type: String,
            notify: true,
        },
        /**
         * The property to be used from `data` for this column
         *
         * @attribute property
         * @type String
         * @required
         */
        property: String,
        /**
         * The type of the property (can be 'String', 'Number', 'Array', 'Date', etc.)
         * Used for sorting and default display
         *
         * @attribute type
         * @type String
         * @default 'String'
         */
        type: {
            type: String,
            value: 'String'
        },
        /**
         * If `type` is an `Array` and the array consists of `Object`s it's a common need
         * to display a single property of every object (in non-editable mode).
         *
         * @attribute arrayDisplayProp
         * @type String
         */
        arrayDisplayProp: String,
        /**
         * Style to be applied to every cell.
         *
         * @attribute cellStyle
         * @type String
         */
        cellStyle: {
            type: String,
            value: ''
        },
        /**
         * Convenience attribute to align the header and cell content (e.g. 'center')
         *
         * @attribute align
         * @type String
         * @default 'left'
         */
        align: {
            type: String,
            value: 'left'
        },
        /**
         * Style to be applied to the header.
         *
         * @attribute style
         * @type String
         */
        _styleString: {
            type: String,
            value: function () {
                var alignment = this.align || this.getAttribute('align') || 'left';
                var minWidth = this.width || this.getAttribute('width') || 0;
                minWidth += parseFloat(minWidth).toString() === minWidth ? 'px' : '';
                var styleString = this.getAttribute('style') || '';
                return 'text-align:' + alignment + ';min-width:' + minWidth + ';' + styleString;
            }
        },
        /**
         * If you have `undefined`'s in your `data` this method can be used to
         * set a default, thus preventing auto-saves from triggering.
         *
         * @attribute default
         * @type Object
         */
        default: Object,
        /**
         * Can be overwritten to manually format the value in a non-editable state
         *
         * IMPORTANT: This is a property, not a method you should call directly.
         *
         * @attribute formatValue
         * @type Function
         * @default see code
         */
        formatValue: Function,
        /**
         * Removing and adding columns entirely from the DOM is a bit hard, so instead there is this
         * convenience method to entirely disable a column.
         *
         * @attribute inactive
         * @type Boolean
         * @default false
         */
        inactive: {
            type: Boolean,
            observer: '_requeryColumnList'
        },
        /**
         * Convenience attribute to set min-width
         *
         * @type Number in px or String
         */
        width: Object
    },

    behaviors: [Templatizer],

    created() {
        this.beenAttached = new Whenever();
    },

    attached() {
        var template = dom(this).querySelector('template');
        if (template) {
            this._instanceProps = {};
            this._instanceProps.item = true;
            this._instanceProps.value = true;
            this._instanceProps.column = true;
            this.templatize(template);
            this.template = true;
        }
    },

    _createCellInstance(model, notificationKey) {
        if (typeof model[this.property] == 'undefined' && typeof this.default !== 'undefined') {
            var instance = this.stamp({ item: model, column: this, value: this.default, _dataKey: notificationKey });
        } else {
            var instance = this.stamp({ item: model, column: this, value: model[this.property], _dataKey: notificationKey });
        }
        return instance;
    },

    _formatValue(data) {
        data = this._cast(data);
        if ('formatValue' in this) {
            return this.formatValue(data);
        }
        if (typeof data == 'undefined') {
            return '';
        }
        var value = this._cast(data);
        if (this.type.toLowerCase() == 'string') {
            if (window.innerWidth < 640 && value.length > 55) return value.slice(0, 55) + "...";
            return value;
        } else if (this.type.toLowerCase() == 'number') {
            return value;
        } else if (this.type.toLowerCase() == 'boolean') {
            return value ? 'Yes' : 'No';
        } else if (this.type.toLowerCase() == 'date') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return ("0" + value.getDate()).slice(-2) + "-" + monthNames[value.getMonth()] + "-" + value.getFullYear();
        } else {
            console.warn('Complex objects should implement their own template or format-value function.', data);
            return '?';
        }
    },

    _cast(value) {
        if (typeof value === 'undefined' || value === null) {
            if (typeof this.default !== 'undefined') {
                value = JSON.parse(JSON.stringify(this.default));
            } else {
                value = '';
            }
        }

        if (this.type.toLowerCase() == 'string') {
            return value.toString();
        } else if (this.type.toLowerCase() == 'number') {
            return parseFloat(value);
        } else if (this.type.toLowerCase() == 'boolean') {
            return value ? true : false;
        } else if (this.type.toLowerCase() == 'date') {
            return new Date(value);
        } else {
            return value;
        }
    },

    _requeryColumnList() {
        //only trigger this if ready, anything before that point will be handled automatically during
        // initial initialization.
        if (this.beenAttached.state.ready) {
            this.parentNodeRef._queryAndSetColumns();
        }
    },

    _getArrayItemLabel(column, value) {
        return column.arrayDisplayProp ? value[column.arrayDisplayProp] : value;
    }
});
