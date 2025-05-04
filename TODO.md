# TODO

Here is what we want to build:


1) "optimize" - This is a function that will take an S-expression and optimize it. 




What are the stages? These are each stages of a pipeline. Each stage of the pipeline takes a stream of inputs and outputs a stream of outputs.



Character -> Token -> AST -> SExpression -> ... -> Symbol -> Function
                                                          -> Javascript
                                                          -> WebAssembly/Executable

                                                          


So, what we're most focused on is the part where we optimize the SExpression. So, for this part, we want to optimize an SExpression. 