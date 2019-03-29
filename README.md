[![Published on NPM](https://img.shields.io/npm/v/g-element.svg)](https://www.npmjs.com/package/g-element)

## G-ELEMENT

A collection of elements used by Authentic System Solutions.

## Elements

- [g-avatar](https://github.com/tigerlegab/g-element/tree/master/elements) - A user avatar element.

- [g-input-suggest](https://github.com/tigerlegab/g-element/tree/master/elements) - A paper-input that provides the user with input suggestions.

- [g-location](https://github.com/tigerlegab/g-element/tree/master/elements) - A wrapper element for html5 geo-location.

- [g-mongo-auth](https://github.com/tigerlegab/g-element/tree/master/elements) - An authorization element for nodejs mongodb.

- [g-notification](https://github.com/tigerlegab/g-element/tree/master/elements) - A wrapper element for html5 client side notification.

- [g-search-bar](https://github.com/tigerlegab/g-element/tree/master/elements) - A paper search bar element.

- [g-storage](https://github.com/tigerlegab/g-element/tree/master/elements) - A wrapper element for html5 indexed-db.

- [g-wizard-steps](https://github.com/tigerlegab/g-element/tree/master/elements) - A steps progress element.

- [g-socket-io](https://github.com/tigerlegab/g-element/tree/master/elements/g-socket-io) - A wrapper element for [Socket.IO](https://socket.io/).

- [g-calendar](https://github.com/tigerlegab/g-element/tree/master/elements/g-calendar) - A wrapper element for [FullCalendar](https://fullcalendar.io/).

- [g-datatable](https://github.com/tigerlegab/g-element/tree/master/elements/g-datatable) - A responsive data table with Polymer 3 support.

- [g-file-upload](https://github.com/tigerlegab/g-element/tree/master/elements/g-file-upload) - A wrapper element for input type file with client side image compress using [compressorjs](https://github.com/fengyuanchen/compressorjs).

- [g-signature](https://github.com/tigerlegab/g-element/tree/master/elements/g-signature) - A wrapper element for [signature_pad](https://github.com/szimek/signature_pad).

- [g-dialog](https://github.com/tigerlegab/g-element/tree/master/elements) - A polymer 3 material dialog with a few extra conveniences.

- [g-expansion-panel](https://github.com/tigerlegab/g-element/tree/master/elements) - A polymer 3 material design expansion panel with header and collapsible content.

- [g-icon-item](https://github.com/tigerlegab/g-element/tree/master/elements) - A [paper-icon-item](https://github.com/PolymerElements/paper-item) without its behavior intended for UI designing.

## Usage

### Installation
```
npm install --save g-element
```

### In an html file
```html
<html>
  <head>
    <script type="module">
      import 'g-element/elements/my-element.js';
    </script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```

### In a Polymer 3 element
```js
import {PolymerElement, html} from '@polymer/polymer';
import 'g-element/elements/my-element.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
     <my-element></my-element>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Viewing Your Element
```
polymer serve
```