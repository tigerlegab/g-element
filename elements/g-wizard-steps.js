
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

/**
 * All credits to: https://github.com/timeu/timeu-wizard
 */

class GWizardSteps extends GestureEventListeners(PolymerElement) {
    static get template() {
        return html`
        <style>
        :host {
            display: block;
            box-sizing: border-box;
            width:100%;
            height:100%;
            --g-wizard-steps-circle-size: 35px;
            /* @apply --g-wizard-steps; */
        }

        :host([horizotnal]) ul {
            flex-direction: row;
        }

        :host([vertical]) ul {
            flex-direction: column;
        }

        :host([vertical]) .line {
            width: 1px;
            top:0;
            left: 50%;
            height: calc(100% - var(--g-wizard-steps-circle-size,40px));
        }

        ul {
            display: flex;
            justify-content: space-between;
            padding:0;
            margin:0;

            /* @apply --g-wizard-steps-list; */
        }

        #line{
            background-color:var(--g-wizard-steps-line-color,#dfdfdf);
        }

        .line {
            height: var(--g-wizard-steps-line-size,1px);
            position: absolute;
            top: calc(var(--g-wizard-steps-circle-size,40px)/2);
            left: 0;
            right: 0;
        }

        #filling {
            background-color: var(--g-wizard-steps-filling-color,#2db36f);
            -webkit-transition: -webkit-transform var(--g-wizard-steps-anim-speed,0.5s);
            -moz-transition: -moz-transform var(--g-wizard-steps-anim-speed,0.5s);
            transition: transform var(--g-wizard-steps-anim-speed,0.5s);
        }

        #filling {
            -webkit-transform: scaleX(0);
            -moz-transform: scaleX(0);
            -ms-transform: scaleX(0);
            -o-transform: scaleX(0);
            transform: scaleX(0);
            -webkit-transform-origin: left center;
            -moz-transform-origin: left center;
            -ms-transform-origin: left center;
            -o-transform-origin: left center;
            transform-origin: left center;
        }

        :host([vertical]) #filling {
            -webkit-transform: scaleY(0);
            -moz-transform: scaleY(0);
            -ms-transform: scaleY(0);
            -o-transform: scaleY(0);
            transform: scaleY(0);
            -webkit-transform-origin: top center;
            -moz-transform-origin: top center;
            -ms-transform-origin: top center;
            -o-transform-origin: top center;
            transform-origin: top center;
        }

        #container {
            width: 100%;
            height:100%;
            position:relative;

            /* @apply --g-wizard-steps-container; */
        }

        #wizard {
            counter-reset: step;
            height:100%;
            width:100%;
        }

        #wizard li {
            list-style-type:none;
            position: relative;
            text-align: center;
            color: var(--g-wizard-steps-filling-color,#dfdfdf);

            /* @apply --g-wizard-steps-list-item; */
        }

        #wizard li[data-content]:before {
            content: attr(data-content);
        }

        #wizard li:before {
            content: counter(step);
            counter-increment: step;
            width:  var(--g-wizard-steps-circle-size,40px);
            height:  var(--g-wizard-steps-circle-size,40px);
            line-height:  var(--g-wizard-steps-circle-size,40px);
            border: var(--g-wizard-steps-circle-border-size,1px) solid var(--g-wizard-steps-filling-color,#dfdfdf);
            display: block;
            text-align: center;
            font-family:var(--g-wizard-steps-step-font-family);
            margin: 0 auto 5px auto;
            border-radius: 50%;
            background-color: white;
            -webkit-transition: background-color var(--g-wizard-steps-anim-speed,0.5s), border-color var(--g-wizard-steps-anim-speed,0.5s);;
            -moz-transition: background-color var(--g-wizard-steps-anim-speed,0.5s), border-color var(--g-wizard-steps-anim-speed,0.5s);
            transition: background-colorvar(--g-wizard-steps-anim-speed,0.5s), border-color var(--g-wizard-steps-anim-speed,0.5s);
            font-size:var(--g-wizard-steps-step-font-size,25px);

            /* @apply --g-wizard-steps-list-item-icon; */
        }

        #wizard li.active, #wizard li.done  {
            color: var(--g-wizard-steps-active-color,#2db36f);
            /* @apply --g-wizard-steps-list-item-active; */
        }

        /* #wizard li.done {
            @apply --g-wizard-steps-list-item-done;
        } */

        #wizard li.done:before {
            content:'';
        }

        #wizard li.active:before, #wizard li.done:before{
            border-color: var(--g-wizard-steps-active-color,#2db36f) !important;
        }

        #wizard li.active:before {
            background-color: var(--g-wizard-steps-active-color, #2db36f);
            color: white;
        }

        .checkicon {
            opacity:0;
            height: var(--g-wizard-steps-circle-size, 40px);
            width:  var(--g-wizard-steps-circle-size, 40px);
            position: absolute;
            fill: var(--g-wizard-steps-active-color,#2db36f);
            top: 0px;
            left: calc(50% - var(--g-wizard-steps-circle-size,40px)/2);
            transition: all var(--g-wizard-steps-anim-speed,0.5s);
            -webkit-transition: all var(--g-wizard-steps-anim-speed,0.5s);

            /* @apply --g-wizard-steps-list-item-checkicon; */
        }

        #wizard li.done .checkicon {
            opacity:1;
        }

        .label {
            font-size: var(--g-wizard-steps-label-font-size,13px);
        }
        </style>

        <div id="container">
        <span id="line" class="line"></span>
        <span id="filling" class="line" style\$="transform: scale({{_calculateFilling(steps,step,vertical)}});"></span>
        <ul id="wizard">
            <template is="dom-repeat" items="{{steps}}">
            <li class\$="{{_computeClass(index,item,step)}}" data-content\$="{{item.content}}" on-tap="_handleItemTap">
                <div class="checkicon">
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                    <g>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                    </g>
                </svg>
                </div>
                <span class="label">{{_getLabel(item)}}</span>
            </li>
            </template>
        </ul>
        </div>
    `;
    }

    static get is() { return 'g-wizard-steps'; }
    static get properties() {
        return {
            /**
            * Fired when a step item is tapped.
            *
            * @event g-wizard-steps-item-tap
            */

            /**
            * `step` indicates the current step in the wizard
            */
            step: {
                type: Number,
                notify: true,
                value: 1,
                observer: '_validateStep'
            },

            /**
            * Specifiies the available steps.
            *
            * @type [string]
            */
            steps: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
            * If set to true, a vertical progress wizard will be displayed.
            *
            * @type [string]
            */
            vertical: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        }
    }

    // Element Lifecycle

    connectedCallback() {
        super.connectedCallback();
        beforeNextRender(this, function () {
            this._width = this.getBoundingClientRect().width;
        });
    }

    // Element Behavior

    /**
     * Increment the current step
     *
     * Use this function for moving to the next step in the wizard
     */
    increment() {
        if (this.step < this.steps.length) {
            this.step++;
        }
    }

    /**
     * Decrement the current step
     *
     * Use this function for moving to the previous step in the wizard
     */
    decrement() {
        if (this.step > 1) {
            this.step--;
        }
    }

    _validateStep(newValue, oldValue) {
        if (this.steps === undefined) {
            return;
        }
        if (newValue < 1 || newValue === undefined || newValue > this.steps.length) {
            microTask.run(() => {
                this.step = oldValue
            });
        }
    }

    _getLabel(item) {
        if (item !== null && typeof item === 'object' && item.label !== undefined) {
            return item.label;
        }
        return item;
    }

    _computeClass(index, item, step) {
        if ((index + 1) < step) {
            return "done";
        }
        else if (index + 1 == step) {
            return "active";
        }
        return "";
    }

    _caclulateRatio(steps, step) {
        if (steps === undefined || step === 1) {
            return 0;
        }
        else if (step === steps.length) {
            return 1;
        }
        return (step - 1) / (steps.length - 1);
    }

    _calculateFilling(steps, step, vertical) {
        var ratio = this._caclulateRatio(steps, step);
        var scaleX = (vertical ? 1 : ratio);
        var scaleY = (vertical ? ratio : 1);
        return scaleX + "," + scaleY;
    }

    _handleItemTap(e) {
        this.dispatchEvent(new CustomEvent('g-wizard-steps-item-tap', { bubbles: true, composed: true, detail: { model: e.model, target: e.target } }));
    }
}
window.customElements.define(GWizardSteps.is, GWizardSteps);
