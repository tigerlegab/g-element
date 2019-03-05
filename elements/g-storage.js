import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

/**
 * Sample usage:
 * <g-storage key="test" data="{{data}}" persisted-data="{{persistedData}}"></g-storage>
 */

/**
* Fired on error
* @event error
*/

/**
* Fired on connected to index-db
* @event connected
*/

/**
 *  References:
 *  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 * 
 */

Polymer({
    is: 'g-storage',

    properties: {

        /**
         * Indexed-db connection status
         */
        connected: {
            type: Boolean,
            value: false,
            readOnly: true,
            notify: true
        },

        /**
        * Data key.
        */
        key: String,

        /**
        * Data to save to indexed-db store.
        */
        data: Object,

        /**
         * Saved data from indexed-db store.
         */
        persistedData: {
            type: Object,
            notify: true
        }
    },

    observers: [
        '_updatePersistedData(connected, data, key)'
    ],

    /**
     * Initiallize indexed db database on attached element.
     */
    attached: function () {
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        if (!indexedDB) {
            console.warn("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        } else {
            this._close();
            this._connect(indexedDB);
        }
    },

    /**
     * Close indexed db database on detached element.
     */
    detached: function () {
        this._close();
    },

    /**
     * Connect or open indexed db.
     */
    _connect(indexedDB) {
        const DB_NAME = "g-storage";
        const DB_VERSION = 2; // Use a long long for this value (don't use a float)
        const DB_STORE_NAME = "client";

        var request = indexedDB.open(DB_NAME, DB_VERSION);
        var _$ = this;
        request.onsuccess = function (event) {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            _$.db = this.result;
            _$._setConnected(true);
            _$.fire('connected');
        };

        request.onerror = function (event) {
            console.error("IndexedDb error: ", event.target.errorCode);
            _$._setConnected(false);
        };

        request.onupgradeneeded = function (event) {
            event.target.result.createObjectStore(DB_STORE_NAME);
        };

        request.onclose = function (event) {
            console.info('The database "' + DB_NAME + '" has unexpectedly closed.');
            _$._setConnected(false);
        };
    },

    /**
    * Close indexed db database.
    */
    _close() {
        if (this.db) this.db.close();
    },

    /**
     * @param {string} mode either "readonly" or "readwrite"
     */
    _getObjectStore(mode) {
        var tx = this.db.transaction("client", mode);
        return tx.objectStore("client");
    },

    /**
     * @param {object} request
     */
    _promisifyRequest(request) {
        return new Promise(function (resolve, reject) {
            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error);
            };
        });
    },

    /**
     * @method getStoredValue
     * @param {string/number} key
     */
    getStoredValue(key) {
        var store = this._getObjectStore("readonly");
        var request = store.get(key);
        return this._promisifyRequest(request);
    },

    /** 
    * @method setStoredValue
    * @param {string/object} data
    * @param {string/number} key
    */
    setStoredValue(key, data) {
        var store = this._getObjectStore("readwrite");
        var request = store.put(data, key);
        return this._promisifyRequest(request);
    },

    /** 
    * @method deleteStoredValue
    * @param {string/number} key
    */
    deleteStoredValue(key) {
        var store = this._getObjectStore('readwrite');
        var request = store.delete(key);
        return this._promisifyRequest(request);
    },

    /** 
    * @method deleteAllStoredValue
    */
    deleteAllStoredValue() {
        var store = this._getObjectStore('readwrite');
        var request = store.clear();
        return this._promisifyRequest(request);
    },

    _updatePersistedData(connected, data, key) {
        if (connected && data && key) {
            var _$ = this;
            this.setStoredValue(key, data).then((result) => {
                _$.persistedData = data;
            }).catch((err) => {
                _$.fire("error", err);
            });
        }
    },

});
