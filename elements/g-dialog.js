import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PaperDialogBehavior } from '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js';

Polymer({
    _template: html`
        <style include="paper-dialog-shared-styles">
            :host {
                width: 360px;
                border-radius: 5px;
                overflow: hidden;
                background: none;
                @apply --layout-vertical;
            }

            :host ::slotted(h2) {
                flex-shrink: 0;
                margin: 0 !important;
                padding: 14px 24px;
                background: var(--g-dialog-header-background, rebeccapurple);
                color: white;
                user-select: none;
                -webkit-user-select: none;
            }

            :host ::slotted(*:not(h2):not(.buttons)) {
                display: block;
                height: 100%;
                margin: 0;
                padding: 14px 24px;
                background: var(--paper-dialog-background-color, var(--primary-background-color));
                @apply --layout-vertical;
                @apply --g-dialog-content;
            }

            :host ::slotted(.buttons) {
                flex-shrink: 0;
                background-color: #fafafa;
                border-top: 1px solid #e0e0e0;
                user-select: none;
                -webkit-user-select: none;
            }

            @media all and (min-width: 0) and (max-width: 600px) and (orientation: portrait) {
                :host(:not([no-auto-fullscreen])) {
                    position: fixed;
                    margin: 0 !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    width: 100%;
                    border-radius: 0;
                    @apply --layout-vertical;
                }
            }
        </style>

        <slot></slot>
    `,

    is: 'g-dialog',

    behaviors: [
        PaperDialogBehavior,
        NeonAnimationRunnerBehavior
    ],

    properties: {
        /**
         * The dialog will no longer become full screen on smaller devices
         */
        noAutoFullscreen: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        }
    },

    listeners: {
        'neon-animation-finish': '_onNeonAnimationFinish'
    },

    _renderOpened: function () {
        this.cancelAnimation();
        this.playAnimation('entry');
    },

    _renderClosed: function () {
        this.cancelAnimation();
        this.playAnimation('exit');
    },

    _onNeonAnimationFinish: function () {
        if (this.opened) {
            this._finishRenderOpened();
        } else {
            this._finishRenderClosed();
        }
    }
});