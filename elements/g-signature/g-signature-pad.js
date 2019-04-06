import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import './g-signature.js';

/**
 * `g-signature`
 * SignaturePad integration to Polymer 3
 */

Polymer({
    _template: html`
        <style>
        :host { 
            display: block;
        }

        :host([hidden]), [hidden] {
            display: none !important;
        }

        .wrapper {
            position: relative; 
            overflow: hidden;
            border: 2px dashed #ddd;
            @apply --g-signature-pad-wrapper;
        }

        .wrapper p {
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none; 
            @apply --g-signature-pad-p;
        }

        .footer {
            display: flex;
            @apply --g-signature-pad-footer;
        }

        paper-input { max-width: 350px; }
        paper-button {
            height: 32px;
            font-size: 14px;
            font-weight: 400;
            border-radius: 0;
            padding: 16px 36px;
            text-transform: none;
            background-color: #d9d9d9;
            color: black;
            margin: 22px 3px 0;
        }
        </style>

        <div id="wrapper" class="wrapper">
            <template is="dom-if" if="[[!readonly]]">
                <p hidden="[[hideText]]">
                    <slot name="display-text">Sign here</slot>
                </p>
                <g-signature dot-size="[[dotSize]]"
                             min-width="[[minWidth]]"
                             max-width="[[maxWidth]]"
                             background-color="[[backgroundColor]]"
                             pen-color="[[penColor]]"
                             velocity-filter-weight="[[velocityFilterWeight]]"
                             type="[[type]]"
                             encoder-options="[[encoderOptions]]"
                             image="{{image}}"
                             active="{{_active}}"
                             empty="{{_empty}}">
                </g-signature>
            </template>
            <template is="dom-if" if="[[readonly]]">
                <iron-image sizing="contain" src="[[image]]"></iron-image>
            </template>
        </div>
        <div hidden="[[hideFooter]]" class="footer">
            <slot name="footer">
                <div style="flex: 2">
                    <paper-input readonly="[[readonly]]" always-float-label label="Signed by" value="{{signedBy}}"></paper-input>
                </div>
                <div hidden="[[readonly]]" style="flex: 1; text-align: right;">
                    <paper-button on-tap="clear">Clear</paper-button>
                </div>
            </slot>
        </div>
    `,

    is: 'g-signature-pad',

    properties: {
        /**
         * Width of the wrapper in pixels
         */
        width: Number,
        /**
         * Height of the wrapper in pixels
         * defaults '400'
         */
        height: {
            type: Number,
            value: 400
        },
        /**
         * Set diplay text visibility
         */
        hideText: Boolean,
        /**
        * Set footer visibility
        */
        hideFooter: Boolean,
        /**
        * Value of the paper-input
        */
        signedBy: {
            type: String,
            notify: true
        },
        /**
         * Radius of a single dot of signature
         */
        dotSize: Number,
        /**
         * Minimum width of a line of signature. Defaults to 0.5
         */
        minWidth: Number,
        /**
         * Maximum width of a line of signature. Defaults to 2.5
         */
        maxWidth: Number,
        /**
         * Color used to clear the background of signature.
         * Can be any color format accepted by context.fillStyle.
         * Defaults to "rgba(0,0,0,0)" (transparent black).
         * Use a non-transparent color e.g. "rgb(255,255,255)" (opaque white)
         * if you'd like to save signatures as JPEG images.
         */
        backgroundColor: {
            type: String,
            value: 'rgba(0,0,0,0)'
        },
        /**
         * Color used to draw the lines of signature.
         * Can be any color format accepted by context.fillStyle.
         * Defaults to "black".
         */
        penColor: {
            type: String,
            value: 'rgb(0, 0, 0)'
        },
        /**
         * Weight used to modify new velocity based on the previous velocity of signature. Defaults to 0.7
         */
        velocityFilterWeight: Number,
        /**
         * toDataUrl encoding format of signature
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
         * Data uri encoded image data of signature
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
        },
        /**
         * Indicates whether an image is editable
         */
        readonly: {
            type: Boolean,
            value: false
        }
    },

    behaviors: [IronResizableBehavior],

    listeners: {
        'iron-resize': '_onIronResize'
    },

    observers: [
        '_hideDisplayText(_active, _empty)'
    ],

    ready() {
        this.$.wrapper.style.backgroundColor = this.backgroundColor;
        this.$.wrapper.style.height = this.height + "px";
        if (this.width) this.$.wrapper.style.width = this.width + "px";
    },

    _onIronResize() {
        if (!this.readonly) {
            const canvas = this.shadowRoot.querySelector("g-signature");
            if (canvas) canvas.scaleCanvas(this.$.wrapper.offsetWidth, this.$.wrapper.offsetHeight);
        } else {
            const image = this.shadowRoot.querySelector("iron-image");
            if (image) {
                image.width = '100%';
                image.height = this.$.wrapper.offsetHeight;
            }
        }
    },

    clear() {
        const canvas = this.shadowRoot.querySelector("g-signature");
        if (canvas) canvas.scaleCanvas(this.$.wrapper.offsetWidth, this.$.wrapper.offsetHeight, true);
    },

    _computedBinary(e) { return arrayBufferToBase64(e.data); },
    _hideDisplayText(active, empty) {
        this._setActive(active);
        this._setEmpty(empty);
        if (!this.hideText) {
            if (!empty) this.$.wrapper.querySelector('p').style.display = "none";
            else if (empty && active) this.$.wrapper.querySelector('p').style.display = "none";
            else this.$.wrapper.querySelector('p').style.display = "block";
        }
    }
});