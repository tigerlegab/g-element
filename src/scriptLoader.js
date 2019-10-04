export class ScriptLoader {
    constructor(scripts, callback) {
        this.loadCount = 0;
        this.totalRequired = scripts.length;
        this.callback = callback;

        for (var i = 0; i < scripts.length; i++) {
            this.writeScript(scripts[i]);
        }
    }

    loaded(_evt) {
        this.loadCount++;
        if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
    }

    writeScript(src) {
        var self = this;
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.src = src;
        s.addEventListener('load', function (e) { self.loaded(e); }, false);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
}

export class CssScriptLoader {
    constructor(files, callback) {
        if (!(files instanceof Array)) throw new Error('files must be an array of string');
        if (!(callback instanceof Function)) throw new Error('callback must be a function');
        this._files = files.filter((file, index) => files.indexOf(file) === index);
        this._load();
    }

    _load() {
        let _file = this._files.shift();
        if (!_file) return this.callback.call();
        if (_file.split('.').pop() === 'css') {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = _file;
            link.onload = () => this._load();
            document.head.appendChild(link);
        } else {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = _file;
            script.onload = () => this._load();
            document.head.appendChild(script);
        }
    }
}