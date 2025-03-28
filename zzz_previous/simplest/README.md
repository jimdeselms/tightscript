# The simplest form

This form has a few notions:

1) The canonical form of any expression is its S-expression form.
1) The act of compiling an expression is to take an S-expression and convert it into a compiled expression function.
1) A compiled expression function is a function that takes an argument and returns:
    1) The result of evaluating the expression -- assuming that the argument replaces the expression $0
    2) The optimized form of the S-expression, given that $0 is the argument to the expression function
    3) A compiled expression that takes the next argument.
        * It's possible that an expression takes zero arguments; it doesn't matter what you pass it, it will always return the same result.
