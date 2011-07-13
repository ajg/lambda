
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
var list = [5, 1, 6, 4, 2, 3];

equal( lambda.first(list), 5 );
equal( lambda.second(list), 1 );
equal( lambda.third(list), 6 );
equal( lambda.last(list), 3 );

equalStrings( lambda.lead(list), [5, 1, 6, 4, 2] );
equalStrings( lambda.tail(list), [1, 6, 4, 2, 3] );
equalStrings( lambda.take(list, 2), [5, 1] );
equalStrings( lambda.drop(list, 3), [4, 2, 3] );
equalStrings( lambda.part(list, 4), [[5, 1, 6, 4], [2, 3]] );

// Miscellaneous
equal( lambda.empty([]), true );
equal( lambda.empty(list), false );

equal( lambda.len([]), 0 );
equal( lambda.len(list), 6 );

equal( lambda.toString([]), '' );
equal( lambda.toString(list), '5,1,6,4,2,3' );

function equal(a, b) {
    if (a !== b) throw Error("Test failed: " + a + " !== " + b);
}

function equalStrings(a, b) {
    return equal(a.toString(), b.toString());
}

// Success!
(print || (console && console.log) || function() {})("All tests passed!");

