import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

/**
 * Reference: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
 */
Polymer({
    is: 'g-notification',

    properties: {
        /**
         * Notification browser support
         * null, true or false
         * 
         */
        isSupported: {
            type: Boolean,
            value: null,
            notify: true,
            readOnly: true
        },

        /**
        * User permission
        * null, true or false
        * 
        */
        isGranted: {
            type: Boolean,
            value: null,
            notify: true,
            readOnly: true
        }
    },

    attached: function () {
        /**
         * Send response if browser supports both 
         * notification and service worker api
         * 
         */
        if ('Notification' in window && navigator.serviceWorker) {
            this._setIsSupported(true);
            if (!this.isGranted) {
                if (Notification.permission === "granted") {
                    this._setIsGranted(true);
                };
            }
        }
        else {
            this._setIsSupported(false);
            console.warn('API Push Notification Not Supported By This Browser .');
        }
    },

    /**
    * The requestPermission method ask for permission for the client
    * to allow the browser send notifications
    *
    * @method requestPermission
    *
    */
    requestPermission: function () {
        if (this.isSupported && Notification && Notification.permission === 'default') {
            var self = this;
            Notification.requestPermission(function (permission) {
                if (permission === "granted") self._setIsGranted(true);
                if (permission === "denied") self._setIsGranted(false);
            });
        }
    },

    /**
     * The sendNotification method sends a push notification to the client
     *
     * @method sendNotification
     * @param {Object} message Notification message requires a 'Title', 'Icon' and 'Body'
     *
     */
    sendNotification: function (message) {
        if (this.isSupported && Notification.permission === "granted") {
            if (message) {
                if (message.title && message.icon && message.body) {
                    var options = {
                        body: message.body,
                        icon: message.icon,
                        tag: message.tag,
                        sound: message.sound,
                        badge: message.badge,
                        requireInteraction: message.requireInteraction,
                        renotify: message.renotify,
                        actions: message.actions,
                        image: message.image,
                        data: message.data
                    };
                    navigator.serviceWorker.getRegistration().then(function (reg) {
                        reg.showNotification(message.title, options);
                    });
                }
                else {
                    throw new Error("Notification message requires a 'Title', 'Icon' and a 'Body'");
                }
            }
            else {
                throw new Error("Notification message required.");
            }
        }
    },

});
