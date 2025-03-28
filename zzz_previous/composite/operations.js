import { branch } from './composite'

export const ADD = branch("is_number", ["add_number_number"], ["add_string_string"]);
export const NEGATE = ["negate_number"];
    