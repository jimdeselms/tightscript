# "Tightscript"

It's basically just Javascript with a few changes.

1) Everything is lazy evaluated -- that is, a thing is only evaluated if it's needed:
    * In the ultimate output of the function
    * In order to modify state that will be used in the final output
    * If it's used to write to the console
        * We won't offer this feature immediately, but I think it will not be difficult to add.
2) Undefined means "I can't determine the value of this expression". Null is undefined.
    * Undefined variables are propagated; 5 + undefined resolves to undefined. [1, 2, undefined] is undefined.
    * You can still have undefined in an expression, but if that undefined value becomes part of the output (or is written to console, or is used in a state update), then the result is undefined
    * This does apply to state updates, because you're saying you want to update the state, but you don't know what
      to update it to. Perhaps there might be a mechanism for not overwriting the state in such a scenario:
        * `x = (x + value) ??? x` would do what I want.
3) Errors are also propagated

## Mostly pure

Tightscript is "pure" in the sense that it is a big function that takes an input, and it does not have access to any external resources; no databases, etc. Any communication with the outside world is done by modifying state.


## Wrapping expressions and making them lazy.

What does it mean to be "lazy"?

A lazy expression is an expression which is only evaluated when it's needed. So, expressions get passed around
in their lazy form until they actually need to be resolved to the outside world.

A lazy expression can also be memoized. We won't necessarily memoize everything, but for starters we will, and we can simplify that if it bloats memory/execution time.

### Example

Here is a simple example: ```value1 + value2```

The easiest way to say that a thing isn't evaluated until you "need" it is to make it a function.

The above evalutes to: ```LAZY(() => value1() + value2())```

What is "LAZY"? LAZY is a function that wraps a function and makes it lazy.

```
function LAZY(fn) {
    let defined,value

    return () => defined ? value : (value=fn(), value)
}
```

## Structure

There are a few pieces to this.

1) The Compiler takes the input code and generates the output code.
    * The compiler takes the code and transforms it into an expression that can be evaluated with `eval`. Later we can make it fancier.
    * Since it's not just a function per se, it will wrap it into an IFFE so that we can define variables and builtin functions and suchlike.

## Everything is a variable

I want everything to be a variable.

This means that when we build the AST, we have to inject a bunch of variable declarations.

I think I have a basic framework for this that appears to be working.

## Everything is a function that can be redefined in terms of the command line arguments for the program

Either the command line arguments or -- if we just think of the program as a big function -- it's in terms of the arguments to
that function.

Here is what a function is

type ArgList = Value[][]
type MyFunc = (x: ArgList) => Value


type Lazy = (x: ArgList) => Value

Each expression is just a lazy


What if it works like this:

type Fn = (x: ArgList) => Lazy
type Lazy = () => Value


So, a function is a thing that is defined in terms of the input argument.

The output is a lazy value.


Let's think about how this might work. I expect my function to be called multiple times with slightly different outputs, and I expect it to return a result very fast, even though the computation might be quite complex.

function addDoubled(x, y) {
    return (x*2) + (y*2)
}

Let's just pretend that x*2 and y*2 are expensive to calculate, so, we want to make sure that if x doesn't change on the next call, then it can use the "lazy" value.


function addDoubled(x, y) {
    return LAZY(() => double(x) + () => double(y))
}


What does it mean for this to work?

```
function LAZY(fn) {
    let prevArgs, hasValue, value

    return (args) => {
        if (prevArgs !== args || !hasValue) {
            prevArgs = args
            hasValue = true
            value = fn(args)
        }

        return value
    }
}
```


Does it make sense for EVERYTHING to just be a function in terms of the arguments?

Or does it make sense for functions to return lazies, and those are the things that hold the values?

If you add that extra layer, you get this:

```
function LAZY(fn) {
    let prevArgs, lazyFn

    return (args) => {
        if (prevArgs !== args) {
            prevArgs = args
            lazyFn = LAZY_VAL(fn(args))
        }
    }
}

function LAZY_VAL(fn) {
    let hasValue, value

    return () => {
        if (!hasValue) {
            hasValue = true
            value = fn()
        }

        return value
    }
}
```

Okay, so if everything is a function that takes args, what does a program look like?

The values passed in must be lazies as well.

function add(args) {
    const x = args[0][0]
    const y = args[0][1]

    args.unshift

    return (
}



Here is how I want it to work.

Externally, the compiler takes arguments and returns a value.

Internally, everything is a function of this form:

```
type Lazy = () => Value
type LazyFn = (args) => Lazy
```

What would "add(x, y)" look like in this world?

x and y are variables that are defined in terms of the initial arguments.

function add(x, y) {
    return (args) {
        args.unshift([x, y])

        return () => x(args)() + y(args)()
    }
}

Is it necessary to have those two layers of functions? What would it be like if it didn't work like that?




function add(x, y) {
    return (args) {
        args.unshift([x, y])

        return x(args) + y(args)
    }
}


I don't think it works quite the way you want it to if you do it this way. Am I right? Or does it work just fine.

I think it might actually work better if you do it the previous way, and here's why. Let's think about the case of an array.


For our examples, let's assume that a variable called $xy is the equivalent of $[x][y]

In other words, reaching up to the x'th scope and getting the y'th argument.

Okay, so let's say that we've got an array of values:

[ $00, $11, $22 ]

This would be represented by a function

($) => {
    [
        $[0][0],
        $[0]
    ]
}

I'm confusing myself.

The question I'm trying to answer is, does adding that extra layer of function ness actually get us anything?

I don't think so now that I think about it more. But I will leave the door open.

If I use "LAZY" and "UNWRAP" everywhere, then I can change the implementation however I want.

Ah... it's not about arrays, it's about when the language itself creates functions.

```
const add = ($) => {
    return (x, y) {
        $.unshift([x,y])
        const result = x($) + y($)
        $.shift()
        return result
    }
}
```

Everything is a function that takes an argument

Perhaps I have this turned around? If Add itself is just the thing that takes the arguments, then there will only be one instance
of that function, so we won't be able to cache the argument.

Let's go back to the idea that the things that we pass around are just lazy wrappers that return a value.

const x = () => 5
const y = () => 10

const add = (x, y) =>


No, let's still say that the objects we pass around are functions that take arguments.

```

x + y -> x(args) + y(args)

Let's think of it this way.

Expressions are going to be shared. Any time you say "$00 + $01", it's going to lead to the exactly same function.

function add() {

}

When you run the program, you're going to pass it th e



const add = ($) => {
    return (x, y) {
        $.unshift([x,y])
        const result = x($) + y($)
        $.shift()
        return result
    }
}



Here's what you want to build.

When you run the program, you pass it that argument. It should run through the whole program and build the response.

const ARG00 = (args) => args[0][0]
const ARG01 = (args) => args[0][1]
const SUM = (args) => ARG0(args) + ARG1(args)

const ADD = (args) => {
    let prevArgs, 
    return (x, y) => {
        args.unshift([x, y])
        const result = x(args) + y(args)
        args.shift()
        return result
    }
}



function LAZY(expr) => {
    let prev,value

    return (args) => {
        if (prev!==args) {
            prev = args
            value = expr(args)
        }
        return value
    }
}

So, the "lingua franca" is a function that takes args and returns a value.

Now... back to the idea of lazy arrays. I believe this will complicate things




const ARG00 = (args) => args[0][0]
const ARG01 = (args) => args[0][1]
const ARRAY = (args) => [ E1(args), E2(args), E3(args) ]
const FIRST = (args) => {
    return (list) => {
        return list(args)[0]
    }
}

I think we're fine. In order to keep lists lazy, we can use the trick that we've done all along.

Actually, no that won't quite work, because the list entries haven't captured args at all.

So, back to my original idea. Everything needs to be 

The job of a function is to return a lazy that the client can just call with no arguments.

But, internally, it takes the external arguments and maps them into a new function.

const ARG00 = (args) => args[0][0]
const ARG01 = (args) => args[0][1]
const ARRAY = (args) => [ E1(args), E2(args), E3(args) ]
const ADD = (args) => {

}
const FIRST = (args) => {
    return (list) => {
        return list(args)()[0](args)
    }
}


function LAZY(expr) => {
    let prev,value

    return (args) => {
        if (prev!==args) {
            prev = args
            value = expr(args)
        }
        return value
    }
}

## Lazy functions

Now, an expression takes arguments and returns a void function that returns a value.

A function is no different.