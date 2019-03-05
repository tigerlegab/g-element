import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/default-theme.js';
import './g-icons.js';

class GSearchBar extends mixinBehaviors([IronA11yKeysBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host { display: block; }
            .horizontal-holder {
				background: var(--background-color, white);
				display: block;
				padding: 0 16px;
				@apply --layout-horizontal;
				@apply --layout-center-center;
				height: var(--g-search-bar-height, 48px);
				box-sizing: border-box;
			}

			iron-input {
				@apply --layout-flex;
				@apply --layout-vertical;
				height: 100%;
			}

			.icon {
				color: var(--disabled-text-color);
				@apply --icon-styles;
			}

			#input {
				@apply --layout-flex;
				margin: 0 10px;
				padding: 16px 0;
				cursor: text;
				background: transparent;
				color: inherit;
				@apply --input-styles;
				border: 0;
                outline: 0;
			}

			#input::-ms-clear { display: none; }
			#input[disabled] { @apply --disabled-input-styles; }
        </style>

        <div class="horizontal-holder">
			<iron-icon icon="g-icons:search" class="icon"></iron-icon>
			<iron-input bind-value="{{query}}">
				<input id="input" is="iron-input" placeholder="[[placeholder]]" value="{{value::input}}">
			</iron-input>

			<template is="dom-if" if="{{query}}">
				<paper-icon-button icon="g-icons:close" on-tap="_clear" class="icon"></paper-icon-button>
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
        this.fire('g-search-bar-clear');
    }

    _search() {
        this.fire('g-search-bar-search');
    }
}

window.customElements.define('g-search-bar', GSearchBar);