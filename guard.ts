function TypeMismatch() {
    return new Error("Type Mismatch")
}

function Number$(x: any): asserts x is Number {
    if (typeof x !== 'number') {
        throw TypeMismatch()
    }
}

type Assertion<TOut extends TIn=any, TIn=TOut> = (x: TIn) => asserts x is TOut

function guard(argumentAssertions: Assertion[], returnAssertion: Assertion, fn: (...args: any[]) => any) {
    return function(...args: any[]) {
        for (let i = 0; i < argumentAssertions.length; i++) {
            arguments[i](args[i])
        }

        const result = fn(...args)
        returnAssertion(result)
        
        return result
    }
}

// const add = guard([Number$, Number$], Number$, (a, b) => a + b)


type GuardType<Predicate>
    = Predicate extends (x: any) => x is infer T ? T : Predicate extends (x: any) => asserts x is infer T ? T : never

function IsNumber(x: any): x is number {
    return typeof x === 'number'
}

const x: GuardType<typeof IsNumber> = 123

type GuardType2<Assertion> = Assertion extends (x: any) => asserts x is infer T ? T : never



function prePostGuard<TArgs extends any[], TRet>(
    fn: (...args: TArgs) => TRet,
    pre: (args: TArgs) => asserts args is TArgs,
    post: (ret: TRet) => asserts ret is TRet
) {
    return (...args: TArgs): TRet =>{
        pre(args)
        const ret = fn(...args)
        post(ret)
        return ret
    }
}


const add = prePostGuard(
    (a: number, b: number) => a + b,
    ([a, b]) => a > 0 && b > 0,
    (ret) => ret > 0)

const result = add(2, 3)