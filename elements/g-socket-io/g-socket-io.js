import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { ScriptLoader } from '../../src/scriptLoader.js';

/**
 * Fired on socket.io connection.
 *
 * @event connect
 */

/**
 * Fired when the client call a method 'call'.
 *
 * @event response
 */
new ScriptLoader([
    'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js'
], function () {
    Polymer({
        is: 'g-socket-io',
        properties: {
            /**
             * The socket namespace
             * defaults to '/'
             */
            namespace: {
                type: String,
                value: '/'
            },
            /**
             * The socket element attach
             * sends 'true' if element successfully attached
             * boolean
             */
            elementAttached: {
                type: Boolean,
                value: false,
                readOnly: true,
                notify: true
            },
            /**
             * The socket connection
             * sends 'true' if connection successfully established to socket.io
             * 'false' if connection is unable to connect
             * boolean
             */
            connected: {
                type: Boolean,
                value: false,
                readOnly: true,
                notify: true
            },
            /**
             * The socket connection
             * check if socket still has a comminication to the server
             * boolean
             */
            isConnectionAlive: {
                type: Boolean,
                value: false,
                readOnly: true,
                notify: true
            },
        },

        /**
         * On attach element.
         */
        attached() {
            this.fire('attach');
            this._setElementAttached(true);
        },

        /**
         * Connect to the Socket.IO server.
         */
        connect: function () {
            return new Promise((resolve, reject) => {
                if (!this.connected) {
                    this.disconnect();
                    this.socket = io.connect(this.namespace);

                    if (this.socket === undefined) reject();
                    else {
                        this._setConnected(true);
                        this.connection();
                        resolve();
                    }
                }
            });
        },

        /**
         * The call method calls an event from socket.io
         *
         * @method call
         * @param {String} event event to call
         *
         */
        call: function (event) {
            try {
                if (this.socket) {
                    var self = this;
                    self.socket.on(event, function (data) {
                        self.fire('response', { event: event, data: data });
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * The send method sends an event with 'data' as content
         *
         * @method send
         * @param {String} event event to send
         * @param {Object} data the json data to send
         */
        send: function (event, data) {
            try {
                if (this.socket) this.socket.emit(event, data);
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * The disconnect method triggers disconnection from the socket.io server
         *
         * @method disconnect
         */
        disconnect: function () {
            if (this.socket !== undefined && !this.connected) {
                try {
                    this.socket.disconnect();
                    this._setConnected(false);
                }
                catch (error) {
                    console.error(error);
                }
            }
        },

        /**
         * The connection method triggers any connection event from the socket.io server
         * like 'connect', 'disconnect', 'reconnect', 'reconnect_error', etc..
         *  
         * @method connection
         */
        connection: function () {
            var self = this;
            this.socket.on('connect', function () {
                self._setIsConnectionAlive(true);
            });

            this.socket.on('disconnect', function () {
                self._setIsConnectionAlive(false);
            });

            this.socket.on('reconnect_attempt', function () {
                self._setIsConnectionAlive(false);
            });

            this.socket.on('reconnect', function () {
                self._setIsConnectionAlive(false);
            });

            this.socket.on('reconnect_error', function () {
                self._setIsConnectionAlive(false);
            });

            this.socket.on('reconnect_failed', function () {
                self._setIsConnectionAlive(false);
            });
        }
    });
});