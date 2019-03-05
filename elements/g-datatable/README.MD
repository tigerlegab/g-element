## \<g-datatable\>

A responsive data table with Polymer 3 support.
From the original `paper-datatable` - [David-Mulder paper-datatable](https://github.com/David-Mulder/paper-datatable) and Polymer 2 `bwt-datatable` - [Bluewatertracks bwt-datatable](https://github.com/bluewatertracks/bwt-datatable) 

### Todos
1. Implement `paper-datatable-card`
2. Sorting
3. Filtering/Search

## Usage

### Import the element
```
import 'g-element/elements/g-datatable/g-datatable.js';
```

### Use the element
```
  <g-datatable data="{{data}}" selectable multi-selection selected-items="{{selectedItems}}">
    <div slot="no-results">No users found.</div>
    <g-datatable-column header="Id" property="id" type="Number"></g-datatable-column>
    <g-datatable-column header="Title" property="title" type="String"></g-datatable-column>
    <g-datatable-column header="Name" property="name" type="Object">
        <template>
            <span>[[value.firstname]]</span>
            <span>[[value.middlename]]</span>
            <span>[[value.lastname]]</span>
        </template>
    </g-datatable-column>
  </g-datatable>
```