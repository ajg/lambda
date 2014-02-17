// Copyright (c) 2014, Alvaro J. Genial (http://alva.ro)

var lambda = this.lambda || require('./lambda.js');

exports['test that should be broken down into parts'] = function(assert) {

    // Values
    assert.equal( lambda.id(42), 42 );
    assert.equal( lambda.id()(42), 42 );

    // Parsing
    assert.equal( lambda('_ + _')(1, 2), 3 );
    assert.equal( lambda('_ + _')(1)(2), 3 );
    assert.equal( lambda('++_')(3), 4 );

    // Properties
    var obj = {a: 42, b: 66, c: 84};

    assert.equal( lambda.has(obj, 'a'), true );
    assert.equal( lambda.has(obj, 'd'), false );

    assert.equal( lambda.get(obj)('b'), 66 );
    assert.equal( lambda.get(obj, 'b'), 66 );

    assert.equal( lambda.set({})('d')(5), 5 );
    assert.equal( lambda.set({}, 'd', 5), 5 );

    // Functions
    var sub = function(b) { return this.a - b; };
    var div = function(a, b) { return a / b; };
    var mul = function(a, b) { return a * b; };

    assert.equal( lambda.bind(sub, obj)(7), 35 );
    assert.equal( lambda.bind(sub)(obj)(7), 35 );
    assert.equal( lambda.bind(sub, _)(obj)(7), 35 );
    assert.equal( lambda.bind(sub)()(obj)(7), 35 );
    assert.equal( lambda.bind()(sub, obj)(7), 35 );
    assert.equal( lambda.flip(lambda.bind)(obj, sub)(7), 35 );

    assert.equal( lambda.curry(div)(6, 2), 3 );
    assert.equal( lambda.curry(div, 6)(2), 3 );
    assert.equal( lambda.curry(div, 6, 2)(), 3 );

    assert.equal( lambda.apply(mul, [7, 5]), 35 );
    assert.equal( lambda.apply(mul)([7, 5]), 35 );

    // Arrows
    assert.deepEqual( lambda.fanout(mul, div)(10, 5), [50, 2] );

    // Math
    assert.equal( lambda.square(4), 16 );
    assert.equal( lambda.cube(6), 216 );

    // Parity
    assert.equal( lambda.even(42), true );
    assert.equal( lambda.even(43), false );
    assert.equal( lambda.odd(84), false );
    assert.equal( lambda.odd(85), true );

    // Lists
    var nums = [5, 1, 6, 4, 2, 3];
    var strs = ['a', 'ab', 'abc'];

    assert.equal( lambda.first(nums), 5 );
    assert.equal( lambda.second(nums), 1 );
    assert.equal( lambda.third(nums), 6 );
    assert.equal( lambda.last(nums), 3 );

    assert.deepEqual( lambda.lead(nums), [5, 1, 6, 4, 2] );
    assert.deepEqual( lambda.tail(nums), [1, 6, 4, 2, 3] );
    assert.deepEqual( lambda.take(nums, 2), [5, 1] );
    assert.deepEqual( lambda.drop(nums, 3), [4, 2, 3] );
    assert.deepEqual( lambda.part(nums, 4), [[5, 1, 6, 4], [2, 3]] );

    // Iteration
    assert.equal( lambda.each(nums, function(n, i) { if (i == 3) return i; }), 3 );
    assert.equal( lambda.each(nums, function(n, i) {}), undefined );
    assert.equal( lambda.count(nums, lambda.equals), 1 );
    assert.equal( lambda.fold(nums, lambda.plus, 21), 42 );
    assert.equal( lambda.find(nums, lambda.even), 6 );

    assert.equal( lambda.all(nums, function(n) { return n < 6; }), false );
    assert.equal( lambda.all(nums, function(n) { return n < 7; }), true );
    assert.equal( lambda.any(nums, function(n) { return n == 6; }), true );
    assert.equal( lambda.any(nums, function(n) { return n == 7; }), false );
    assert.equal( lambda.none(nums, function(n) { return n == 6; }), false );
    assert.equal( lambda.none(nums, function(n) { return n == 7; }), true );
    assert.equal( lambda.one(nums, function(n) { return n < 1; }), false );
    assert.equal( lambda.one(nums, function(n) { return n < 2; }), true );

    assert.deepEqual( lambda.map(nums, lambda.square), [25, 1, 36, 16, 4, 9] );
    assert.deepEqual( lambda.pluck(strs, 'length'), [1, 2, 3] );
    assert.deepEqual( lambda.zip(nums, strs), [[5, 'a'], [1, 'ab'], [6, 'abc'],
        [4, undefined], [2, undefined], [3, undefined]] );

    // Miscellaneous
    assert.equal( lambda.empty([]), true );
    assert.equal( lambda.empty(nums), false );

    assert.equal( lambda.len([]), 0 );
    assert.equal( lambda.len(nums), 6 );

    assert.equal( lambda.toString([]), '' );
    assert.equal( lambda.toString(nums), '5,1,6,4,2,3' );
}

if (module == require.main) {
    require('test').run(exports);
}
