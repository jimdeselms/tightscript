import { PRIMITIVES } from './primitives'

import { branch } from './composite'

export const ADD = branch(PRIMITIVES.is_number, [PRIMITIVES.add_number_number], [PRIMITIVES.add_string_string]);
export const NEGATE = [PRIMITIVES.negate_number];

