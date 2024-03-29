"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterDOMProps;

var _omit = _interopRequireDefault(require("lodash/omit"));

var unwantedProps = [// These props are provided by BaseField
'changed', 'changedMap', 'disabled', 'error', 'errorMessage', 'field', 'fieldType', 'fields', 'findError', 'findField', 'findValue', 'initialCount', 'label', 'name', 'onChange', 'parent', 'placeholder', 'showInlineError', 'submitting', 'transform', 'validating', 'value', // These are used by AutoField
'allowedValues', 'component', 'triggerField', 'options', 'calc', 'onChangeValue', 'onBlur', 'onMounted', 'onCallback', 'fixed', 'sortable', 'collapsable', 'frameset'];

function filterDOMProps(props) {
  return (0, _omit.default)(props, unwantedProps);
} // Bridges have to register additional props


filterDOMProps.register = function () {
  for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  props.forEach(function (prop) {
    if (unwantedProps.indexOf(prop) === -1) {
      unwantedProps.push(prop);
    }
  });
}; // It might be handy at some point


filterDOMProps.registered = unwantedProps;
