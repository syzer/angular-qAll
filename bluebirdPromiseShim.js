/**
 * Created by syzer on 10/8/2014.
 */
var Promise = require('bluebird');

var a = 42;

function defer() {
    var resolve, reject;
    var promise = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}

function resolveMe(innerScope) {
    // use innerScope
    return defer();
}

var first = resolveMe(a);
var second = resolveMe(a + 1);

first.promise.then(function (data) {
    console.log('resolved first', data);
});

second.promise.then(function (data) {
    console.log('resolved second', data);
});

// all
Promise
    .all([first.promise, second.promise])
    .then(function (data) {
        console.log(data);
    });

// join
Promise
    .join(first.promise, second.promise, function (data, data2) {
        console.log('done using join', data, data2);
        return [data, data2];
    })
    .then(function (data) {
        console.log(data);
    });

// any
Promise
    .any([first.promise, second.promise])
    .then(function (data) {
        console.log('done using any promise', data);
    });

// some
Promise
    .some([first.promise, second.promise], 2)
    .then(function (data) {
        console.log('done using some', data);
    });

first.resolve(a);
second.resolve(b);
