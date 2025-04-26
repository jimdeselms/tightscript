# TODO

## Language features
* Arrays
* Objects

## Optimizations
In addition to pruning conditional branches that can be proven to be true or false, we can also convert the conditions themselves to just be replaced with true or false.



Now, I want to start thinking about the execution layer.

Currently, I am compiling everything to a function.


# New epiphany

I've been thinking about this all wrong. Ultimately, the main innovation of this project is how undefined and errors work. Nothing else is as important.

This is the behavior you want:

Instead of worrying so much about expressions, we're more interested in the primtiives. Anyway, w'ell


How do we want this to work? What are the operations I can do on an expression?

1) I can expand it (resolve?)



Here is the truth:

everything is a function that takes input and returns output. It might modify the input.

An expression throws an error ifANYTHIGN goes wrong, including trying to resolve undefined.



I think that we do need to distinguish between undefined and error. It's okay for things to be undefined, and when they are, we want to exit out.