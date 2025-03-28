# What I am building

I'm realizing a few things:
* Every paradigm is the same
* We want to be able to:
    * Evaluate the code incrementally
    * Change state
    * Optimize conditional branches by eliminating branches when we know they'll never be reached.
    * Decide operations at runtime based on their cost
        * `relcost a b` -> returns -1 if a is less expensive than b, 1 if the opposite, and 0 if they're the same (or we don't know.)
    * Optimize binary operations by doing the cheaper part first
        * Implement reversed functions in any case where order matters
        * Example: `div more-expensive less-expensive` -> `div-reverse less-expensive more-expensive`
    * Use SHAs to reference expressions so that we don't have to resolve the same expression twice.
    * Have a small number of very low-level, precise instructions 
    * All other operations are composed out of functions that build lower-level expressions
    * We want the code to eventually to eventually boil down to a simple machine of functions where each function modifies state and returns the next function, until you get to the end.
    * We want the code to be split into chunks of similar size so that we can estimate size based on the number of "chunks".


Recently, I believe my epiphany was this:

1) The program takes real-world input and returns a structure where everything is one of:
    * A real world object (a string, or array of numbers)
    * A function that takes no parameters - a lazy expression
    * A function that takes an argument and returns another similar structure
    * A composition of any other partially resolved structures

So, build that.

Does the whole "stream of symbols" thing really matter? What are the pros/cons of both?

The stream of symbols allows you to think of the system as just a stack machine.

The stream is basically postfix notation of an S-expression. 

We start with S-expressions, we can either convert it into that stream or not.

I like the stream because they're similar-sized chunks, and perhaps more likely to share a sha.




Okay, I think now, I can talk about each of the stages and see how I want them to work. Try to be concise.

* string - source code
* parse code: ast

* convert ast to S-expression - a lisp-style representation; this is where most of the magic happens
* build expression registry
    * Allows us to share expressions, used cached results, etc.
* register "expression root"
    * each expression is identified by its SHA, and points to an "expression root" that contains all the different versinos of the expression.

* optimizations
    * each binary expression is re-ordered so that the less expensive operation goes first
    * binary expressions are split up so that each node is a non-compound condition (and or)
        * x && y ? a : b -> x ? y ? a : b : b
    * traverse the expression tree and factor out branches that we can prove will not be reachable

* compile 

* build the output function
    * 


    What are we building again? A thing that takes an input stream and writes symbols to the output stream?

    Or we building a thing that takes 


    I think that I decided once before that the stream method is more flexible, and allows everything to be a neat little pipeline.


    For now we could say that the symbols are the literal tokens of the S-expression. Why not.

    And the output from the parsing pipeline would be a stream of S-expressions I guess.


    Let's just say that the input is the S-expression.

    So, the first layer of the pipeline would read S-expressions and yield 


    Maybe we deal with S-expressions for as long as possible, and then when it's optimized, THEN we convert it to the
    stream of output tokens.