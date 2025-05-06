# TightScript

It's occurring to me that I want to get to the point of having a functional language as quickly as possible, even if it means that it will have terrible performance.

So, I just need to build an interpreter as quickly as possible, but I need to know how the language is going to work FIRST. And if you get it to work by just running a bunch
of unoptimized function calls, then so be it.


So, how IS the language going to work?

I know that internally, I want S-expressions, so as long as everything gets into some S-Expression form, that's fine.

And I suppose that I can have a couple other primitives like "object" and "array" or "list", which basically point to something that isn't a typical S-expression term.

Anyway! The parser's job is to get it into an S-expression, and the interpreter's job is to run the program.

And in the beginning, the S-expression is going to be a glorified AST. I mean, I guess it'll just be the AST. So it'll be the interpreter's job to maintain the 
relevant state and "run" the program.

If we choose a good basic machine for "running" the machine, then we can make it slow and stupid for now, but if we implement this as a big S-Expression, then it should
be possible to replace the implementation of the primitives in a piecemeal fashion.

So, let's focus



Right, this is how I want it to work.

At every level of the machine, from the very top-level interpreter, to the low-level implementation, everything works like this:

An S-expression works like this:

If the thing isn't an array, then it's an atomic expression.

Otherwise, the string MUST be in the form [string, ...sExpression[]]

The first element of the array is the name of a primitive function, and the rest are expressions.

What they output is what is important. I could argue that it doesn't matter what the output type is, as long as the caller knows what it is.

Right? Because some primitives might act on different types.

```ts
type PrimtiveFn = (...args: SExpression[]) => ...

```

All that matters is that at the very root level, it works like this:

```ts
type Expression<T> = ScalarExpression<T> | ListExpression
type ScalarExpression<T> = string | number | boolean | null | undefined | T
type ListExpression<T> = [ string, ...Expression<T>[] ]
type PrimitiveFn<TIn, TOut> = (in: Expression<TIn>) => Expression<TOut>
```

Ah, I just remembered my point.

Whatever you return from the primitive is always still an S-expression, and it does not have to be fully resolved.

And, I think this was what I wanted to do earlier... Basically what you're doing is saying that if you can solve the thing, then you'll resolve it, otherwise, I'll defer it.



Oh wait, I think that we can abstract out the state so that it's baked into the handlers.

So, a lot of magic happens in the building of the dictionary of handler functions.

ANYWAY, I digress.

What this means is that I should be able to replace the implementation of these primitives with lower and lower level implementations.

BUT. The point is that if I have have a working interpreter as quickly as possible, then THAT is when I start with the optimizations. DIG?

1) Make it work
2) Replace primitives with better implementations, can do one at a time.