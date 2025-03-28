export const PRIMITIVES = {
    add_number_number(stack) {
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a + b);
    },

    add_string_string(stack) {
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a + b);
    },

    negate_number(stack) {
        const value = stack.pop();
        stack.push(-value);
    },

    is_number(stack) {
        const value = stack.pop();
        stack.push(typeof value === 'number');
    },

    dup(stack) {
        const value = stack[stack.length-1]
        stack.push(value);
    }
}