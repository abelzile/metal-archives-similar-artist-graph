'use strict';

export function NumberExt() {}

NumberExt.toInteger = function(value) {
  if (value === 0 || value === Infinity || value === -Infinity) return value;
  return ~~value;
};
