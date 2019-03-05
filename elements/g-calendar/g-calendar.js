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

new ScriptLoader([
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.0/fullcalendar.min.js'
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