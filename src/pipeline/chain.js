export function chain(...steps) {
    return (input) => {
        let curr = input

        for (const step of steps) {
            curr = step(curr)
        }

        return curr
    }
}