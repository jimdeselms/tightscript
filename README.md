# Tightscript

This is a Javascript compiler that makes a few changes to the behavior of Javascript:

1) undefined means "I don't know what the value is", so it propagates inn any expression that references it
2) No async/await, no Promises. You never have to wait for a result.
3) x == undefined is undefined. x === undefined is true or false.

It also does lazy evaluation; 