
equals( lambda.id(42), 42 );
equals( lambda.id()(42), 42 );

equals( lambda('_ + _')(1, 2), 3 );
equals( lambda('_ + _')(1)(2), 3 );
equals( lambda('++_')(3), 4 );

var obj = {a: 42, b: 66, c: 84};
var sub = function(b) { return this.a - b; };
var div = function(a, b) { return a / b; };

equals( lambda.has(obj, 'a'), true );
equals( lambda.has(obj, 'd'), false );

equals( lambda.get(obj)('b'), 66 );
equals( lambda.get(obj, 'b'), 66 );

equals( lambda.bind(sub, obj)(7), 35 );
equals( lambda.bind(sub)(obj)(7), 35 );
equals( lambda.bind(sub, _)(obj)(7), 35 );
equals( lambda.bind(sub)()(obj)(7), 35 );
equals( lambda.bind()(sub, obj)(7), 35 );
// equals( lambda.bind(sub)(obj, 7), 35 );
equals( lambda.flip(lambda.bind)(obj, sub)(7), 35 );

equals( lambda.square(4), 16 );
equals( lambda.cube(6), 216 );


equals( lambda.curry(div)(6, 2), 3 );
equals( lambda.curry(div, 6)(2), 3 );
equals( lambda.curry(div, 6, 2)(), 3 );

function equals(a, b) {
    if (a !== b) throw Error("Test failed: " + a + " !== " + b);
}

/*echo("All tests passed!");

function echo(s) {
    if (print) print(s);
    else if (console && console.log) console.log(s);
    else if (alert) alert(s);
}
*/

