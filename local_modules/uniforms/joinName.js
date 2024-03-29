"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinName;

// FIXME: ESLint seems to have problems with this code.

/* eslint-disable no-redeclare, no-unused-vars */
function joinName() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

  var name = parts.reduce(function (parts, part) {
    return part || part === 0 ? parts.concat(typeof part === 'string' ? part.split('.') : part) : parts;
  }, []);
  return parts[0] === null ? name.map(function (part) {
    return part.toString();
  }) : name.join('.');
}