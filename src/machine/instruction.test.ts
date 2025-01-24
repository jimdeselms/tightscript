import { compileWasm, I32, LOCAL_GET_0, MUL_I32 } from './instruction'
import { describe, it, expect } from 'vitest'

it('can create functions', () => {
    const bytecodes = [
        ...LOCAL_GET_0,
        ...I32(2),
        ...MUL_I32,
      ]

    const fns = compileWasm(bytecodes)

    const result= (fns as any).double(10)

    expect(result).toBe(20)
})


const TIMES = 10000000
const SIZE =  1_000_000_000
const SMALL = 10

it.skip('is a cache test', () => {

    const array = new Int32Array(SIZE)

    function fn1() {
        let r 
        let total = 0

        for (let i = 0; i < TIMES; i++) {
            r = Math.trunc(Math.random() * SMALL)
            total += array[r]
        }
    }

    function fn2() {
        let r 
        let total = 0

        for (let i = 0; i < TIMES; i++) {
            r = Math.trunc(Math.random() * SIZE)
            total += array[r]
        }
    }

    const start1 =  performance.now()
    fn1()
    const perf1 = performance.now() - start1

    const start2 =  performance.now()
    fn2()
    const perf2 = performance.now() - start2

    console.log(perf1, perf2)
})