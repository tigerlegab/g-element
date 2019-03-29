import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-styles/paper-styles.js';
import './g-icons.js';

Polymer({
    _template: html`
    <style>
        .header {
            min-height: 48px;
            color: var(--primary-text-color);
            @apply --layout-center;
            @apply --layout-justified;
            @apply --paper-font-subhead;
            @apply --g-expansion-panel-header;
        }
        .toggle {
            color: var(--disabled-text-color);
        }
        .content {
            @apply --paper-font-body1;
            @apply --g-expansion-panel-content;
        }
        .summary {
            @apply --g-expansion-panel-summary;
            color: var(--secondary-text-color);
        }
        .flex {
            @apply --layout-flex;
        }
    </style>

    <paper-item class="header" on-tap="_toggleOpened">
        <template is="dom-if" if="[[header]]">
            <div class="flex">[[header]]</div>

            <template is="dom-if" if="[[summary]]">
                <div hidden$="[[opened]]" class="flex summary">[[summary]]</div>
            </template>
        </template>

        <template is="dom-if" if="[[!header]]">
            <slot name="header"><div class="flex">&nbsp;</div></slot>
        </template>

        <paper-icon-button class="toggle" icon="[[_toggleIcon]]"></paper-icon-button>
    </paper-item>
    <iron-collapse class="content" opened="{{opened}}">
        <slot></slot>
    </iron-collapse>
    `,

    is: 'g-expansion-panel',
    properties: {
        /**
         * Text in the header row
         */
        header: {
            type: String,
            value: '',
        },
        /**
         * Summary of the expandible area
         */
        summary: String,
        /**
         * True if the content section is opened
         */
        opened: {
            type: Boolean,
            reflectToAttribute: true,
            notify: true
        },
        _toggleIcon: {
            type: String,
            computed: '_computeToggleIcon(opened)'
        }
    },
    // Private methods
    /**
     * Fired whenever the status is changed (opened/closed)
     *
     * @event toggle
     */
    _toggleOpened: function (e) {
        this.opened = !this.opened;
        this.fire('toggle', this);
    },
    _computeToggleIcon: function (opened) {
        return opened ? 'g-icons:expand-less' : 'g-icons:expand-more';
    }
});