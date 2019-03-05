import '@polymer/polymer/polymer-legacy.js';
import './g-storage.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
*  Sample usage:
* <g-mongo-auth 
*   id="auth" 
*   path="{{path}}" 
*   status-known="{{statusknown}}" 
*   user="{{user}}" 
*   on-error="_handleError"></g-mongo-auth>
* 
*** sign in user ***
* this.$.auth.authenticate = {
*   email: email,
*   password: password   
* }
* this.$.auth.signIn();
*
*** sign out user ***
* this.$.auth.signOut();
*/

/**
* Fired when there's an error signing in a user.
* @event error
*/

Polymer({
    _template: html`
        <g-storage id="index" on-connected="_indexConnected"></g-storage>
    `,

    is: 'g-mongo-auth',

    properties: {

        /**
        * The url of your login api.
        */
        path: {
            type: String,
            value: null
        },

        /**
        * The data to authenticate to server.
        */
        authenticate: {
            type: Object,
            value: null
        },

        /**
        * When true, login status can be determined by checking `user` property.
        */
        statusKnown: {
            type: Boolean,
            value: false,
            readOnly: true,
            notify: true
        },

        /**
        * The currently-authenticated user with user-related metadata.
        */
        user: {
            type: Object,
            value: null,
            readOnly: true,
            notify: true
        },
    },

    /**
    * SignIn a client in the server.
    */
    signIn() {
        if (!this.path || !this.authenticate) {
            throw new Error("'path' and 'authenticate' required.");
        }
        else {
            const _$ = this;
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(this.authenticate),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };

            fetch(this.path, requestOptions)
                .then(response => { return response.json(); })
                .then(response => {
                    if (response.success || response.code === 200) {
                        _$.$.index.setStoredValue("user", response.user).then(() => {
                            _$._setUser(response.user);
                            _$._setStatusKnown(true);
                        }).catch((error) => {
                            console.warn("Index error: " + error);
                        });
                    }
                    else {
                        var error = response.msg || response.message || response.err || response.error;
                        _$.fire('error', error);
                    }
                })
                .catch(error => {
                    _$.fire('error', error);
                });
        }
    },

    /**
    * SignOut -
    * clear all users data
    */
    signOut() {
        this.$.index.deleteAllStoredValue();
    },

    /**
    * on-connect indexed-db
    * get user data
    */
    _indexConnected() {
        const _$ = this;
        this.$.index.getStoredValue("user").then((user) => {
            _$._setUser(user);
            if (user) _$._setStatusKnown(true);
            else _$._setStatusKnown(false);
        }).catch((error) => {
            console.warn("Index error: " + error);
        });
    },
});
