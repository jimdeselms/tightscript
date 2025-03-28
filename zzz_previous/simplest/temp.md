Let's say that I wanted to take an MPV id, get its product id, and get the prices


Program:
    to_MpvId: (x) => typeof x === 'string'

MpvId:






The whole point is that any program can be thought of in any of these terms:

* A big function
    * PROs: You just run it
    * CONs: You can't inspect it, so you can't optimize it.
* An S-expression
    * PROs: You can inspect it however you want and apply a million optimizations to it. You just figure out what they are.
    * CONs: The S-expression is trivial; it's up to the various primitive handlers to do the heavy lifing.
* A hierarchy of expressions that branch based on a predicate
    * You run a little code, run a predicate, check if the top of the stack is true or false, then run some more code, until you get to the end.
* A graph of types and actions, with the source of getting from the start type to the end time, passing through the given actions.
    * You specify a program by saying what the start type is, a set of actions, and then say what the end type is.



If that's true that every function is a statement of start and end type, and a 




Anyway, can we try doing my favorite overtime calculation and see what that means in the various methods.

Ultimately, there will be "leaf" primitives, and I'd like to describe the problem going as deep as I can so that I just have a few primitive primitives.


Okay...

So, for the overtime calculation, you start with an Input, let's say.

The input itself is just a Javscript object; it can be anything at all.


```
Input:
    isa: TRUE

HoursAndRate: null
    getOvertimePay: ADD(MUL(getRegularHours, getRate), MUL(getOvertimeHours, MUL(getRate, CONSTANT(1.5))))

Over40HoursAndRate:
    getRegularHours: CONSTANT(40),
    getOvertimeHours: SUBTRACT(CONSTANT(40), getHours),
    
Under40HoursAndRate:
    getRegularHours: getHours,
    getOvertimeHours: CONSTANT(0)


HoursAndRateTuple:
    isa: AND(ISA(TUPLE(2)), AND(ISA(NUMBER, ELEMENT(0), ISA(NUMBER, ELEMENT(1)))))

    getHours: ELEMENT(0)
    getRate: ELEMENT(1)

HoursAndRateObject:
    isa: AND(ISA(OBJECT), AND(AND(ISA(NUBMER), PROPERTY("hours")), AND(ISA(NUMBER), PROPERTY("rate"))))
    getHours: PROPERTY("hours")
    getRate: PROPERTY("rate")

So, what is happening here?

I guess that each expression is going to be able to figure out its type based on where the underlying actions lead. But I think that



So... this is the whole point.

Wait... what does it mean if we've got stack



Oh check this.


Right.

What I've been saying are things that change the state, I think I can ignore that.


Are we creating functions or streams of tokens? Or functions?


I think that we can have operations that change state. I just want to make sure that when state changes, then anything in our "predicate cache" is removed; that is; if there are certain predicates that we already know are true, then we have to remove that
cache if the state changes. Perhaps later, these predicates can be tied to a part of the expression tree, and the predicates would only be invalidated if there were state changes within their expression tree. If it's not in the expression tree, there's no way for it to be affected.

ANYWAY. I have no problem with the ability to change state. In the short term, changing state just invalidates the cache.

This cache allows us to optimize the compiled code. Since everything is basically a tree of conditions, if it sees a condition and bumps into it again farther down into the stack, then that you can bypass the conditional and just emit the true or false case.

I believe this is identical to using a predicate to determine if you're eligible for a particular action.

Okay. It's time to think again about what the hell we are building.

```


