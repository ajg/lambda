//
// lambda library v1.0
// Subject to the following license:
// ---------------------------------
// Copyright (c) 2011, Alvaro J. Gutierrez
// All rights reserved.
//
// Redistribution and use in source and binary forms,  with or without modifi-
// cation, are permitted provided that the following conditions are met:
//
// * Redistributions of  source code must  retain the above  copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
// * Neither the  name of the organization  nor the names of  its contributors
//   may be  used to endorse  or promote  products derived from  this software
//   without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT  LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND  FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN  NO EVENT SHALL THE COPYRIGHT HOLDER  OR CONTRIBUTORS BE
// LIABLE  FOR  ANY  DIRECT,  INDIRECT,  INCIDENTAL,  SPECIAL,  EXEMPLARY,  OR
// CONSEQUENTIAL  DAMAGES  (INCLUDING,  BUT  NOT LIMITED  TO,  PROCUREMENT  OF
// SUBSTITUTE GOODS  OR SERVICES; LOSS OF  USE, DATA, OR PROFITS;  OR BUSINESS
// INTERRUPTION) HOWEVER  CAUSED AND  ON ANY THEORY  OF LIABILITY,  WHETHER IN
// CONTRACT,  STRICT LIABILITY,  OR TORT  (INCLUDING NEGLIGENCE  OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE  OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//

var lambda = (function() {
    var global = this;
    var slice = Array.prototype.slice;

    // Play nicely with libraries that define _.
    if (global._ == undefined) global._ = undefined;

    function lambda(fn) {
        switch (typeof fn) {
            case 'string': return wrap(parse(fn), [], quote(fn, "'"));
            case 'function': return fn.lambda ? fn : wrap(fn, [], fn.toString());
            default: throw TypeError("Invalid function for lambda");
        }
    }

    var placeholders = /\b_(\d+)?\b/g;
    var parse = memoize(function(source) {
        var arity = 0;
        var body = 'return ' + source.replace(placeholders, function(t, n) {
            if (n) { // Numbered
                n = Math.max(1, parseInt(n));
                arity = Math.max(arity, n);
                return '$' + (n - 1);
            }
            else { // Unnumbered
                return '$' + arity++;
            }
        });

        var args = map(Array(arity), function(v, i) { return '$' + i; });
        return Function.apply(null, args.concat([body]));
    });

    function argumentsMissing(fn, args) {
        return Math.max(fn.length - (args.length - count(args, isPlaceholder)), 0);
    }

    function wrap(fn, args, source) {
        var wrapper = withArity(argumentsMissing(fn, args), function() {
            var actuals = fill(args, slice.call(arguments), isPlaceholder);                   
            return argumentsMissing(fn, actuals)
                ? wrap(fn, actuals, source)
                : fn.apply(this, actuals);
        });

        wrapper.lambda = true;
        wrapper.toString = curry(show, args, source);
        return wrapper;
    }

    function quote(string, ch) {
        return ch + string.replace(ch, '\\' + ch) + ch;
    }

    function show(args, source) {
        return 'lambda(' + source + ')' + map(args, function(a) { 
            return '(' + (isPlaceholder(a) ? '_' : a) + ')'; }).join('');
    }

    function isPlaceholder(arg) {
        return arg === global._ || arg === undefined;
    }

    var scalars = {'number': true, 'string': true, 'boolean': true};

    function isScalar(value) {
        return scalars[typeof value] || value === null; 
    }
    
    function withArity(arity, fn) {
        // TODO: Forward toString
        if (arity < 0) throw Error();
        var args = map(Array(arity), function(v, i) { return '$' + i; });
    
        if (Function.bind) {
            var body = 'return this.apply(null, arguments)';
            return Function.apply(null, args.concat([body])).bind(fn);
        }
        else {
            var body = 'return fn.apply(null, arguments)';
            return eval('function(' + args.join(', ') + ') { ' + body + ' }');
        }
    }

    function fill(a, b, missing) {
        var result = slice.call(a);
         
        for (var i = 0, j = 0; i < a.length; ++i) {
            if (missing(a[i])) {
                for (; j < b.length; ++j) {
                    if (!missing(b[j])) {
                        result[i] = b[j];
                        break;
                    }
                }
            }
        }
        
        return result.concat(slice.call(b, j));
    }

    function memoize(fn) {
        var strings = {};
        var scalars = {};
        var others  = [];
        
        return withArity(fn.length, function() {
            var key = slice.call(arguments);
            
            if (key.length === 1 && typeof key[0] === 'string') { // Fast path, O(1)
                key = key[0];
                if (strings.hasOwnProperty(key)) return strings[key];
                else return strings[key] = fn.apply(this, arguments);
            }
            else if (all(key, isScalar)) { // Moderate path, O(key)
                key = key.length + ';' + map(key, function(value) {
                    return typeof value + ':' + value; }).join(',');
                if (scalars.hasOwnProperty(key)) return scalars[key];
                else return scalars[key] = fn.apply(this, arguments);
            }
            else { // Slow path, O(N)
                // var entry = find(others, curry(compose(compare, first), key));
                var entry = find(others, function(entry) { return compare(entry[0], key); });
          
                if (entry) return entry[1];  
                else {
                    var value = fn.apply(this, arguments);
                    others.push([key, value]);
                    return value;
                }
            }
        });
    }
    
    function identity(fn) { return fn; }

    function flip(fn) {
        return function(a, b) { return fn.call(this, b, a); };
    }

    function compose() {
        return fold(arguments, function(a, b) {
            return withArity(b.length, function() { 
                return a.call(this, b.apply(this, arguments)); 
            });
        });
    }
    
    function curry(fn) {
        var args = slice.call(arguments, 1);
        return withArity(Math.max(0, fn.length - args.length), function() {
            return fn.apply(this, args.concat(slice.call(arguments)));
        });
    }

    function each(array, fn) {
        // any(array, function(elt, e) { fn(elt, e); return false; });
        for (var i = 0; i < array.length; ++i) {
            var result = fn.call(this, array[i], i);
            if (result !== undefined) return result;
        }
    }

    function any(array, fn) {
        return each(array, function(elt, e) {
            if (fn.call(this, elt, e)) return true; 
        }) || false;
    }

    function all(array, fn) {
        return !each(array, function(elt, e) {
            if (!fn.call(this, elt, e)) return true; 
        });
    }   

    function find(array, fn) {
        return each(array, function(elt, e) {
            if (fn.call(this, elt, e)) return elt;
        });
    }

    function count(array, fn) {
        var result = 0;
        each(array, function(elt, e) { if (fn.call(this, elt, e)) ++result; });
        return result;
    }

    function map(array, fn) {
        var result = [];
        each(array, function(elt, e) { result.push(fn.call(this, elt, e)); });
        return result;
    }

    function fold(array, fn, value) {
        if (value === undefined) {
            value = array[0];
            array = slice.call(array, 1);
        }

        each(array, function(next) { value = fn.call(this, value, next); });
        return value;
    }
    
    function compare(array1, array2) {
        // Implement using: all(zip(arrays), lambda.equalsN)
        if (array1.length !== array2.length) return false;
        else for (var i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) return false;
        }

        return true;
    }

    function bind(fn, cx) {
        return withArity(fn.length, function() {
            return fn.apply(cx, arguments); 
        });
    }

    lambda.id = lambda.identity = identity;

    lambda.each  = each;
    lambda.count = count;
    lambda.map   = map;
    lambda.fold  = fold;
    lambda.all   = all;
    lambda.any   = any;
    lambda.find  = find;
    lambda.fill  = fill;

    // Q: Should bind, curry, compose, etc. return normal functions or lambdas?
    lambda.bind    = lambda(function(fn, cx)               { return /*lambda*/(bind.apply(this, arguments)); });
    lambda.flip    = lambda(function(fn)                   { return /*lambda*/(flip.apply(this, arguments)); });
    lambda.memoize = lambda(function(fn)                   { return /*lambda*/(memoize.apply(this, arguments)); });
    lambda.curry   = lambda(function(fn, arg1, arg2, argN) { return /*lambda*/(curry.apply(this, arguments)); });
    lambda.compose = lambda(function(fn1, fn2, fnN)        { return /*lambda*/(compose.apply(this, arguments)); });

    // Logic operators
    lambda.not = lambda('!_');
    lambda.and = lambda('_ && _');
    lambda.or  = lambda('_ || _');
    lambda.xor = lambda('(_1 || _2) && !(_1 && _2)');

    // Iterator operators
    lambda.inc = lambda.increment = lambda('++_');
    lambda.dec = lambda.decrement = lambda('--_');

    // Bitwise operators
    lambda.bitNot = lambda('~_');
    lambda.bitOr  = lambda('_ | _');
    lambda.bitAnd = lambda('_ & _');
    lambda.bitXor = lambda('_ ^ _');

    // Arithmetic operators
    lambda.add = lambda.plus   = lambda('_ + _');
    lambda.sub = lambda.minus  = lambda('_ - _');
    lambda.mul = lambda.times  = lambda('_ * _');
    lambda.div = lambda.over   = lambda('_ / _');
    lambda.mod = lambda.remain = lambda('_ % _');

    // Shift operators
    lambda.lshift = lambda.leftShift  = lambda('_ << _');
    lambda.rshift = lambda.rightShift = lambda('_ >> _');
    lambda.zshift = lambda.logicShift = lambda('_ >>> _');

    // Comparison operators
    lambda.eq = lambda.equals   = lambda('_ == _');
    lambda.ne = lambda.unequals = lambda('_ != _');
    lambda.gt = lambda.greater  = lambda('_ > _');
    lambda.lt = lambda.lesser   = lambda('_ < _');
    lambda.ge = lambda.greaterEqual = lambda('_ >= _');
    lambda.le = lambda.lesserEqual  = lambda('_ <= _');
    lambda.identical   = lambda('_ === _');
    lambda.unidentical = lambda('_ !== _');

    // Math
    lambda.power  = lambda('Math.pow(_, _)');
    lambda.square = lambda.power(_, 2);
    lambda.cube   = lambda.power(_, 3);

    // Parity
    lambda.even = lambda('_ % 2 == 0');
    lambda.odd  = lambda.compose(lambda.not, lambda.even);

    // Properties
    lambda.get = lambda('_[_]');
    lambda.set = lambda('_[_] = _');
    lambda.has = lambda('_.hasOwnProperty(_)');
    lambda.del = lambda('delete _') // Q: _[_] ?

    // Types
    lambda.is   = lambda('_ instanceof _');
    lambda.type = lambda('typeof _');

    // Arrays
    lambda.concat   = lambda('_.concat(_)');
    lambda.indexOf  = lambda('_.indexOf(_)');
    lambda.join     = lambda('_.join(_)');
    lambda.pop      = lambda('_.pop()');
    lambda.push     = lambda('_.push(_)');
    lambda.reverse  = lambda('_.reverse()');
    lambda.shift    = lambda('_.shift()');
    lambda.slice    = lambda('_.slice(_, _)');
    lambda.sort     = lambda('_.sort(_)');
    lambda.splice   = lambda('_.splice(_, _)');
    lambda.unshift  = lambda('_.unshift(_)');
    lambda.valueOf  = lambda('_.valueOf()');

    // Sequences
    lambda.first  = lambda.get(_, 0);
    lambda.second = lambda.get(_, 1);
    lambda.third  = lambda.get(_, 2);
    lambda.last   = lambda('_1[_1.length - 1]');
    lambda.tail   = lambda('_.slice(1)');

    // Prototypes
    lambda.cons = lambda('_.constructor');
    lambda.prot = lambda('_.prot');

    // Miscellaneous
    lambda.ifElse   = lambda('_ ? _ : _');
    lambda.length   = lambda('_.length');
    lambda.toString = lambda('_.toString()'); 

    return lambda;
})();


