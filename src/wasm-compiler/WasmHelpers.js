export const MAGIC_NUMBER = [0x00, 0x61, 0x73, 0x6d]
export const VERSION = [0x01, 0x00, 0x00, 0x00]

export function buildWasm(functions, exports) {
    return [
        ...MAGIC_NUMBER,
        ...VERSION,
        ...generateTypeSection(functions),
        ...generateFunctionSection(functions.map(f => f.typeIndex)),
        ...generateExportSection(exports),
        ...generateCodeSection(functions),
    ]
}

export function generateTypeSection(typeDefs) {
    const sectionSize = 1
    const bytecodes = [0x01, sectionSize, typeDefs.length]

    for (const typeDef of typeDefs) {
        const { type } = typeDef

        if (type === 'function') {
            const { paramTypes, resultTypes } = typeDef

            bytecodes.push(0x60, paramTypes.length, ...paramTypes.map(type => TYPES[type]), resultTypes.length, ...resultTypes.map(type => TYPES[type]))
        }
    }

    // Set the size
    bytecodes[1] = bytecodes.length - 2

    return bytecodes
}

export function generateFunctionSection(typeIndexes) {
    const section = [0x03, 0, typeIndexes.length, ...typeIndexes]
    section[1] = section.length - 2
    return section
}

export function generateExportSection(exports) {
    const sectionSize = 1
    const bytecodes = [0x07, sectionSize, exports.length]

    for (const ex of exports) {
        const { name, type, index } = ex

        bytecodes.push(name.length, ...name.split('').map(c => c.charCodeAt(0)), type, index)
    }

    // Set the size
    bytecodes[1] = bytecodes.length - 2

    return bytecodes
}

export function generateCodeSection(functionBodies) {
    const bytecodes = [0x0a, 0, functionBodies.length]

    for (const fn of functionBodies) {
        const { locals, body } = fn

        const fbody = [0x00, locals.length, ...locals, ...body, 0x0b]
        fbody[0] = fbody.length - 1
        bytecodes.push(...fbody)
    }

    // Set the size
    bytecodes[1] = bytecodes.length - 2

    return bytecodes
}

const TYPES = {
    i32: 0x7f,
    i64: 0x7e,
    f32: 0x7d,
    f64: 0x7c,
    v128: 0x7b,
    funcref: 0x70,
    externref: 0x6f,
}