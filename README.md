here is the game plan for the umpteenth time.

A "machine" is a thing that:
1) Accepts inputs
2) Writes outputs
3) Modifies state.

```
function machine(handlers, initialState) {
    const state = clone(initialState)
    return (input, onOut) => {

        // Returns the next function to call to 
    }
}
```



What is that I want to accomplish?

Here's the pattern that I want.

Let's just say, unapologetically, that I want to build is a thing that returns a function that takes an argument.

Yes, as far as the pipeline thing is concerned, 






This is what I always get hung up and I always forget to remind myself that the most important thing is that I just pick one, because they are all interchangeable.

And the nice thing about 


Right, I've said it a million times, the most important thing is that I just have that basic concept; state, input, output. That's the key to having a good pipeline.



You know, the more I think about this, you've kind of got an interface.

