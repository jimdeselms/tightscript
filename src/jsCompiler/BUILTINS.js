import { parse } from '../parse'

export const BUILTINS = {
    error: parse('(error $)'),
    isError: parse('(isError $)'),
    isUndefined: parse('(isUndefined $)'),
}