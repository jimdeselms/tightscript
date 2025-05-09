import { parseJavascript } from '../parseJavascript.js';

export function createParseHandlers() {
    return {
        parse: (str) => {
            const statements = parseJavascript(str)

            return [ 'block', ...statements ]
        }
    }
}