type TypeName = Capitalize<string>
type ActionName = Uncapitalize<string>

type Fn = (from: unknown) => unknown

type BifoqlType = {
    name: TypeName

    // Look up a typename; if there's a function, call it, and the result will be the new type.
    convertTo: Record<TypeName, Fn>

    // Look up an action. If there's a match, then call the function and the result will be in the given type.
    actions: Record<ActionName, [ Fn, TypeName ]>
}




type PathElement = TypeName | ActionName

function isTypeName(el: PathElement): el is TypeName { return el[0] === el[0].toUpperCase() }
function isActionName(el: PathElement): el is ActionName { return el[0] === el[0].toLowerCase() }

type Path = PathElement[]

// So, the path tells us the starting and ending types, and tells us the actions or paths that we want to pass along the way.



const types: Record<TypeName, BifoqlType> = {}

function* findPath(path: Path, currType: TypeName="Unknown"): Generator<Path> {
    if (path.length === 0) {
        return
    } else {
        const [next, ...rest] = path

        if (isTypeName(next)) {
            if (next === currType) {
                yield [next]
            }

            const type = types[next]

        }
    }
}
