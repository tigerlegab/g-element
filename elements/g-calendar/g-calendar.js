import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import './fc-style.js';

/**
 * `g-calendar`
 * Fullcalendar v4 integration to Polymer 3
 */

Polymer({
    _template: html`
        <style include="fc-style">
            #calendar {
                max-width: 900px;
                margin: 0 auto;
                @apply --g-calendar;
            }
        </style>

        <div id="calendar"></div>
    `,

    is: 'g-calendar',

    properties: {
        /**
        * The underlying FullCalendar element.
        *
        * @type Object
        */
        calendar: { type: Object, notify: true },
        /**
         * Options passed to FullCalendar.
         *
         * @type Object
         */
        options: {
            type: Object,
            observer: '_initialize',
            value: function () {
                return {};
            },
        },
        /**
         * Default fullCalendar plugins.
         * View https://fullcalendar.io/docs/plugin-index for all available plugins.
         * 
         * @readOnly
         * @type Array
         * @default [interactionPlugin, dayGridPlugin]
         */
        plugins: {
            type: Array,
            readOnly: true,
            notify: true,
            value: [interactionPlugin, dayGridPlugin]
        }
    },

    /**
     * Documentation - https://fullcalendar.io/docs
     * @param {*} options 
     */
    _initialize(options) {
        if (this.calendar) this.calendar.destroy();
        if (!options.plugins || options.plugins.length == 0) options.plugins = this.plugins;
        this.calendar = new Calendar(this.$.calendar, options);
        this.calendar.render();
    }
});