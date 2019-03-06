import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="g-datatable-styles">
  <template>
    <style>
    :host {
        display: block;
        @apply --paper-font-common-base;
        position: relative;
    }

    :host([resize-behavior='overflow']) #container {
        overflow: auto;
    }

    :host([resize-behavior='dynamic-columns']) #container {
        overflow: auto;
    }

    :host([resize-behavior='fixed']) table {
        table-layout: fixed;
    }

    :host([resize-behavior='fixed']) th {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host([resize-behavior='fixed']) td {
        overflow: hidden;
    }

    table {
        border-spacing: 0px;
        width: 100%;
    }

    tr td,
    tr th {
        border-bottom: 1px solid var(--g-datatable-divider-color, var(--divider-color));
        padding: 6px 28px 6px 28px;
        box-sizing: border-box;
        @apply --g-datatable-cell-styles;
    }

    td {
        height: 48px;
    }

    th {
        font-weight: 500;
        text-align: left;
        white-space: nowrap;
        @apply --paper-font-common-base;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
        color: rgba(0, 0, 0, .54);
        font-size: 12px;
        transition: linear .1s color, padding-left .2s linear;
        box-sizing: border-box;
        height: 56px;
    }

    th:not([data-sortable]) iron-icon.sort {
        display: none;
    }

    th[data-sortable] iron-icon.sort {
        transition: transform .2s linear, width .2s linear, color .2s linear;
        color: rgba(0, 0, 0, .26);
        width: 0px;
        @apply --g-datatable-column-header-sort-icon-hover;
    }

    th[data-sortable] {
        cursor: pointer;
    }

    /* th[data-sortable]:not([data-sorted]):hover iron-icon{

    } */

    th[data-sortable][data-sorted],
    th[data-sortable]:hover {
        padding-left: 4px;
        color: rgba(0, 0, 0, .87);
        @apply --g-datatable-column-header-sorted;
    }

    th[data-sortable][data-sorted] iron-icon,
    th[data-sortable]:hover iron-icon {
        width: 24px;
    }

    th[data-sortable][data-sorted] iron-icon.sort {
        color: rgba(0, 0, 0, .87);
        @apply --g-datatable-column-header-sorted;
    }

    th[data-sortable]:not([data-sorted]) iron-icon {
        transform: rotate(180deg);
    }

    th[data-sortable]:not([data-sorted]):not([data-sort-direction='desc']) iron-icon {
        transform: rotate(0deg);
    }

    th[data-sortable][data-sorted]:not([data-sort-direction='desc']) iron-icon {
        transform: rotate(180deg);
    }

    tr td {
        cursor: pointer;
    }

    tr td.bound-cell[data-edit-icon] {
        padding-right: 10px;
    }

    th.column {
        @apply --g-datatable-column-header;
    }

    tr th span {
        vertical-align: middle;
    }

    td.bound-cell {
        font-size: 13px;
        color: rgba(0, 0, 0, .87);
        @apply --g-datatable-cell;
    }

    td.bound-cell div span {
        flex: 1;
    }

    td.bound-cell iron-icon.editable {
        display: none;
    }

    td.bound-cell div {
        display: flex;
        align-items: center;
    }

    td.bound-cell[data-edit-icon] iron-icon.editable {
        color: var(--g-datatable-icon-color, rgba(0, 0, 0, .54));
        width: 18px;
        display: inline-block;
        padding-left: 7px;
    }

    td.bound-cell paper-input,
    td.bound-cell paper-textarea,
    paper-datatable-edit-dialog paper-input,
    paper-datatable-edit-dialog paper-textarea {
        --paper-input-container-input: {
            font-size: 13px;
            line-height: 1.4em;
        };
    }

    tr td:first-child,
    tr th:first-child {
        /*change it from 24 to 28 px cause have some error on mobile*/
        padding-left: 28px;
        padding-right: 0px;
        width: 56px;
        min-width: 56px;
    }

    tr td:nth-of-type(2),
    tr th:nth-of-type(2) {
        /*changed it from 10px to 28px because second row have wrong left padding on mobile*/
        padding-left: 28px;
    }

    td:last-of-type,
    th:last-of-type {
        padding-right: 24px;
    }

    td:last-of-type {
        @apply --g-datatable-cell-last;
    }

    th:last-of-type {
        @apply --g-datatable-column-header-last;
    }

    tr[data-selected] td {
        background: var(--g-datatable-row-selection-color, var(--paper-grey-100));
    }

    tr:hover td {
        background: var(--g-datatable-row-hover-color, var(--paper-grey-200));
    }

    tbody tr:last-of-type td {
        border-bottom: none;
    }

    tbody td .array-item {
        display: inline-block;
        @apply --g-datatable-array-item;
    }

    tbody td .class-1 {
        @apply --g-datatable-class-1;
    }

    tbody td .class-2 {
        @apply --g-datatable-class-2;
    }

    tbody td .class-3 {
        @apply --g-datatable-class-3;
    }

    tbody td .class-4 {
        @apply --g-datatable-class-4;
    }

    tbody td .class-5 {
        @apply --g-datatable-class-5;
    }

    table tr.progress th paper-progress {
        height: 0px;
        transition: linear .2s height;
    }

    table tr.progress[data-progress] th paper-progress {
        height: 3px;
    }

    table tr.progress th {
        padding: 0px;
        height: 1px;
        border-bottom: 0px;
    }

    table tr.progress th paper-progress {
        width: 100%;
    }

    paper-checkbox {
        --paper-checkbox-unchecked-color: var(--g-datatable-checkbox-border-color, var(--primary-text-color));
        --paper-checkbox-checked-color: var(--g-datatable-checkbox-color, var(--accent-color));
        @apply --g-datatable-checkbox;
    }

    th paper-checkbox {
        --paper-checkbox-unchecked-color: var(--g-datatable-header-checkbox-border-color, var(--primary-text-color));
        --paper-checkbox-checked-color: var(--g-datatable-header-checkbox-color, var(--accent-color));
        @apply --g-datatable-header-checkbox;
    }

    .partialSelectionContainer {
        width: 18px;
        height: 18px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .partialSelection {
        width: 6px;
        height: 2px;
        background: var(--g-datatable-header-checkbox-border-color, rgba(0, 0, 0, .54));
        border-radius: 1px;
        transition: transform .1s linear;
        transform: scale(0) rotate(-45deg);
    }

    .partialSelection[data-checked] {
        transform: scale(1) rotate(0deg);
    }

    /*CSS for mobile view*/

    /* Force table to not be like tables anymore */

    table[mobile-view],
    thead[mobile-view],
    tbody[mobile-view],
    th[mobile-view],
    td[mobile-view],
    tr[mobile-view] {
        display: block;

    }

    tbody[mobile-view] {
        overflow: hidden;
    }

    /* Hide table headers (but not display: none;, for accessibility) */

    thead tr[mobile-view] {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    tr[mobile-view] {
        border: 1px solid #ccc;
    }

    td[mobile-view] {
        border: none;
        border-bottom: none !important;
        position: relative;
        padding-right: 26px !important;
        text-align: right !important;
        height: 36px;
    }

    td[mobile-view]:last-of-type {
        text-align: -webkit-right !Important;
        padding-bottom: 45px !important;
    }

    tr td[mobile-view]:first-child {
        margin-left: 12px;
        padding-right: 0px;
        padding-top: 15px;
        width: 100%;
        left: -12px;
        text-align: left !important;
    }

    tr[mobile-view]:hover td {
        background: none;
    }

    tr[mobile-view] td[mobile-view] div p.mobileHeader {
        font-weight: bold;
    }

    .fixedToTop {
        background: #fff;
        position: fixed !important;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        top: 0;
        z-index: 1;
    }

    .fixedToTop tr td,
    .fixedToTop tr th {
        border-bottom: 0px;
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
