import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/default-theme.js';

class GSearch extends mixinBehaviors([IronA11yKeysBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="shared-styles">
            :host {
                display: block;
            }
        </style>

        <div class="horizontal-holder">
			<iron-icon icon="my-icons:search" class="icon"></iron-icon>
			<iron-input bind-value="{{query}}">
				<input id="input" is="iron-input" placeholder="[[placeholder]]" value="{{value::input}}">
			</iron-input>

			<template is="dom-if" if="{{query}}">
				<paper-icon-button icon="my-icons:close" on-tap="_clear" class="icon"></paper-icon-button>
			</template>
		</div>
        `;
    }

    static get properties() {
        return {
            /**
            * keyBindings of IronA11yKeysBehavior
            */
            keyBindings: {
                'enter': '_search'
            },
            /**
			 * Text for which the user is searching
			 */
            query: {
                type: String,
                notify: true,
                value: ''
            },
            /**
			 * Text shown in the search box if the user didn't enter any query
			 */
            placeholder: {
                type: String,
                value: 'Search...'
            },
        };
    }

    focus() {
        this.$.input.focus();
    }

    _clear() {
        this.query = "";
        this.$.input.focus();
        this.fire('g-search-clear');
    }

    _search() {
        this.fire('g-search-search');
    }
}

window.customElements.define('g-search', GSearch);