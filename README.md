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