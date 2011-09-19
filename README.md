
Lambda.js
=========

[Lambda][] is an experimental functional library for JavaScript, written
by [Alvaro J. Gutierrez][]. It aims to make functional programming in
JavaScript more succinct, practical and elegant.

Hosting for the [project][] is kindly provided by GitHub. You
can report bugs and discuss features on the [issues][] page.


Downloads
---------

1. [Plain Version (0.1)](lambda.js)
   _Uncompressed, with comments (13K)_

2. [Shrunk Version (0.1)](lambda-shrunk.js)
   _Compressed, without comments (5K)_


Introduction
------------

[Lambda][] provides three useful tools to improve functional programming
in JavaScript: First, it lets you succinctly [define][] new functions using
placeholder notation. Second, it lets you [enhance][] existing functions
and bring them up to snuff. Third, it [supplies][] a stable of core functions
without which you'll feel lost and desolate. Together, they assemble
to form Voltron!


Usage
-----

The main access point to [Lambda][] is the `lambda` object and function.

As an object, it offers [supplies](#supplies) several functions ready to be applied.

As a function, it accepts a single argument, `fn`, which can be either
a string or a function. If it is a string, it will define a new lambda.
If it's a function, it will enhance the existing function by 'wrapping'
it in a lambda.


Partial Application
-------------------

Lambdas are different from regular functions in a few ways, one of which is the
way arguments are handled. In particular, lambdas let you omit arguments when
you call them. The result of calling a lambda with missing arguments is a
_partially applied_ lambda, which means it itself can be called with the 
remaining arguments to _complete_ the call. There are two ways to partially
apply lambdas:

### Implicitly

When a lambda is called with fewer arguments than necessary (according to its
arity), the result is a partially applied function. Once the required arity is
met (or surpassed), the original function is called.

    var plusFour = lambda.plus(4);

    plusFour(1)
    >> 5

    plusFour(5)
    >> 9

### Explicitly
 
Sometimes the position in which missing arguments are supplied does not match
that of the function's argument list; that is, the missing arguments may not
be at the end.

In such cases, placeholders can be used. The placeholder symbol is `_`. When
a lambda is called using one or more placeholders, those arguments are
considered missing, while the rest will be used towards partial application.

    var cube = lambda.pow(_, 3);

    cube(4)
    >> 64

    cube(2)
    >> 8


Compatibility
-------------

So far, [Lambda][] has only been tested using the Rhino, Spidermonkey, Carakan
and V8 JavaScript engines, the latter of which power Firefox, Opera and Chrome,
respectively.

If you would find it in your heart to test the library, and report any issues,
with other engines, such as Chakra (Internet Explorer) or SquirrelFish (Safari),
then the universe will certainly smile upon you.


## Supplies {#supplies}

### Properties

[get](#get), [set](#set), [has](#has), [del](#del)

### Lists

[first](#first), [second](#second), [third](#third), [last](#last),
[drop](#drop), [take](#take), [lead](#lead), [tail](#tail), [part](#part)

### Functions

bind, flip, memoize, curry, compose, apply
    
### Operators

* Unary      — [increment](#increment), [decrement](#decrement)
* Arithmetic — [posated](#posated), [negated](#negated),
               [plus](#plus), [minus](#minus), [times](#times),
               [over](#over), [modulo](#modulo)
* Logical    — [not](#not), [and](#and), [or](#or), [xor](#xor)
* Bitwise    — [bitNot](#bitNot), [bitAnd](#bitAnd),
               [bitOr](#bitOr), [bitXor](#bitXor),
* Shifting   — [leftShift](#leftShift), [rightShift](#rightShift),
               [logicShift](#logicShift)
* Comparison — equals, unequals, greater, lesser, greaterEqual,
               lesserEqual, identical, unidentical

### Math

[power](#power), [square](#square), [cube](#cube)

### Parity

[even](#even), [odd](#odd)

### Values

[identity](#identity), [noop](#noop)

### Types

[type](#type), [is](#is), [cons](#cons), [prot](#prot) 

### Arrows & Control

fanout, ifElse

### Arrays

lambda.concat, indexOf, join, pop, push, reverse,
shift, slice, sort, splice, unshift, valueOf

### Iteration

each, count, map, pluck, zip, fold,
all, any, none, one, find
    
### Miscellaneous

[empty](#empty), [length](#length), [toString](#toString)


Properties
------------------------------------------------------------------------------

#### .get `(object, name)` {#get}
Returns the value of property `name` in `object`.

#### .set `(object, name, value)` {#set}
Sets property `name` in `object` to `value`, and returns the latter.

#### .has `(object, name)` {#has}
Returns whether `object` has property `name` defined (but not inherited.)

#### .del `(object, name)` {#del}
Unsets property `name` in `object`, and returns whether it was successful.

    var object = {foo: 42, bar: 66};

    lambda.get(object, 'foo')
    >> 42
    lambda.set(object, 'qux', 84)
    >> 84
    lambda.has(object, 'qux')
    >> true
    lambda.del(object, 'foo')
    >> true
    lambda.del([], 'length')
    >> false


Lists
------------------------------------------------------------------------------

#### .first  `(sequence)` _Shortcut: **fst**_ {#first}
#### .second `(sequence)` _Shortcut: **snd**_ {#second}
#### .third  `(sequence)` _Shortcut: **thr**_ {#third}

Return the elements at indices 0, 1, and 2, respectively.

    var array = [25, 16, 9, 4, 1];

    lambda.fst(array)
    >> 25
    lambda.snd(array)
    >> 16
    lambda.thr(array)
    >> 9

#### .last `(sequence)` {#last}

Return the last element of `sequence`.

    lambda.last([25, 16, 9, 4, 1])
    >> 1

#### .drop `(n, sequence)` {#drop}

Return `sequence` minus the first `n` elements.

    lambda.drop(3, [25, 16, 9, 4, 1])
    >> [4, 1]

#### .take `(n, sequence)` {#take}

Return the first `n` elements of `sequence`.

    lambda.take(3, [25, 16, 9, 4, 1])
    >> [25, 16, 9]

#### .tail `(sequence)` {#tail}

Return `sequence` minus the first element.

    lambda.tail([25, 16, 9, 4, 1])
    >> [16, 9, 4, 1]

#### .lead `(sequence)` {#lead}

Return `sequence` minus the last element.

    lambda.lead([25, 16, 9, 4, 1])
    >> [25, 16, 9, 4]

#### .part `(n, sequence)` {#part}

Return `sequence` partitioned into elements up to `n`, and from `n` on,
which is equivalent to `[take(n, sequence), drop(n, sequence)]`.

    lambda.part(3, [25, 16, 9, 4, 1])
    >> [[25, 16, 9], [4, 1]]


Operators
------------------------------------------------------------------------------

### Unary {#unary}

#### .increment `(x)` _Shortcut: **inc**_ {#increment}
#### .decrement `(x)` _Shortcut: **dec**_ {#decrement}

Apply prefix operators `++` and `--` respectively, to the argument.

    lambda.inc(4)
    >> 5

    lambda.dec(2)
    >> 1

### Arithmetic {#arithmetic}

#### .posated `(x)` _Shortcut: **pos**_ {#posated}
#### .negated `(x)` _Shortcut: **neg**_ {#negated}

Apply prefix operators `+` and `-` respectively, to the argument.

    lambda.pos(4)
    >> 4

    lambda.neg(2)
    >> -2

#### .plus   `(x, y)` _Shortcut: **add**_ {#plus}
#### .minus  `(x, y)` _Shortcut: **sub**_ {#minus}
#### .times  `(x, y)` _Shortcut: **mul**_ {#times}
#### .over   `(x, y)` _Shortcut: **div**_ {#over}
#### .modulo `(x, y)` _Shortcut: **mod**_ {#modulo}

Apply operators `+`, `-`, `*`, `/` and `%`, respectively,
to the arguments.

    lambda.plus(8, 2)
    >> 10
    lambda.minus(8, 2)
    >> 6
    lambda.times(8, 2)
    >> 16
    lambda.over(8, 2)
    >> 4
    lambda.modulo(8, 2)
    >> 0

### Logical {#logical}

#### .not `(x)`    {#not}
#### .and `(x, y)` {#and}
#### .or  `(x, y)` {#or}
#### .xor `(x, y)` {#xor}

Apply operators `!`, `&&`, `||`, respectively, to the arguments. The latter,
`xor`, is boolean exclusive or; meaning, `x` or `y`, but not `x` and `y`.

    lambda.not(false)
    >> true
    lambda.and(true, false)
    >> false
    lambda.or(false, true)
    >> true
    lambda.xor(true, true)
    >> false

### Bitwise {#bitwise}

#### .bitNot `(x)`    {#bitNot}
#### .bitAnd `(x, y)` {#bitAnd}
#### .bitOr  `(x, y)` {#bitOr}
#### .bitXor `(x, y)` {#bitXor}

Apply operators `~`, `&`, `|`, and `^`, respectively, to the arguments.

    lambda.bitNot(5)
    >> -6
    lambda.bitAnd(4, 2)
    >> 0
    lambda.bitOr(4, 2)
    >> 6
    lambda.bitXor(5, -6)
    >> -1

### Shifting {#shifting}

#### .leftShift `(x, y)`  _Shortcut: **lshift**_ {#leftShift}
#### .rightShift `(x, y)` _Shortcut: **rshift**_ {#rightShift}
#### .logic `(x, y)`      _Shortcut: **zshift**_ {#logicShift}

Apply operators `<<`, `>>`, and `>>>`, respectively, to the arguments.

    lambda.lshift(4, 2)
    >> -16
    lambda.rshift(4, 2)
    >> -1
    lambda.zshift(4, 2)
    >> 1073741823


Math
------------------------------------------------------------------------------

#### .power `(x, y)` {#power}

Return `x` raised to the `y`.

    lambda.pow(4, 4)
    >> 64

    lambda.pow(9, 6)
    >> 531441

#### .square `(x)` {#square}
#### .cube `(x)`   {#cube}

Return `x` raised to the power of two and three, respectively.

    lambda.squared(-5)
    >> 25

    lambda.cubed(7)
    >> 343


Parity
------------------------------------------------------------------------------

#### .even `(x)` {#even}
#### .odd `(x)`  {#odd}

Return whether `x` is or isn't evenly divisible by two, respectively.

    lambda.even(-5)
    >> false

    lambda.odd(7)
    >> true


Values
------------------------------------------------------------------------------

#### .identity `(x)` _Shortcut: **id**_ {#identity}

Returns the very same value passed.

    lambda.id(42)
    >> 42

    lambda.id(Object) === Object
    >> true

#### .noop `()` {#noop}

Stands for "no operation," and accordingly, doesn't do anything.


Types
------------------------------------------------------------------------------

#### .type `(x)` {#type}

Return the type of `x`, as determined by the `typeof` operator.

    lambda.type(1)
    >> 'number'
    
    lambda.type({})
    >> 'object'

#### .is `(x, t)` {#is}

Return `x` is considered an instance of type `t`.

#### .cons`(x)` {#cons}

Return the `constructor` of `x`.

#### .prot `(x)` {#prot}

Return the prototype of `x`.


Miscellaneous
------------------------------------------------------------------------------

#### .empty `(x)` _Shortcut: **nil**_ {#empty}

Return whether the `x` has any elements.

#### .length `(x)` _Shortcut: **len**_ {#length}

Return the number of elements in the `x`.

#### .toString `(x)` _Shortcut: **str**_ {#toString}

Return the string representation of `x`.


Links
-----

[Boost.Lambda][] helps make C++ marginally less unpleasant by
providing a mechanism to manipulate functions at a higher level than the
language would like you to. It inspired the underscore notation as
well as the name. Note that it's been largely superceded by
[Boost.Phoenix][].

There's a [Quick Explanation of Scala’s _ + _ Syntax][scala syntax],
the latter of which is one of the motivations for this project. Note that 
there are differences between the syntaxes used by Scala and Lambda.js.

Finally, [Underscore.js][] is an excellent utility library from
which Lambda.js borrows a few ideas.


Implementation
--------------

On modern JavaScript engines, [Lambda][] uses the `__proto__` property
to set an extensible prototype chain for lambdas, without making
any modification to normal functions. However, on older engines that
don't support `__proto__`, `Function.prototype` is modified directly.


Changes
-------

**0.1**
Initial release of [Lambda][].js.


[lambda]:        http://ajg.github.com/lambda/
[project]:       http://github.com/ajg/lambda/
[issues]:        http://github.com/ajg/lambda/issues/
[boost.lambda]:  http://www.boost.org/doc/libs/release/libs/lambda/
[boost.phoenix]: http://www.boost.org/doc/libs/release/libs/spirit/phoenix/
[u+03bb]:        http://www.fileformat.info/info/unicode/char/3bb/index.htm
[scala syntax]:  http://www.codecommit.com/blog/scala/quick-explanation-of-scalas-syntax
[underscore.js]: http://documentcloud.github.com/underscore/
[Alvaro J. Gutierrez]: mailto:plus{dot}ajg{at}gmail{dot}com

