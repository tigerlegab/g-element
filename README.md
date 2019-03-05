[![Published on NPM](https://img.shields.io/npm/v/g-element.svg)](https://www.npmjs.com/package/g-element)

## G-ELEMENT

A collection of elements used by Authentic System Solutions.

## Elements

- [g-avatar](https://github.com/tigerlegab/g-element/tree/master/elements) - A user avatar element.

- [g-input-suggest](https://github.com/tigerlegab/g-element/tree/master/elements) - A paper-input that provides the user with input suggestions.

- [g-location](https://github.com/tigerlegab/g-element/tree/master/elements) - A geo-location element.

- [g-mongo-auth](https://github.com/tigerlegab/g-element/tree/master/elements) - An authorization element for nodejs mongodb.

- [g-notification](https://github.com/tigerlegab/g-element/tree/master/elements) - A client side notification element.

- [g-search](https://github.com/tigerlegab/g-element/tree/master/elements) - A search bar element.

- [g-storage](https://github.com/tigerlegab/g-element/tree/master/elements) - An indexed-db element.

- [g-wizard-steps](https://github.com/tigerlegab/g-element/tree/master/elements) - A steps progress element.

- [g-socket-io](https://github.com/tigerlegab/g-element/tree/master/elements/g-socket-io) - A wrapper element for [Socket.IO](https://socket.io/).

- [g-calendar](https://github.com/tigerlegab/g-element/tree/master/elements/g-calendar) - A wrapper element for [FullCalendar](https://fullcalendar.io/).

- [g-datatable](https://github.com/tigerlegab/g-element/tree/master/elements/g-datatable) - A responsive data table with Polymer 3 support.

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
      import 'g-element/g-element.js';
    </script>
  </head>
  <body>
    <g-element></g-element>
  </body>
</html>
```

### In a Polymer 3 element
```js
import {PolymerElement, html} from '@polymer/polymer';
import 'g-element/g-element.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
     <g-element></g-element>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Viewing Your Element
```
polymer serve
```