
// Values
equal( lambda.id(42), 42 );
equal( lambda.id()(42), 42 );

// Parsing
equal( lambda('_ + _')(1, 2), 3 );
equal( lambda('_ + _')(1)(2), 3 );
equal( lambda('++_')(3), 4 );

// Properties
var obj = {a: 42, b: 66, c: 84};

equal( lambda.has(obj, 'a'), true );
equal( lambda.has(obj, 'd'), false );

equal( lambda.get(obj)('b'), 66 );
equal( lambda.get(obj, 'b'), 66 );

equal( lambda.set({})('d')(5), 5 );
equal( lambda.set({}, 'd', 5), 5 );

// Functions
var sub = function(b) { return this.a - b; };
var div = function(a, b) { return a / b; };
var mul = function(a, b) { return a * b; };

equal( lambda.bind(sub, obj)(7), 35 );
equal( lambda.bind(sub)(obj)(7), 35 );
equal( lambda.bind(sub, _)(obj)(7), 35 );
equal( lambda.bind(sub)()(obj)(7), 35 );
equal( lambda.bind()(sub, obj)(7), 35 );
equal( lambda.flip(lambda.bind)(obj, sub)(7), 35 );

equal( lambda.curry(div)(6, 2), 3 );
equal( lambda.curry(div, 6)(2), 3 );
equal( lambda.curry(div, 6, 2)(), 3 );

equal( lambda.apply(mul, [7, 5]), 35 );
equal( lambda.apply(mul)([7, 5]), 35 );

// Arrows
equalStrings( lambda.fanout(mul, div)(10, 5), [50, 2] );

// Math
equal( lambda.square(4), 16 );
equal( lambda.cube(6), 216 );

// Parity
equal( lambda.even(42), true );
equal( lambda.even(43), false );
equal( lambda.odd(84), false );
equal( lambda.odd(85), true );

// Lists
var nums = [5, 1, 6, 4, 2, 3];
var strs = ['a', 'ab', 'abc'];

equal( lambda.first(nums), 5 );
equal( lambda.second(nums), 1 );
equal( lambda.third(nums), 6 );
equal( lambda.last(nums), 3 );

equalStrings( lambda.lead(nums), [5, 1, 6, 4, 2] );
equalStrings( lambda.tail(nums), [1, 6, 4, 2, 3] );
equalStrings( lambda.take(nums, 2), [5, 1] );
equalStrings( lambda.drop(nums, 3), [4, 2, 3] );
equalStrings( lambda.part(nums, 4), [[5, 1, 6, 4], [2, 3]] );

// Iteration
equal( lambda.each(nums, function(n, i) { if (i == 3) return i; }), 3 );
equal( lambda.each(nums, function(n, i) {}), undefined );
equal( lambda.count(nums, lambda.equals), 1 );
equal( lambda.fold(nums, lambda.plus, 21), 42 );
equal( lambda.find(nums, lambda.even), 6 );

equal( lambda.all(nums, function(n) { return n < 6; }), false );
equal( lambda.all(nums, function(n) { return n < 7; }), true );
equal( lambda.any(nums, function(n) { return n == 6; }), true );
equal( lambda.any(nums, function(n) { return n == 7; }), false );
equal( lambda.none(nums, function(n) { return n == 6; }), false );
equal( lambda.none(nums, function(n) { return n == 7; }), true );
equal( lambda.one(nums, function(n) { return n < 1; }), false );
equal( lambda.one(nums, function(n) { return n < 2; }), true );

equalStrings( lambda.map(nums, lambda.square), [25, 1, 36, 16, 4, 9] );
equalStrings( lambda.pluck(strs, 'length'), [1, 2, 3] );
equalStrings( lambda.zip(nums, strs), [[5, 'a'], [1, 'ab'], [6, 'abc'],
        [4, undefined], [2, undefined], [3, undefined]] );

// Miscellaneous
equal( lambda.empty([]), true );
equal( lambda.empty(nums), false );

equal( lambda.len([]), 0 );
equal( lambda.len(nums), 6 );

equal( lambda.toString([]), '' );
equal( lambda.toString(nums), '5,1,6,4,2,3' );

// Helpers

function equal(a, b) {
    if (a !== b) throw Error("Test failed: " + a + " !== " + b);
}

function equalStrings(a, b) {
    return equal(a.toString(), b.toString());
}

// Success!
(print || (console && console.log) || function() {})("All tests passed!");

