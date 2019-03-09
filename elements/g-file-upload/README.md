## \<g-file-upload\>

A wrapper element for input type file with client side image compress using [compressorjs](https://github.com/fengyuanchen/compressorjs).

## Usage

### Import the element
```
import 'g-element/elements/g-file-upload/g-file-upload.js';
```

### Use the element
```
  <g-file-upload files="{{files}}"></g-file-upload>
```

You can also use a custom file-upload-label slot
```
  <g-file-upload files="{{files}}">
    <paper-button slot="file-upload-label">
        Choose a file
    </paper-button>
  </g-file-upload>
```

Theres also a fancy element for selecting image
```
  <g-image-upload image="{{image}}"></g-image-upload>
```
