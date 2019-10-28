'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('next/node_modules/babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('next/node_modules/babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('next/node_modules/babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('next/node_modules/babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('next/node_modules/babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('next/node_modules/babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('next/node_modules/babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('next/node_modules/babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _style = require('styled-jsx/style.js');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _openColor = require('open-color');

var _openColor2 = _interopRequireDefault(_openColor);

var _styleUtils = require('../../helpers/style-utils');

var _reactJsonschemaForm = require('react-jsonschema-form');

var _reactJsonschemaForm2 = _interopRequireDefault(_reactJsonschemaForm);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _Spinner = require('./Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Confirm = require('./Confirm');

var _Confirm2 = _interopRequireDefault(_Confirm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/home/internetlab/git/nextepc/webui/src/components/Shared/Form.js';

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n    width: calc(100vw - 2rem);\n  '], ['\n    width: calc(100vw - 2rem);\n  ']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n    height: calc(100vh - 16rem);\n  '], ['\n    height: calc(100vh - 16rem);\n  ']);

var Wrapper = _styledComponents2.default.div.withConfig({
  componentId: 'tjbj79-0'
})(['display:flex;flex-direction:column;postion:relative;width:', ';', ' background:white;box-shadow:0 10px 20px rgba(0,0,0,0.19),0 6px 6px rgba(0,0,0,0.23);'], function (p) {
  return p.width || '1050px';
}, _styleUtils.media.mobile(_templateObject));

var Header = _styledComponents2.default.div.withConfig({
  componentId: 'tjbj79-1'
})(['display:flex;justify-content:flex-start;padding:1rem;font-size:1.5rem;background:', ';'], _openColor2.default.gray[1]);

var Body = _styledComponents2.default.div.withConfig({
  componentId: 'tjbj79-2'
})(['padding:2rem;font-size:14px;height:', ';', ' overflow:scroll;'], function (p) {
  return p.height || '500px';
}, _styleUtils.media.mobile(_templateObject2));

var Footer = _styledComponents2.default.div.withConfig({
  componentId: 'tjbj79-3'
})(['display:flex;justify-content:flex-end;padding:1rem;']);

/* We can UI design with styled-componented. Later! */
var REQUIRED_FIELD_SYMBOL = "*";

var CustomTitleField = function CustomTitleField(props) {
  var id = props.id,
      title = props.title,
      required = props.required;

  var legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return _react2.default.createElement('legend', { id: id, __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    }
  }, legend);
};

var fields = {
  TitleField: CustomTitleField
};

function Label(props) {
  var label = props.label,
      required = props.required,
      id = props.id;

  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return _react2.default.createElement('div', {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75
      }
    });
  }
  return _react2.default.createElement('label', { className: 'control-label', htmlFor: id, __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    }
  }, required ? label + REQUIRED_FIELD_SYMBOL : label);
}

var CustomFieldTemplate = function CustomFieldTemplate(props) {
  var id = props.id,
      classNames = props.classNames,
      label = props.label,
      children = props.children,
      errors = props.errors,
      help = props.help,
      description = props.description,
      hidden = props.hidden,
      required = props.required,
      displayLabel = props.displayLabel;

  if (hidden) {
    return children;
  }

  return _react2.default.createElement('div', { className: classNames, __source: {
      fileName: _jsxFileName,
      lineNumber: 103
    }
  }, displayLabel && _react2.default.createElement(Label, { label: label, required: required, id: id, __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    }
  }), displayLabel && description ? description : null, children, errors, help);
};

var transformErrors = function transformErrors(errors) {
  return errors.map(function (error) {
    // use error messages from JSON schema if any
    if (error.schema.messages && error.schema.messages[error.name]) {
      return (0, _extends3.default)({}, error, {
        message: error.schema.messages[error.name]
      });
    }
    return error;
  });
};

var Form = function (_Component) {
  (0, _inherits3.default)(Form, _Component);

  function Form() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Form);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Form.__proto__ || (0, _getPrototypeOf2.default)(Form)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.handleChange = function (data) {
      var onChange = _this.props.onChange;

      var formDataChanged = null;
      if (onChange) {
        formDataChanged = onChange(data.formData);
      }
      _this.setState({
        editing: true,
        disableSubmitButton: (0, _keys2.default)(data.errors).length > 0,
        formData: formDataChanged ? formDataChanged : data.formData
      });
    }, _this.handleSubmit = function (data) {
      var onSubmit = _this.props.onSubmit;

      onSubmit(data.formData);
    }, _this.handleSubmitButton = function () {
      _this.setState({
        disabled: true,
        disableSubmitButton: true
      });
      _this.submitButton.click();
    }, _this.handleOutside = function () {
      var onHide = _this.props.onHide;

      if (_this.state.editing === true) {
        _this.setState({ confirm: true });
      } else {
        onHide();
      }
    }, _this.handleClose = function () {
      var onHide = _this.props.onHide;

      _this.setState({ confirm: false });
      onHide();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Form, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.visible === false && nextProps.visible === true) {
        // Initialize State Variable when form view is visible for the first time
        this.setState({
          formData: nextProps.formData,
          disabled: false,
          editing: false,
          confirm: false,
          disableSubmitButton: true
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var handleChange = this.handleChange,
          handleSubmit = this.handleSubmit,
          handleSubmitButton = this.handleSubmitButton,
          handleOutside = this.handleOutside,
          handleClose = this.handleClose;
      var _props = this.props,
          visible = _props.visible,
          title = _props.title,
          schema = _props.schema,
          uiSchema = _props.uiSchema,
          isLoading = _props.isLoading,
          validate = _props.validate,
          onSubmit = _props.onSubmit,
          onError = _props.onError;
      var _state = this.state,
          disabled = _state.disabled,
          disableSubmitButton = _state.disableSubmitButton,
          formData = _state.formData;

      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 240
        }
      }, _react2.default.createElement(_Modal2.default, {
        visible: visible,
        onOutside: handleOutside,
        disableOnClickOutside: this.state.confirm, __source: {
          fileName: _jsxFileName,
          lineNumber: 241
        }
      }, _react2.default.createElement(Wrapper, { id: 'nprogress-base-form', width: this.props.width, __source: {
          fileName: _jsxFileName,
          lineNumber: 245
        }
      }, _react2.default.createElement(Header, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 246
        }
      }, title), _react2.default.createElement(Body, { height: this.props.height, __source: {
          fileName: _jsxFileName,
          lineNumber: 249
        }
      }, isLoading && _react2.default.createElement(_Spinner2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 250
        }
      }), !isLoading && _react2.default.createElement(_reactJsonschemaForm2.default, {
        schema: schema,
        uiSchema: disabled ? (0, _extends3.default)({
          "ui:disabled": true
        }, uiSchema) : (0, _extends3.default)({}, uiSchema),
        formData: formData,
        disableSubmitButton: disableSubmitButton,
        fields: fields,
        FieldTemplate: CustomFieldTemplate,
        liveValidate: true,
        validate: validate,
        showErrorList: false,
        transformErrors: transformErrors,
        autocomplete: 'off',
        onChange: handleChange,
        onSubmit: handleSubmit,
        onError: onError, __source: {
          fileName: _jsxFileName,
          lineNumber: 252
        }
      }, _react2.default.createElement('div', {
        'data-jsx': 301980644,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 274
        }
      }, _react2.default.createElement('button', { type: 'submit', ref: function ref(el) {
          return _this2.submitButton = el;
        }, 'data-jsx': 301980644,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 275
        }
      }), _react2.default.createElement(_style2.default, {
        styleId: 301980644,
        css: 'button[data-jsx="301980644"]{display:none}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL1NoYXJlZC9Gb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1SZ0MsQUFHc0MsYUFDZiIsImZpbGUiOiJzcmMvY29tcG9uZW50cy9TaGFyZWQvRm9ybS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9pbnRlcm5ldGxhYi9naXQvbmV4dGVwYy93ZWJ1aSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG9jIGZyb20gJ29wZW4tY29sb3InO1xuaW1wb3J0IHsgbWVkaWEgfSBmcm9tICdoZWxwZXJzL3N0eWxlLXV0aWxzJztcblxuaW1wb3J0IEpzb25TY2hlbWFGb3JtIGZyb20gJ3JlYWN0LWpzb25zY2hlbWEtZm9ybSc7XG5cbmltcG9ydCBNb2RhbCBmcm9tICcuL01vZGFsJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9CdXR0b24nO1xuaW1wb3J0IFNwaW5uZXIgZnJvbSAnLi9TcGlubmVyJztcbmltcG9ydCBDb25maXJtIGZyb20gJy4vQ29uZmlybSc7XG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwb3N0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6ICR7cCA9PiBwLndpZHRoIHx8IGAxMDUwcHhgfTtcblxuICAke21lZGlhLm1vYmlsZWBcbiAgICB3aWR0aDogY2FsYygxMDB2dyAtIDJyZW0pO1xuICBgfVxuXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBib3gtc2hhZG93OiAwIDEwcHggMjBweCByZ2JhKDAsMCwwLDAuMTkpLCAwIDZweCA2cHggcmdiYSgwLDAsMCwwLjIzKTtcbmBcblxuY29uc3QgSGVhZGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXG4gIHBhZGRpbmc6IDFyZW07XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBiYWNrZ3JvdW5kOiAke29jLmdyYXlbMV19O1xuYFxuXG5jb25zdCBCb2R5ID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMnJlbTtcbiAgZm9udC1zaXplOiAxNHB4O1xuXG4gIGhlaWdodDogJHtwID0+IHAuaGVpZ2h0IHx8IGA1MDBweGB9O1xuICAke21lZGlhLm1vYmlsZWBcbiAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSAxNnJlbSk7XG4gIGB9XG5cbiAgb3ZlcmZsb3c6IHNjcm9sbDtcbmBcblxuY29uc3QgRm9vdGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcblxuICBwYWRkaW5nOiAxcmVtO1xuYFxuXG4vKiBXZSBjYW4gVUkgZGVzaWduIHdpdGggc3R5bGVkLWNvbXBvbmVudGVkLiBMYXRlciEgKi9cbmNvbnN0IFJFUVVJUkVEX0ZJRUxEX1NZTUJPTCA9IFwiKlwiO1xuXG5jb25zdCBDdXN0b21UaXRsZUZpZWxkID0gcHJvcHMgPT4ge1xuICBjb25zdCB7IGlkLCB0aXRsZSwgcmVxdWlyZWQgfSA9IHByb3BzO1xuICBjb25zdCBsZWdlbmQgPSByZXF1aXJlZCA/IHRpdGxlICsgUkVRVUlSRURfRklFTERfU1lNQk9MIDogdGl0bGU7XG4gIHJldHVybiA8bGVnZW5kIGlkPXtpZH0+e2xlZ2VuZH08L2xlZ2VuZD47XG5cbn07XG5cbmNvbnN0IGZpZWxkcyA9IHtcbiAgVGl0bGVGaWVsZDogQ3VzdG9tVGl0bGVGaWVsZCxcbn07XG5cbmZ1bmN0aW9uIExhYmVsKHByb3BzKSB7XG4gIGNvbnN0IHsgbGFiZWwsIHJlcXVpcmVkLCBpZCB9ID0gcHJvcHM7XG4gIGlmICghbGFiZWwpIHtcbiAgICAvLyBTZWUgIzMxMjogRW5zdXJlIGNvbXBhdGliaWxpdHkgd2l0aCBvbGQgdmVyc2lvbnMgb2YgUmVhY3QuXG4gICAgcmV0dXJuIDxkaXYgLz47XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiIGh0bWxGb3I9e2lkfT5cbiAgICAgIHtyZXF1aXJlZCA/IGxhYmVsICsgUkVRVUlSRURfRklFTERfU1lNQk9MIDogbGFiZWx9XG4gICAgPC9sYWJlbD5cbiAgKTtcbn1cblxuY29uc3QgQ3VzdG9tRmllbGRUZW1wbGF0ZSA9IHByb3BzID0+IHtcbiAgY29uc3Qge1xuICAgIGlkLFxuICAgIGNsYXNzTmFtZXMsXG4gICAgbGFiZWwsXG4gICAgY2hpbGRyZW4sXG4gICAgZXJyb3JzLFxuICAgIGhlbHAsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgaGlkZGVuLFxuICAgIHJlcXVpcmVkLFxuICAgIGRpc3BsYXlMYWJlbCxcbiAgfSA9IHByb3BzO1xuXG4gIGlmIChoaWRkZW4pIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzfT5cbiAgICAgIHtkaXNwbGF5TGFiZWwgJiYgPExhYmVsIGxhYmVsPXtsYWJlbH0gcmVxdWlyZWQ9e3JlcXVpcmVkfSBpZD17aWR9IC8+fVxuICAgICAge2Rpc3BsYXlMYWJlbCAmJiBkZXNjcmlwdGlvbiA/IGRlc2NyaXB0aW9uIDogbnVsbH1cbiAgICAgIHtjaGlsZHJlbn1cbiAgICAgIHtlcnJvcnN9XG4gICAgICB7aGVscH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuY29uc3QgdHJhbnNmb3JtRXJyb3JzID0gZXJyb3JzID0+IHtcbiAgcmV0dXJuIGVycm9ycy5tYXAoZXJyb3IgPT4ge1xuICAgIC8vIHVzZSBlcnJvciBtZXNzYWdlcyBmcm9tIEpTT04gc2NoZW1hIGlmIGFueVxuICAgIGlmIChlcnJvci5zY2hlbWEubWVzc2FnZXMgJiYgZXJyb3Iuc2NoZW1hLm1lc3NhZ2VzW2Vycm9yLm5hbWVdKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5lcnJvcixcbiAgICAgICAgbWVzc2FnZTogZXJyb3Iuc2NoZW1hLm1lc3NhZ2VzW2Vycm9yLm5hbWVdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZXJyb3I7XG4gIH0pO1xufTtcblxuY2xhc3MgRm9ybSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2NoZW1hOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHVpU2NoZW1hOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGZvcm1EYXRhOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgdmFsZGF0ZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25IaWRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblN1Ym1pdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25FcnJvcjogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHZpc2libGU6IGZhbHNlLFxuICAgIHRpdGxlOiBcIlwiXG4gIH07XG5cbiAgc3RhdGUgPSB7fTtcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLnZpc2libGUgPT09IGZhbHNlICYmIG5leHRQcm9wcy52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICAvLyBJbml0aWFsaXplIFN0YXRlIFZhcmlhYmxlIHdoZW4gZm9ybSB2aWV3IGlzIHZpc2libGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICB0aGlzLnNldFN0YXRlKHsgXG4gICAgICAgIGZvcm1EYXRhOiBuZXh0UHJvcHMuZm9ybURhdGEsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgZWRpdGluZzogZmFsc2UsXG4gICAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgICAgICBkaXNhYmxlU3VibWl0QnV0dG9uOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNoYW5nZSA9IGRhdGEgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIG9uQ2hhbmdlXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgZm9ybURhdGFDaGFuZ2VkID0gbnVsbDsgIFxuICAgIGlmIChvbkNoYW5nZSkge1xuICAgICAgIGZvcm1EYXRhQ2hhbmdlZCA9IG9uQ2hhbmdlKGRhdGEuZm9ybURhdGEpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVkaXRpbmc6IHRydWUsXG4gICAgICBkaXNhYmxlU3VibWl0QnV0dG9uOiAoT2JqZWN0LmtleXMoZGF0YS5lcnJvcnMpLmxlbmd0aCA+IDApLFxuICAgICAgZm9ybURhdGE6IGZvcm1EYXRhQ2hhbmdlZCA/IGZvcm1EYXRhQ2hhbmdlZCA6IGRhdGEuZm9ybURhdGFcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlU3VibWl0ID0gZGF0YSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgb25TdWJtaXRcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIG9uU3VibWl0KGRhdGEuZm9ybURhdGEpO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0QnV0dG9uID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICBkaXNhYmxlU3VibWl0QnV0dG9uOiB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5jbGljaygpO1xuICB9XG5cbiAgaGFuZGxlT3V0c2lkZSA9ICgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBvbkhpZGVcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmcgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb25maXJtOiB0cnVlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG9uSGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNsb3NlID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIG9uSGlkZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNvbmZpcm06IGZhbHNlIH0pXG4gICAgb25IaWRlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaGFuZGxlQ2hhbmdlLFxuICAgICAgaGFuZGxlU3VibWl0LFxuICAgICAgaGFuZGxlU3VibWl0QnV0dG9uLFxuICAgICAgaGFuZGxlT3V0c2lkZSxcbiAgICAgIGhhbmRsZUNsb3NlXG4gICAgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7XG4gICAgICB2aXNpYmxlLFxuICAgICAgdGl0bGUsXG4gICAgICBzY2hlbWEsXG4gICAgICB1aVNjaGVtYSxcbiAgICAgIGlzTG9hZGluZyxcbiAgICAgIHZhbGlkYXRlLFxuICAgICAgb25TdWJtaXQsXG4gICAgICBvbkVycm9yXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7XG4gICAgICBkaXNhYmxlZCxcbiAgICAgIGRpc2FibGVTdWJtaXRCdXR0b24sXG4gICAgICBmb3JtRGF0YVxuICAgIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxNb2RhbCBcbiAgICAgICAgICB2aXNpYmxlPXt2aXNpYmxlfSBcbiAgICAgICAgICBvbk91dHNpZGU9e2hhbmRsZU91dHNpZGV9XG4gICAgICAgICAgZGlzYWJsZU9uQ2xpY2tPdXRzaWRlPXt0aGlzLnN0YXRlLmNvbmZpcm19PlxuICAgICAgICAgIDxXcmFwcGVyIGlkPSducHJvZ3Jlc3MtYmFzZS1mb3JtJyB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0+XG4gICAgICAgICAgICA8SGVhZGVyPlxuICAgICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICA8L0hlYWRlcj5cbiAgICAgICAgICAgIDxCb2R5IGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9PlxuICAgICAgICAgICAgICB7aXNMb2FkaW5nICYmIDxTcGlubmVyLz59XG4gICAgICAgICAgICAgIHshaXNMb2FkaW5nICYmIFxuICAgICAgICAgICAgICAgIDxKc29uU2NoZW1hRm9ybVxuICAgICAgICAgICAgICAgICAgc2NoZW1hPXtzY2hlbWF9XG4gICAgICAgICAgICAgICAgICB1aVNjaGVtYT17XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkID8ge1xuICAgICAgICAgICAgICAgICAgICAgIFwidWk6ZGlzYWJsZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAuLi51aVNjaGVtYVxuICAgICAgICAgICAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgICAgICAgICAgIC4uLnVpU2NoZW1hXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGZvcm1EYXRhPXtmb3JtRGF0YX1cbiAgICAgICAgICAgICAgICAgIGRpc2FibGVTdWJtaXRCdXR0b249e2Rpc2FibGVTdWJtaXRCdXR0b259XG4gICAgICAgICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgICAgICAgIEZpZWxkVGVtcGxhdGU9e0N1c3RvbUZpZWxkVGVtcGxhdGV9XG4gICAgICAgICAgICAgICAgICBsaXZlVmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgIHZhbGlkYXRlPXt2YWxpZGF0ZX1cbiAgICAgICAgICAgICAgICAgIHNob3dFcnJvckxpc3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtRXJyb3JzPXt0cmFuc2Zvcm1FcnJvcnN9XG4gICAgICAgICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9XG4gICAgICAgICAgICAgICAgICBvbkVycm9yPXtvbkVycm9yfT5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIHJlZj17KGVsID0+IHRoaXMuc3VibWl0QnV0dG9uID0gZWwpfS8+XG4gICAgICAgICAgICAgICAgICAgIDxzdHlsZSBqc3g+e2BcbiAgICAgICAgICAgICAgICAgICAgICBidXR0b24ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvSnNvblNjaGVtYUZvcm0+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvQm9keT5cbiAgICAgICAgICAgIDxGb290ZXI+XG4gICAgICAgICAgICAgIDxCdXR0b24gY2xlYXIgZGlzYWJsZWQ9e2Rpc2FibGVkfSBvbkNsaWNrPXtoYW5kbGVDbG9zZX0+XG4gICAgICAgICAgICAgICAgQ0FOQ0VMXG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8QnV0dG9uIGNsZWFyIGRpc2FibGVkPXtkaXNhYmxlZCB8fCBkaXNhYmxlU3VibWl0QnV0dG9ufSBvbkNsaWNrPXtoYW5kbGVTdWJtaXRCdXR0b259PlxuICAgICAgICAgICAgICAgIFNBVkVcbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L0Zvb3Rlcj5cbiAgICAgICAgICA8L1dyYXBwZXI+ICBcbiAgICAgICAgPC9Nb2RhbD5cbiAgICAgICAgPENvbmZpcm0gXG4gICAgICAgICAgdmlzaWJsZT17dGhpcy5zdGF0ZS5jb25maXJtfSBcbiAgICAgICAgICBtZXNzYWdlPVwiWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2xvc2U/XCJcbiAgICAgICAgICBidXR0b25zPXtbXG4gICAgICAgICAgICB7IHRleHQ6IFwiQ0xPU0VcIiwgYWN0aW9uOiBoYW5kbGVDbG9zZSwgaW5mbzp0cnVlIH0sXG4gICAgICAgICAgICB7IHRleHQ6IFwiTk9cIiwgYWN0aW9uOiAoKSA9PiB0aGlzLnNldFN0YXRlKHsgY29uZmlybTogZmFsc2UgfSl9XG4gICAgICAgICAgXX0vPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm07Il19 */\n/*@ sourceURL=src/components/Shared/Form.js */'
      })))), _react2.default.createElement(Footer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 285
        }
      }, _react2.default.createElement(_Button2.default, { clear: true, disabled: disabled, onClick: handleClose, __source: {
          fileName: _jsxFileName,
          lineNumber: 286
        }
      }, 'CANCEL'), _react2.default.createElement(_Button2.default, { clear: true, disabled: disabled || disableSubmitButton, onClick: handleSubmitButton, __source: {
          fileName: _jsxFileName,
          lineNumber: 289
        }
      }, 'SAVE')))), _react2.default.createElement(_Confirm2.default, {
        visible: this.state.confirm,
        message: 'You have unsaved changes. Are you sure you want to close?',
        buttons: [{ text: "CLOSE", action: handleClose, info: true }, { text: "NO", action: function action() {
            return _this2.setState({ confirm: false });
          } }], __source: {
          fileName: _jsxFileName,
          lineNumber: 295
        }
      }));
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  visible: _propTypes2.default.bool,
  title: _propTypes2.default.string,
  schema: _propTypes2.default.object,
  uiSchema: _propTypes2.default.object,
  formData: _propTypes2.default.object,
  isLoading: _propTypes2.default.bool,
  valdate: _propTypes2.default.func,
  onHide: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onError: _propTypes2.default.func
};
Form.defaultProps = {
  visible: false,
  title: ""
};

exports.default = Form;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL1NoYXJlZC9Gb3JtLmpzIl0sIm5hbWVzIjpbIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInN0eWxlZCIsIm9jIiwibWVkaWEiLCJKc29uU2NoZW1hRm9ybSIsIk1vZGFsIiwiQnV0dG9uIiwiU3Bpbm5lciIsIkNvbmZpcm0iLCJXcmFwcGVyIiwiZGl2IiwicCIsIndpZHRoIiwibW9iaWxlIiwiSGVhZGVyIiwiZ3JheSIsIkJvZHkiLCJoZWlnaHQiLCJGb290ZXIiLCJSRVFVSVJFRF9GSUVMRF9TWU1CT0wiLCJDdXN0b21UaXRsZUZpZWxkIiwiaWQiLCJwcm9wcyIsInRpdGxlIiwicmVxdWlyZWQiLCJsZWdlbmQiLCJmaWVsZHMiLCJUaXRsZUZpZWxkIiwiTGFiZWwiLCJsYWJlbCIsIkN1c3RvbUZpZWxkVGVtcGxhdGUiLCJjbGFzc05hbWVzIiwiY2hpbGRyZW4iLCJlcnJvcnMiLCJoZWxwIiwiZGVzY3JpcHRpb24iLCJoaWRkZW4iLCJkaXNwbGF5TGFiZWwiLCJ0cmFuc2Zvcm1FcnJvcnMiLCJtYXAiLCJlcnJvciIsInNjaGVtYSIsIm1lc3NhZ2VzIiwibmFtZSIsIm1lc3NhZ2UiLCJGb3JtIiwic3RhdGUiLCJoYW5kbGVDaGFuZ2UiLCJvbkNoYW5nZSIsImZvcm1EYXRhQ2hhbmdlZCIsImRhdGEiLCJmb3JtRGF0YSIsInNldFN0YXRlIiwiZWRpdGluZyIsImRpc2FibGVTdWJtaXRCdXR0b24iLCJsZW5ndGgiLCJoYW5kbGVTdWJtaXQiLCJvblN1Ym1pdCIsImhhbmRsZVN1Ym1pdEJ1dHRvbiIsImRpc2FibGVkIiwic3VibWl0QnV0dG9uIiwiY2xpY2siLCJoYW5kbGVPdXRzaWRlIiwib25IaWRlIiwiY29uZmlybSIsImhhbmRsZUNsb3NlIiwibmV4dFByb3BzIiwidmlzaWJsZSIsInVpU2NoZW1hIiwiaXNMb2FkaW5nIiwidmFsaWRhdGUiLCJvbkVycm9yIiwiZWwiLCJ0ZXh0IiwiYWN0aW9uIiwiaW5mbyIsInByb3BUeXBlcyIs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