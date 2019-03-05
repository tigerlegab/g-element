import '@polymer/polymer/polymer-legacy.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

/**
 * @polymerBehavior FullCalendarBehavior
 * @reference https://github.com/sorin-davidoi/fullcalendar-calendar
 */

export const FullCalendarBehavior = (function () {
    'use strict';

    return {
        properties: {
            /**
             * Fired when a new date-range is rendered, or when the view type switches.
             * [Documentation](http://fullcalendar.io/docs/viewRender/)
             *
             * @event view-render
             * @param {object} view the View Object for the new view
             * @param {object} element a jQuery element for the container of the new view
             */

            /**
             * Fired after the calendar's dimensions have been changed due to the browser window being resized.
             * [Documentation](http://fullcalendar.io/docs/windowResize/)
             *
             * @event window-resize
             * @param {object} view the current View Object
             */

            /**
             * The underlying FullCalendar element.
             *
             * @type Object
             */
            _calendar: { type: Object, notify: true },

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

            _originalCallbacks: { type: Object },

            _callbacks: {
                type: Object,
                readOnly: true,
                value: function () {
                    var calendar = this;

                    function fireEvent(name, argumentNames) {
                        return function () {
                            if (calendar._originalCallbacks[name]) {
                                calendar._originalCallbacks[name].apply(this, arguments);
                            }

                            var detail = {};

                            for (var i = 0; i < argumentNames.length; i++) {
                                detail[argumentNames[i]] = arguments[i];
                            }

                            calendar.fire(camelCaseToUnderscore(name), detail);
                        };
                    }

                    // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase#comment14968137_6661012
                    function camelCaseToUnderscore(value) {
                        return value.replace(/([a-z][A-Z])/g, function (g) { return g[0] + '-' + g[1].toLowerCase() });
                    }

                    return {
                        viewRender: fireEvent('viewRender', ['view', 'element']),
                        windowResize: fireEvent('windowResize', ['view']),
                    };
                },
            },
        },

        ready() {
            this._calendar = $(this.$.calendar);
        },

        /**
         * Initialized the calendar with the provided options.
         */
        _initialize(options) {
            this.async(function () {
                // Clear the previously saved callbacks
                this._originalCallbacks = {};

                var calendarOptions = {};

                Object.keys(options).forEach(function (key) {
                    calendarOptions[key] = options[key];
                });

                // Hook-up our callback such that we can fire events
                Object.keys(this._callbacks).forEach(function (key) {
                    this._originalCallbacks[key] = options[key];
                    calendarOptions[key] = this._callbacks[key];
                }.bind(this));

                this._calendar.fullCalendar('destroy');
                this._calendar.fullCalendar(calendarOptions);
            }.bind(this));
        },

        /**
         * Moves the calendar one step forward (either by a month, week, or day).
         * [Documentation](http://fullcalendar.io/docs/next/)
         */
        next() {
            this._calendar.fullCalendar('next');
        },

        /**
         * Moves the calendar one step back (either by a month, week, or day).
         * [Documentation](http://fullcalendar.io/docs/prev/)
         */
        previous() {
            this._calendar.fullCalendar('prev');
        },

        /**
         * Immediately switches to a different view.
         * [Documentation](http://fullcalendar.io/docs/views/changeView/)
         *
         * @param {string} viewName One of the [available views](http://fullcalendar.io/docs/views/Available_Views/)
         */
        changeView(viewName) {
            this._calendar.fullCalendar('changeView', viewName);
        },

        /**
         * Immediately forces the calendar to render and/or readjusts its size.
         * [Documentation](http://fullcalendar.io/docs/render/)
         */
        render() {
            this._calendar.fullCalendar('render');
        },

        /**
         * Navigates the calendar to today.
         * [Documentation](http://fullcalendar.io/docs/today/)
         */
        today() {
            this._calendar.fullCalendar('today');
        },

        /**
         * Navigates the calendar to specific date.
         * [Documentation](http://fullcalendar.io/docs/gotoDate/)
         */
        gotoDate(date) {
            this._calendar.fullCalendar('gotoDate', date);
        },

        /**
         * Dynamically renders an new event.
         * [Documentation](http://fullcalendar.io/docs/renderEvent/)
         */
        renderEvent(event) {
            this._calendar.fullCalendar('renderEvent', event);
        },

        /**
         * Dynamically adds an event source.
         * [Documentation](http://fullcalendar.io/docs/addEventSource/)
         */
        addEventSource(source) {
            this._calendar.fullCalendar('addEventSource', source);
        },

        /**
         * Dynamically removes an event source.
         * [Documentation](http://fullcalendar.io/docs/removeEventSource/)
         */
        removeEventSource(source) {
            this._calendar.fullCalendar('removeEventSource', source);
        },

        /**
         * Dynamically removes all event sources.
         * [Documentation](http://fullcalendar.io/docs/removeEventSources/)
         */
        removeEventSources(sources) {
            this._calendar.fullCalendar('removeEventSources', sources);
        },

        /**
         * Retrieves all Event Source Objects.
         * [Documentation](http://fullcalendar.io/docs/getEventSources/)
         */
        getEventSources() {
            this._calendar.fullCalendar('getEventSources');
        },

        /**
         * Reports changes to an event and renders them on the calendar.
         * [Documentation](http://fullcalendar.io/docs/updateEvent/)
         */
        updateEvent(event) {
            this._calendar.fullCalendar('updateEvent', event);
        },

        /**
         * Reports changes to multiple events and renders them on the calendar.
         * [Documentation](http://fullcalendar.io/docs/updateEvents/)
         */
        updateEvents(events) {
            this._calendar.fullCalendar('updateEvents', events);
        },

        /**
         * Removes events from the calendar.
         * [Documentation](http://fullcalendar.io/docs/removeEvents/)
         */
        removeEvents(events) {
            this._calendar.fullCalendar('removeEvents', events);
        },

        /**
         * Refetches events from all sources and rerenders them on the screen.
         * [Documentation](http://fullcalendar.io/docs/refetchEvents/)
         */
        refetchEvents() {
            this._calendar.fullCalendar('refetchEvents');
        }
    };
}(IronResizableBehavior));
