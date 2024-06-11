import { isObject } from './Utils.js';

export default {
  isEqual(arg1, arg2) {
    return arg1 === arg2;
  },
  isEq(arg1, arg2) {
    return arg1 === arg2;
  },
  isGt(arg1, arg2) {
    return arg1 > arg2;
  },
  isLt(arg1, arg2) {
    return arg1 < arg2;
  },
  typeof: (val) => typeof val,
  contains: (arg1, arg2) => {
    if (!arg1 || !arg2) return false;
    if (isObject(arg1) || isObject(arg2)) return false;
    return arg1.includes(arg2);
  },
  // Source: https://www.cloudhadoop.com/handlebarjs-if-helper/
  isAnd(cond1, cond2, options) {
    return cond1 && cond2 ? options.fn(this) : options.inverse(this);
  },
  isOr(cond1, cond2, options) {
    return cond1 || cond2 ? options.fn(this) : options.inverse(this);
  },
  ifEq(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
};
