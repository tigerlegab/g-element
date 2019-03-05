import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './all-js/fc-base-theme.js';
import './all-js/fc-deps.js';
import './all-js/fc-behavior.js';

/**
 * `g-calendar`
 * Fullcalendar integration to Polymer 3
 * 
 * TODO: Find a better way to import dependencies, set a timeout functions for now.
 */

Polymer({
    _template: html`
        <style include="fc-base-theme">
        </style>

        <div id="calendar"></div>
    `,

    is: 'g-calendar',

    behaviors: [
        FullCalendarBehavior,
    ]
});