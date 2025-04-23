import * as E from './expressions'

export function expandSafeOperator(primitive, args) {
    switch (primitive) {
        case 'add': return E.add(...args)
        
        case 'sub': return E.sub(...args)
        case 'sub_opp': return E.sub_opp(...args)

        case 'mul': return E.mul(...args)

        case 'div': return E.div(...args)
        case 'div_opp': return E.div_opp(...args)

        case 'gt': return E.gt(...args)
        case 'gt_opp': return E.gt_opp(...args)

        case 'ge': return E.ge(...args)
        case 'ge_opp': return E.ge_opp(...args)

        case 'lt': return E.lt(...args)
        case 'lt_opp': return E.lt_opp(...args)

        case 'le': return E.le(...args)
        case 'le_opp': return E.le_opp(...args)

        case 'eq': return E.eq(...args)

        case 'if': return E.ifte(...args)

        case 'negate': return E.negate(...args)

        default: throw "TBD - expandSafeOperaor"
    }
}