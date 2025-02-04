# Expressions

An expression is a "concept" that can be "expressed" in some kind of format or schema or language.

The expression itself is really kind of an amorphous concept, and an expression really only becomes "real" through it's various representations.

A "representation" is a form of the expression, say "a text description" or, an S-expression, or, the SHA of the S-expression.

There's also the concept of "type".

Expressions are represented by values of defined types. A type is defined by a predicate function that returns true if a value is in a type, and false if
the value is not

# Mapping functions

A mapping function converts one representation of an expression into another representation.

Basically a mapping function is just a function.

# The rules

* For every expression, and every mapping function that can be applied to that expression, they will always yield the same output expression.
* Every mapping function and predicate is guaranteed to only be called with a valid input, and every function must guarantee that it will return a valid output.
    * "Valid" meaning that the input type predicate must be true for the input value, and the output predicate must be true for the output.
    * If you are in a safe context, you can always assume that the output from a function will be the correct type.
    * The compiler should be able to detect unsafe contexts at compile time.
    * The compiler should be able to identify duplicate predicates and remove them.
* Generally, when possible, you should be using bundled mapping functions, meaning that those functions all have their own consistency



# The cleare