import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }

            #overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 2;
                background: rgba(8, 8, 8, 0.8);
                display: none;
            }

            #info {
                background: white;
                margin: 6px auto;
                margin-left: 6px;
                margin-right: 6px;
                padding: 16px;
                max-width: 800px;
            }
        </style>

        <div id="overlay">
            <div id="info">
                <b>For Security Reasons</b>, please enable and allow GPS for this application.
                <br> Thank you!
            </div>
        </div>
    `,

    is: 'g-location',

    /**
    * @method requestLocation
    * 
    */
    requestLocation: function () {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation && navigator.permissions) {
                var self = this;
                navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                    if (result.state == 'granted') {
                        self.$.overlay.style.display = "none";
                        self._getCurrentPosition()
                            .then(data => {
                                resolve(data);
                            })
                            .catch(e => {
                                reject(e);
                            });
                    }
                    else if (result.state == 'prompt') {
                        self.$.overlay.style.display = "flex";
                        self._getCurrentPosition()
                            .then(data => {
                                resolve(data);
                            })
                            .catch(e => {
                                reject(e);
                            });
                    }
                    else if (result.state == 'denied') {
                        self.$.overlay.style.display = "flex";
                    }

                    result.onchange = function () {
                        if (result.state == "granted") {
                            self.$.overlay.style.display = "none";
                        }

                        if (result.state == "denied") {
                            alert("For security reasons, please allow GPS for this application.");
                        }
                    }
                });
            } else {
                reject("Geolocation is not supported by this browser.");
            }
        });
    },

    /**
    * @method _getCurrentPosition
    * 
    */
    _getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    time: position.timestamp
                });
            }, (error) => {
                reject(error);
            });
        });
    }
});
