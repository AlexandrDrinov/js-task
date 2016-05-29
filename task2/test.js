//import
var STKit = require('./STudentsKit');

function printObject(obj) {
    console.log(obj);
    console.log();
}

function objToString(obj) {
    return JSON.stringify(obj);
}

function print(printString, callNumber) {
    var i = 0;
    while (i < callNumber) {
        console.time('time');
        console.log(printString);
        console.timeEnd('time');
        console.log();
        i++;
    }
}

function factorial(n) {
    var res = 1;
    while (n !== 1) {
        res *= n--;
    }
    return res;
}

function createObjectOfString(data) {
    var group = data.split(';');
    var obj = {};
    for (var i = 0; i < group.length; i++) {
        if ('' !== group[i]) {
            var elements = group[i].split(',');
            if (elements.length === 2) {
                obj[elements[0]] = elements[1];
            }
        }
    }
    return obj;
}

function sumArguments() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        if (typeof(arguments[i]) == 'number') {
            sum += arguments[i];
        }
    }
    return sum;
}

//test1
var factorialMemo = STKit.memoizer(factorial);
var number = 5;
console.log('<---------- TEST 1 ---------->');
print('factorial ' + number + ' is ' + factorialMemo(number), 2);

//test2
var semiColonSonMemo = STKit.memoizer(createObjectOfString);
var data = ';key,value;key1,value;key3,value3;';
console.log('<---------- TEST 2 ---------->');
print('create object of string: Object = ' + JSON.stringify(semiColonSonMemo(data)), 2);

//test3
var sum = STKit.memoizer(sumArguments);
var arrArguments = [1, 5, 4, 7, 8, 10, 1, 5, 4, 7, 8, 10, 1, 5, 4, 7, 8, 10, 1, 5, 4, 7, 8, 10];
console.log('<---------- TEST 3 ---------->');
print('summa: ' + sum.apply(this, arrArguments), 2);

//test4
var testArr1 = [1, 2, 4, 5, 6, 7, 8, 9, 3];
var testObj1 = {0: 'value1', 1: 'value2', 4: 'value3', length: 3};
var testObj2 = {key1: 'value1', key2: 'value2'};
var testObj3 = {0: 'value1', 1: 'value2', 3: 'value2'};
var testArr2 = [1];
var testObj4 = {0: 1, length: 1};
var testObj5 = {length: 1, height: 2};
var testFakeElement0 = function () {
};
var testFakeElement1 = {foo: NaN, length: 1};
var testFakeElement2 = {'12.24': 1, length: 1};
var testFakeElement3 = '';
var testFakeElement4 = '1';
console.log('<---------- TEST 4 ---------->');
print(testArr1 + ' isArrayLike: ' + STKit.isArrayLike(testArr1), 1);
print(objToString(testObj1) + ' isArrayLike: ' + STKit.isArrayLike(testObj1), 1);
print(objToString(testObj2) + ' isArrayLike: ' + STKit.isArrayLike(testObj2), 1);
print(objToString(testObj3) + ' isArrayLike: ' + STKit.isArrayLike(testObj3), 1);
print(testArr2 + ' isArrayLike: ' + STKit.isArrayLike(testArr2), 1);
print(objToString(testObj4) + ' isArrayLike: ' + STKit.isArrayLike(testObj4), 1);
print(objToString(testObj5) + ' isArrayLike: ' + STKit.isArrayLike(testObj5), 1);
print(testFakeElement0 + ' isArrayLike: ' + STKit.isArrayLike(testFakeElement0), 1);
print(objToString(testFakeElement1) + ' isArrayLike: ' + STKit.isArrayLike(testFakeElement1), 1);
print(objToString(testFakeElement2) + ' isArrayLike: ' + STKit.isArrayLike(testFakeElement2), 1);
print(objToString(testFakeElement3) + ' isArrayLike: ' + STKit.isArrayLike(testFakeElement3), 1);
print(objToString(testFakeElement4) + ' isArrayLike: ' + STKit.isArrayLike(testFakeElement4), 1);

//test5 and test6
var objPerson = {
    id: 2,
    name: 'Vasya',
    sex: 'man',
    go: function () {
        return 'go-go.\n';
    },
    think: function () {
        return 'I think.\n';
    },
    speak: function () {
        return 'I am speak.\n';
    },
    personTaskSum: function (a, b) {
        return (a + b);
    }
};
console.log('<---------- TEST 5 and TEST 6 ---------->');
printObject(objPerson);
printObject(STKit.debehaviorize(objPerson));
var funcArr = STKit.debehaviorize(objPerson, true);
printObject(funcArr);
printObject(STKit.behaviorize(objPerson, funcArr));
console.log(objPerson.go());
printObject(STKit.debehaviorize(objPerson, false));
printObject(STKit.debehaviorize(Object.freeze(objPerson), null));
printObject(STKit.debehaviorize(Object.seal(objPerson), true));

//test7
var oneString = ';key,value;methodName,|return true|;';
var twoString = ';key,value;methodName,|function (a) { return a + 1; }|;';
var elObj1 = STKit.objectify(oneString);
var elObj2 = STKit.objectify(twoString);
console.log('<---------- TEST 7 ---------->');
console.log(elObj1);
console.log(elObj2);
console.log('elObj2.methodName() return ' + elObj1.methodName());
console.log('elObj2.methodName(5) return ' + elObj2.methodName(5));
printObject(STKit.objectify(null));

//test8
console.log('<---------- TEST 8 ---------->');
var testObj1 = {key: 'value', methodName : function() {return true;} };
var testObj2 = {key: 'value', methodName : function(a) {return a + 1;} };
console.log(STKit.stringify(testObj1));
console.log(STKit.stringify(testObj1, STKit.debehaviorize));
console.log(STKit.stringify(testObj2));
console.log(STKit.stringify(testObj2, STKit.debehaviorize));
console.log(STKit.stringify(null, undefined));
