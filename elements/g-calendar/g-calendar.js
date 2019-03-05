import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ScriptLoader } from '../../src/scriptLoader.js';
import { FullCalendarBehavior } from './fc-behavior.js';
import './fc-base-theme.js';

/**
 * `g-calendar`
 * Fullcalendar integration to Polymer 3
 */

const baseUrl = window.location.origin;
new ScriptLoader([
    baseUrl + '/node_modules/jquery/dist/jquery.min.js',
    baseUrl + '/node_modules/moment/min/moment.min.js',
    baseUrl + '/node_modules/fullcalendar/dist/fullcalendar.min.js'
], function () {
    // Initalize Polymer Element after all required scripts are loaded.
    // console.log('All scripts loaded! Initialize Polymer.');

    Polymer({
        _template: html`
            <style include="fc-base-theme">
            </style>
    
            <div id="calendar"></div>
        `,

        is: 'g-calendar',

        behaviors: [FullCalendarBehavior]
    });
});