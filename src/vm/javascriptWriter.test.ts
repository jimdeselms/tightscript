import { toJavascript } from './javascriptWriter'

import { describe, it, expect } from 'vitest'

it('can compile a simple program', () => {
    const program = [2, 3, 'add']

    const js = toJavascript(program)

    const result = eval(js)

    expect(result).toEqual(5)
})