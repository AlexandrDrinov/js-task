var STudentsKit = (function () {

    function memoizerOneArgument(func) {
        return function (n) {
            var cache = {};
            if (!(n in cache)) {
                cache[n] = func(n);
            }
            return cache[n];
        };
    }

    function memoizerArbitraryArguments(func) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var cache = {};
            if (!(args in cache)) {
                cache[args] = func.apply(this, args);
            }
            return cache[args];
        };
    }

    function objectValidate(obj) {
        if (Object.isFrozen(obj) === true || Object.isSealed(obj) === true) {
            throw new TypeError('object not modifined');
        }
    }

    function modifyObject(obj) {
        var mainArr = [];
        var i = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && typeof (obj[prop]) === 'function') {
                var newObj = {};
                newObj[prop] = obj[prop];
                mainArr[i++] = newObj;
                delete obj[prop];
            }
        }
        return mainArr;
    }

    function reCreateObject(obj) {
        var newObject = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && typeof (obj[prop]) !== 'function') {
                newObject[prop] = obj[prop];
            }
        }
        return newObject;
    }

    function getArrProperties(resultArrProperties) {
        var elProperties = [];
        for (var i = 0; i < resultArrProperties.length; i++) {
            resultArrProperties[i] = resultArrProperties[i]
                .replace(';', '')
                .replace(',', ':')
                .replace(';', '');

            elProperties[i] = parse(resultArrProperties[i]);
        }
        return elProperties;
    }

    function parse(str, func) {
        var arr = str.split(':');
        var obj = {};
        if ('func' === func) {
            obj[arr[0]] = new Function('return ' + arr[1])();
        } else {
            obj[arr[0]] = arr[1];
        }
        return obj;
    }

    function getArrFunctions(resultArrMethods) {
        var regExpFunction = /\|function/i;
        var elFunc = [];
        for (var i = 0; i < resultArrMethods.length; i++) {
            var temp = regExpFunction.exec(resultArrMethods[i]);
            if (temp !== null) {
                resultArrMethods[i] = resultArrMethods[i]
                    .replace(',|', ':')
                    .replace('|', '');
            } else {
                resultArrMethods[i] = resultArrMethods[i]
                    .replace(',|', ':function(){')
                    .replace('|', ';}');

            }
            elFunc[i] = parse(resultArrMethods[i], 'func');
        }
        return elFunc;
    }

    return {
        memoizer: function (func) {
            if (func.arguments == 1) {
                return memoizerOneArgument(func);
            } else {
                return memoizerArbitraryArguments(func);
            }
        },
        isArrayLike: function (obj) {
            if (obj &&
                typeof obj === 'object' &&
                isFinite(obj.length) &&
                obj.length >= 0 &&
                obj.length === Math.floor(obj.length) &&
                obj.length < 4294967296
            ) {
                return true;
            } else {
                return false;
            }
        },
        debehaviorize: function (obj, isBehaviorSeparate) {
            try {
                objectValidate(obj);
                if (isBehaviorSeparate) {
                    return modifyObject(obj);
                } else {
                    return reCreateObject(obj);
                }
            } catch (e) {
                console.log('' + e + '\n');
                return obj;
            }
        },
        behaviorize: function (obj, behaviorArr) {
            for (var i = 0; i < behaviorArr.length; i++) {
                if (typeof behaviorArr[i] === 'object') {
                    var tempObj = behaviorArr[i];
                    for (var prop in tempObj) {
                        if (tempObj.hasOwnProperty(prop)) {
                            obj[prop] = tempObj[prop];                            
                        }
                    }
                }
            }
            return obj;
        },
        objectify: function (objFromOneString) {
            try {
                var regExpProperty = /;\w+,\w+;/gi;
                var resultArrProperties = regExpProperty.exec(objFromOneString);
                var arrProperties = getArrProperties(resultArrProperties);

                var regExpMethod = /\w+,\|[^|]+\|/gi;
                var resultArrMethods = regExpMethod.exec(objFromOneString);
                var arrFunctions = getArrFunctions(resultArrMethods);

                var obj = {};
                this.behaviorize(obj, arrProperties);
                this.behaviorize(obj, arrFunctions);

                return obj;
            } catch (e) {
                return 'ERROR: null is not correct param';
            }

        },
        stringify: function (obj, callback) {
            if (obj === null) {
                return 'ERROR: null is not correct param';
            }
            if (typeof obj === 'object') {
                var resultString = '';
                if (typeof callback === 'function') {
                    callback(obj, true);
                }
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        resultString += ';' + prop + ',';
                        if (typeof obj[prop] === 'function') {
                            resultString += '|' + obj[prop] + '|';
                        } else {
                            resultString += obj[prop];
                        }
                    }
                }
                return resultString + ';';
            }
        }
    };
})();

module.exports = STudentsKit;

