import { SExpression, Token } from './index.js'
import { lexer } from './lexer.js'
import { parser } from './parser.js'
import { serializer } from './serializer.js'

import { chainPipelines } from './pipelines.js'

/** 
 * A compiler is a machine that takes a stream of tokens and turns it a "program" that has these capabilities.
 * 
 * A program is a function that takes an initial state and a callback function for the output stream, and it returns a "send" function to write to the input stream.
 * 
 * This is basically an extension of the base concept of a "function" (give it input, return output.) A program is a higher dimension from that kind of function.
 * 
 * Rather than a function that is a one-to-one mapping between an input and an output, I want a function to be a mapping
 * between a stream of inputs and a stream of outputs. The "one-to-one" mapping is just a subset of the many-to-many mapping.
 * 
 * It's not *quite* "many-to-many". This kind of function still has a one-to-one mapping between a SEQUENCE of inputs to a SEQUENCE of outputs.
 * 
 * Sometimes I'll send an input and get nothing back. Sometimes I'll get a thousand back.
 * 
 * Technically... as we support the concept of state change, the output stream could represent callback functions that are called for every state change.
 * 
 * Anyway, point is, this kind of function supports a lot more use cases than just the one-to-one function.
 * 
 * SOOO... A compiler is a machine that a stream of input tokens and turns it into a "program".
 * 
 * That means, you give it the stream of tokens that represent the text of the program, and it returns a "program" that is basically a fancy function.
 * 
 * Let's start with that and see where it leads.
 * 
 * First, there is a lexer which reads in strings and converts them into symbols
 * 
 * And there is a parser which reads in symbols and and converts them into S-expressions
 * 
 * And then, we'll need a thing that takes S-expressions and converts them into a stream of symbols that can be applied to a stack.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compiler = chainPipelines<string, Token, any>(lexer, parser, serializer)
