# JavascriptCompiler

The Javascript uses acorn to parse Javascript, and converts it into an S-Expression.

This end-result is not optimized, and contains primitives that aren't "final" primitives, that is, it has primitives like "add_safe" which get expanded into a more complex expression that does all the necessary type safety checks.

