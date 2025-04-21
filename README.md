# Tightscript

Okay, here are some rules for this new incarnation of the engine.

1) An expression that doesn't reference an argument can be simplified
2) If a function can be simplified, then calling the function with zero arguments will give you the simplified expression.
3) Other than that, it's the Javascript -> SExpression compiler's job to:
    * Make sure that the types handed to any expression are correct
    * Split up any booleans; there's no "and" or "or" or "xor", but there's:
        * x && y -> x ? y ? true : false : false
        * x || y -> x ? true : y ? true : false
        * x ^ y -> x ? y ? false : true : y
        * !x -> x ? false : true



!x || y -> (x ? false : true) ? true : y ? true : false


All right! Making some progress!




