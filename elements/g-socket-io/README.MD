## \<g-socket-io\>

A wrapper element for [Socket.IO](https://socket.io/).

## Usage

### Install dependency
```
npm install --save socket.io-client
```

### Import element
```
import 'g-element/elements/g-socket-io/g-socket-io.js';
```

### Use the element
```
<g-socket-io id="socket"
    namespace="/" 
    connected="{{connected}}" 
    is-connection-alive="{{isConnectionAlive}}" 
    on-connect="_connect"
    on-response="_response"></g-socket-io>
```