"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _invariant = _interopRequireDefault(require("invariant"));

var _Bridge2 = _interopRequireDefault(require("./Bridge"));

var _joinName = _interopRequireDefault(require("./joinName"));

var _filterDOMProps = _interopRequireDefault(require("./filterDOMProps"));

var SimpleSchema;

try {
  var r = require; // Silence Meteor missing module warning

  SimpleSchema = r('simpl-schema').default;
  SimpleSchema.extendOptions(['uniforms']); // There's no possibility to retrieve them at runtime

  _filterDOMProps.default.register('allowedValues', 'autoValue', 'blackbox', 'custom', 'decimal', 'defaultValue', 'exclusiveMax', 'exclusiveMin', 'label', 'max', 'maxCount', 'min', 'minCount', 'optional', 'regEx', 'trim', 'type');
} catch (_) {
  /* Ignore it. */
}

var SimpleSchema2Bridge =
/*#__PURE__*/
function (_Bridge) {
  (0, _inherits2.default)(SimpleSchema2Bridge, _Bridge);

  function SimpleSchema2Bridge(schema) {
    var _this;

    (0, _classCallCheck2.default)(this, SimpleSchema2Bridge);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SimpleSchema2Bridge).call(this));
    _this.schema = schema;
    return _this;
  }

  (0, _createClass2.default)(SimpleSchema2Bridge, [{
    key: "getError",
    value: function getError(name, error) {
      return error && error.details && error.details.find && error.details.find(function (error) {
        return error.name === name;
      }) || null;
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage(name, error) {
      var scopedError = this.getError(name, error);
      return !scopedError ? '' : this.schema.messageForError(scopedError);
    }
  }, {
    key: "getErrorMessages",
    value: function getErrorMessages(error) {
      var _this2 = this;

      if (error) {
        if (Array.isArray(error.details)) {
          return error.details.map(function (error) {
            return _this2.schema.messageForError(error);
          });
        }

        if (error.message) {
          return [error.message];
        }
      }

      if (error !== undefined) {
        return [error];
      }

      return [];
    }
  }, {
    key: "getField",
    value: function getField(name) {
      var definition = this.schema.getDefinition(name);
      (0, _invariant.default)(definition, 'Field not found in schema: "%s"', name);
      var merged = (0, _objectSpread2.default)({}, definition, definition.type[0]); // aldeed/node-simple-schema#27

      if (merged.autoValue && (merged.autoValue.name === 'defaultAutoValueFunction' || merged.autoValue.toString().indexOf('$setOnInsert:') !== -1) // FIXME: Hack.
      ) {
          try {
            merged.defaultValue = merged.autoValue.call({
              operator: null
            });
          } catch (_) {
            /* ignore it */
          }
        }

      return merged;
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue(name) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var field = this.getField(name);

      if (field.type === Array) {
        var item = this.getInitialValue((0, _joinName.default)(name, '0'));
        var items = Math.max(props.initialCount || 0, field.minCount || 0);
        return (0, _toConsumableArray2.default)(Array(items)).map(function () {
          return item;
        });
      }

      if (field.type === Object || SimpleSchema2Bridge.check(field.type)) {
        return {};
      }

      return field.defaultValue;
    } // eslint-disable-next-line complexity

  }, {
    key: "getProps",
    value: function getProps(name) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // Type should be omitted.
      // eslint-disable-next-line no-unused-vars, prefer-const
      var _this$getField = this.getField(name),
          optional = _this$getField.optional,
          type = _this$getField.type,
          uniforms = _this$getField.uniforms,
          field = (0, _objectWithoutProperties2.default)(_this$getField, ["optional", "type", "uniforms"]);

      field = (0, _objectSpread2.default)({}, field, {
        required: !optional
      });

      if (uniforms) {
        if (typeof uniforms === 'string' || typeof uniforms === 'function') {
          field = (0, _objectSpread2.default)({}, field, {
            component: uniforms
          });
        } else {
          field = (0, _objectSpread2.default)({}, field, uniforms);
        }
      }

      if (type === Array) {
        try {
          var itemProps = this.getProps("".concat(name, ".$"), props);

          if (itemProps.allowedValues && !props.allowedValues) {
            field.allowedValues = itemProps.allowedValues;
          }

          if (itemProps.transform && !props.transform) {
            field.transform = itemProps.transform;
          }
        } catch (_) {
          /* ignore it */
        }
      } else if (type === Number) {
        field = (0, _objectSpread2.default)({}, field, {
          decimal: true
        });
      }

      var options = props.options || field.options;

      if (options) {
        if (typeof options === 'function') {
          options = options();
        }

        if (!Array.isArray(options)) {
          field = (0, _objectSpread2.default)({}, field, {
            transform: function transform(value) {
              return options[value];
            },
            allowedValues: Object.keys(options)
          });
        } else {
          field = (0, _objectSpread2.default)({}, field, {
            transform: function transform(value) {
              return options.find(function (option) {
                return option.value === value;
              }).label;
            },
            allowedValues: options.map(function (option) {
              return option.value;
            })
          });
        }
      }

      return field;
    }
  }, {
    key: "getSubfields",
    value: function getSubfields(name) {
      return this.schema.objectKeys(SimpleSchema._makeGeneric(name));
    }
  }, {
    key: "getType",
    value: function getType(name) {
      var type = this.getField(name).type;

      if (type === SimpleSchema.Integer) {
        return Number;
      }

      if (SimpleSchema2Bridge.check(type)) {
        return Object;
      }

      return type;
    }
  }, {
    key: "getValidator",
    value: function getValidator() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clean: true,
        mutate: true
      };
      var validator = this.schema.validator(options); // Clean mutate its argument, even if mutate is false.

      if (options.clean) {
        return function (model) {
          return validator((0, _cloneDeep.default)((0, _objectSpread2.default)({}, model)));
        };
      }

      return validator;
    }
  }], [{
    key: "check",
    value: function check(schema) {
      return SimpleSchema && schema && schema.getDefinition && schema.messageBox && schema.objectKeys && schema.validator && schema.version === 2;
    }
  }]);
  return SimpleSchema2Bridge;
}(_Bridge2.default);

exports.default = SimpleSchema2Bridge;