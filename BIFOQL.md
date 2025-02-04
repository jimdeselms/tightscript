# Bifoql architecture

Bifoql works perfectly.

The overarching assumption of the architecture is that Bifoql never does anything wrong. If anything does go wrong, then that is a complete failure that will prevent the machine from running; it's not possible to catch this error; it brings the machine to a hault.

This architecture applies to the internal machine. 

Bifoql 

Bifoql is just the name that I use for any language project these days.

This document describes how Bifoql's internal machine works, and how the outside world interacts with it.

## The immutable truths

Bifoql works in "expressions". Bifoql's internal virtual machine is good at working with them.

* An expression is a concept that can be expressed somehow. A json document, a Javascript program, a bird. The expression itself is just the unique concept.
* An S-Expression is an expression in LISP form: everything is either a scalar value or a list of S-Expressions. (this (is an (S) (expression)))
* This system only deals in expressions that can be expressed with an S-Expression.
* Expressions have types. 
* A type is a predicate function that takes a value and returns true if the value is of a particular type. If a thing's predicate function passes, then the thing is that thing.
* Expressions can also be bundled into a "hub expression" which contains the S-expression, and also serves as storage for any other representations of the S-expression.
* Two expressions are equal if they have the same S-Expressions.

## Function rules

* Functions always assume that their inputs are valid.
* Functions must always return valid outputs.
* "Valid" is defined by the type predicate assigned to every input and output.
* A function repeatedly called with the same input will return the same output every time.

## Error handling

Bifoql DOES NOT HAVE ERRORS. If anything does go wrong, it brings the whole system down, so you better make sure that nothing goes wrong.



