export class ShortUniqueId {
    constructor(options) {
        var self = this;
        this.DEFAULT_RANDOM_ID_LEN = 6;
        this.DICT_RANGES = {
            digits: [48, 58], lowerCase: [97, 123], upperCase: [65, 91]
        };
        this.dict = [];
        this.log = function log() {
            var args = [], len = arguments.length;
            while (len--)
                args[len] = arguments[len];
            args[0] = "[short-unique-id] " + args[0];
            if (this.debug === true) {
                if (typeof console !== "undefined" && console !== null) {
                    return console.log.apply(console, args);
                }
            }
            return undefined;
        };
        this.getDict = function getDict() {
            return this.dict;
        };
        this.sequentialUUID = function sequentialUUID() {
            var counterDiv;
            var counterRem;
            var id;
            id = "";
            counterDiv = this.counter;
            while (true) {
                counterRem = counterDiv % self.dictLength;
                counterDiv = parseInt(counterDiv / self.dictLength, 10);
                id += self.dict[counterRem];
                if (counterDiv === 0) {
                    break;
                }
            }
            this.counter += 1;
            return id;
        };
        this.randomUUID = function randomUUID(uuidLength) {
            var id;
            var randomPartIdx;
            var _j;
            if (uuidLength === null || typeof uuidLength === "undefined") {
                uuidLength = this.DEFAULT_RANDOM_ID_LEN;
            }
            if (uuidLength === null || typeof uuidLength === "undefined" || uuidLength < 1) {
                throw new Error("Invalid UUID Length Provided");
            }
            var idIndex;
            id = "";
            for (idIndex = _j = 0; 0 <= uuidLength ? _j < uuidLength : _j > uuidLength; idIndex = 0 <= uuidLength ? ++_j : --_j) {
                randomPartIdx = parseInt(Math.random() * self.dictLength) % self.dictLength;
                id += self.dict[randomPartIdx];
            }
            return id;
        };
        this.dictIndex = this._i = 0;
        var rangeType;
        for (rangeType in self.DICT_RANGES) {
            self.dictRange = self.DICT_RANGES[rangeType];
            self.lowerBound = self.dictRange[0], self.upperBound = self.dictRange[1];
            for (this.dictIndex = this._i = this.lowerBound; this.lowerBound <= this.upperBound ? this._i < this.upperBound : this._i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? ++this._i : --this._i) {
                self.dict.push(String.fromCharCode(self.dictIndex));
            }
        }
        this.dict = this.dict.sort(function () {
            return Math.random() <= .5;
        });
        this.dictLength = this.dict.length;
        if (options === null || typeof options === "undefined") {
            options = {};
        }
        this.counter = 0;
        this.debug = options.debug;
        this.log("Generator created with Dictionary Size " + this.dictLength);
    }
}