# Tightscript

This is a compiler that takes advantage of the acorn Typescript compiler to generate code.

There are a few fundamental features of the language:
1) It is a stateful language where you can modify memory
2) Code is executed in a single thread and is transactional; if any part of the evaluation fails, then the state changes are not recorded.
3) "undefined" has a specific meaning apart from "null". "undefined" means "I don't know what the value is." "null" means "this has a value, and it is null."
4) Whenever an undefined value is encountered, the entire operation is short-circuited and immediately returns undefined.
5) There is one function "isUndefined" which allows you to define a fallback result for an undefined value.
6) Asynchronous operations are handled like this:
    1) You define a request, for example: { type: "http", url: "https://..." }
    2) You look in a table of cached responses. If the cached response is there, then we can immediately return it.
    3) If the request is not in the cache, then the host environment will look at all the queued requests and define the value that satisfies the request. This causes the request to be removed from the queue.
    4) It's the host environment's job to figure out how it wants to fulfill requests and recalculate the result; it might choose to update the data the instant that a result is found, or, it might try to respond to all of the requests in one shot.

## Pure -- but stateful

Essentially, you're building a big function. The entirety of the state and inputs to the function are considered to be a big input to the function. The function is evaluated in a single thread and is effectively pure, in the sense that any state changes that happen within that function cannot interfere with other evaluations; and other transactions can't interfere either.

Often we think of a pure function as being stateless. However, I prefer to think of "pure" 



## Smart costing

Here's an idea that I think is awesome and important.

It is critical that we have the ability to check cost at runtime when we can figure out the value more precisely.

Here is what we need to know for any expression:

minCost() -> the minimum cost of this expression
maxCost() -> the maximum cost of this expression

minCost(args) & maxCost(args) -> the same, but callable at runtime, when the function is called.



Here is the thinking. You only want to try to do the runtime costing IF there's a good chance that there will be a benefit.

How do we know there's a benefit?

```js
function hasCostingBenefit(expr1, expr2) {
    // Calculate the best possible cost benefit we could get.
    const diff1 = Max.abs(expr1.maxCost() - expr2.minCost())
    const diff2 = Max.abs(expr2.maxCost() - expr1.minCost())
    const maxDiff = Math.max(diff1, diff2)

    // If the best possible benefit is teensy, then don't bother.
    return maxDiff < THRESHOLD
}
```

So, if there is a costing benefit to checking cost at runtime, then we'll do it. 

```js
function compareCost(expr1, expr2, method, args) {
    // method = min, max, avg
    switch (method) {
        case 'min': return Math.abs(expr1.minCost(args) - expr2.minCost(args))
        case 'max': return Math.abs(expr1.maxCost(args) - expr2.maxCost(args))
    }
}

Anyway, I just wanted to make a note of this. The point is that the compiler can just determine all on its own if it should get the runtime cost.