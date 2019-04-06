import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import SignaturePad from '../../src/signature_pad.js';

/**
 * `g-signature`
 * SignaturePad integration to Polymer 3
 */

Polymer({
    _template: html`
        <style>
        :host { display: block; }
        </style>

        <canvas id="canvas"></canvas>
    `,

    is: 'g-signature',

    properties: {
        /**
         * Width of the signature pad in pixels
         */
        width: Number,
        /**
         * Height of the signature pad in pixels
         */
        height: Number,
        /**
         * Radius of a single dot
         */
        dotSize: {
            type: Number,
            observer: '_dotSizeChanged'
        },
        /**
         * Minimum width of a line. Defaults to 0.5
         */
        minWidth: {
            type: Number,
            observer: '_minWidthChanged'
        },
        /**
         * Maximum width of a line. Defaults to 2.5
         */
        maxWidth: {
            type: Number,
            observer: '_maxWidthChanged'
        },
        /**
         * Color used to clear the background.
         * Can be any color format accepted by context.fillStyle.
         * Defaults to "rgba(0,0,0,0)" (transparent black).
         * Use a non-transparent color e.g. "rgb(255,255,255)" (opaque white)
         * if you'd like to save signatures as JPEG images.
         */
        backgroundColor: {
            type: String,
            value: 'rgba(0,0,0,0)',
            observer: '_backgroundColorChanged'
        },
        /**
         * Color used to draw the lines.
         * Can be any color format accepted by context.fillStyle.
         * Defaults to "black".
         */
        penColor: {
            type: String,
            value: 'rgb(0, 0, 0)',
            observer: '_penColorChanged'
        },
        /**
         * Weight used to modify new velocity based on the previous velocity. Defaults to 0.7
         */
        velocityFilterWeight: {
            type: Number,
            observer: '_velocityFilterWeightChanged'
        },
        /**
         * toDataUrl encoding format
         */
        type: {
            type: String,
            value: 'image/png'
        },
        /**
         * toDataUrl encoding image quality between 0 and 1
         */
        encoderOptions: {
            type: Number,
            value: 0.85
        },
        /**
         * Data uri encoded image data
         */
        image: {
            type: String,
            notify: true
        },
        /**
         * Indicates if the signature pad is currently active
         */
        active: {
            type: Boolean,
            notify: true,
            readOnly: true
        },
        /**
         * Indicates if the signature pad is empty
         */
        empty: {
            type: Boolean,
            notify: true,
            readOnly: true
        }
    },

    observers: [
        '_onEncodingChanged(type, encoderOptions)'
    ],

    ready() {
        this.scaleCanvas(this.width, this.height);
        this.signaturePad = new SignaturePad(this.$.canvas, {
            dotSize: this.dotSize,
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            backgroundColor: this.backgroundColor,
            penColor: this.penColor,
            velocityFilterWeight: this.velocityFilterWeight,
            onBegin: this._onBegin.bind(this),
            onEnd: this._onEnd.bind(this)
        });
    },

    scaleCanvas(width, height, hard = false) {
        // const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const ratio = 1;
        this.$.canvas.width = width * ratio;
        this.$.canvas.height = height * ratio;
        this.$.canvas.getContext("2d").scale(ratio, ratio);

        if (this.signaturePad) {
            if (hard) this.clear();
            else {
                this.signaturePad.clear();
                if (this.image) this.signaturePad.fromDataURL(this.image);
                this._setEmpty(this.signaturePad.isEmpty());
            }
        }
    },

    attached() {
        this.signaturePad.on();
    },

    detached() {
        this.signaturePad.off();
    },

    /**
     * Clears the image
     */
    clear() {
        this.signaturePad.clear();
        this.encodeImage();
    },

    /**
     * Encodes the image using the type and encoderOptions (quality) defined.
     * The encoded image is available in the `image` property.
     */
    encodeImage() {
        this.image = this.$.canvas.toDataURL(this.type, this.encoderOptions);
        this._setEmpty(this.signaturePad.isEmpty());
    },

    _onBegin(event) {
        this._setActive(true);
    },

    _onEnd(event) {
        this._setActive(false);
        this.encodeImage();
    },

    _dotSizeChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.dotSize = newValue;
    },

    _minWidthChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.minWidth = newValue;
    },

    _maxWidthChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.maxWidth = newValue;
    },

    _backgroundColorChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.backgroundColor = newValue;
    },

    _penColorChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.penColor = newValue;
    },

    _velocityFilterWeightChanged(newValue, oldValue) {
        if (!this.signaturePad) return;
        this.signaturePad.velocityFilterWeight = newValue;
    },

    _onEncodingChanged(type, encoderOptions) {
        if (this.signaturePad) {
            this.encodeImage();
        }
    }
});