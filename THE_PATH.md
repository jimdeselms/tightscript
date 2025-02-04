# The path

This is the clearest path that I've seen to proving that this idea works.

## EVERYTHING is an S-expression that gets get put through a variety of mappers.

It starts at the very top level when you read in a file to be parsed:

"{ $ > 0 ? $ : -$ }"

This gets passed through the parser
```
(fn (condition (gt $ 0) $ (negate $)))
```

This gets "evaluated", meaning that it basically tries to evaluate it as far as it can. There isn't a lot to simplify here though

Every expression is converted into one of three things:

1) A list of primitives that are evaluated one by one
2) A jump to another list
3) A branch to an ifTrue or ifFalse expression, depending on what is on the stack.



(ref fn1 (condition (gt $ 0) $ (negate $))))


So ultimately you want to convert everything into a list of expressions. There are three kinds of expressions:
1) Do a thing and then go to the next expression
2) Jump to a different expression
3) Branch to one of two expressions.



One thing to keep in mind is that in this world, I'm not sure we have functions? We just have addresses that we jump to.

(condition (gt $ 0) $ (negate $)))

$ 0 gt
    ? $
    : $ negate

Right, so the nested prefixed S-expressions get converted into these stack operations.

I think we can express this as perhaps

(
    (fn f1 ($))
    (fn f2 ($ negate))
    (fn f3 (cond f1 f2))
    (fn f4 ($ 0 gt))
    (fn f5 (jmp f4 jmp f3))
)

So, we define a number of named functions and then we specify the "main" function. Or perhaps the last one is the "main" function.

We replace references with SHAs 

We can replace the named functions with indexes. I guess the last one can be index 0

(
    (cond 1 2)
    $
    ($ negate)
)

I need to do something else to turn this into the "swiss cheese".

The idea of the swiss cheese is that the program all fits into memory. And instead of a call stack, 
the machine is always jumping to a different location in memory.

if I think of the instruction pointer's movement through memory, I imagine it going along a path, hitting a jump or
condition, and then popping out of one hole in the cheese and going to another.

Currently, I've defined those all as functions. But I think there's another layer we need to add; we don't want a call stack.

(
    (fn f1 ($ halt))
    (fn f2 ($ negate halt))
    (fn f3 (cond f1 f2))
)



The machine needs two more instructions.

Special instructions:

JMP x       - Set the IP to x
BR x y      - Pop value on stack, jump to x if true, y if false
HALT        - Stop processing
CALL x      - Push IP + 2 to the call stack, set IP to x
RET         - Pop call stack and set IP to that instruction.



So, this allows you to keep the swiss cheese thing for most of it, but you can define functions to avoid duplication.

This method greatly reduces the requirements for a call stack.

And I think that generally speaking, we want to 