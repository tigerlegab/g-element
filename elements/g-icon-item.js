
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-item/paper-item-shared-styles.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/*
`<paper-icon-item>` without its behavior 
 intended for UI
*/
Polymer({
    _template: html`
        <style include="paper-item-shared-styles"></style>
        <style>
        :host {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --paper-font-subhead;

            @apply --paper-item;
            @apply --g-icon-item;
        }

        .content-icon {
            @apply --layout-horizontal;
            @apply --layout-center;

            width: var(--g-item-icon-width, 56px);
            @apply --g-item-icon;
        }
        </style>

        <div id="contentIcon" class="content-icon">
            <slot name="item-icon"></slot>
        </div>
        <slot></slot>
    `,

    is: 'g-icon-item'
});
