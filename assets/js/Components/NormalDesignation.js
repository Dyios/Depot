var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { getArticles } from '../MongoDB/dataBaseHelpers.js';

function NormalDesignation(_ref) {
    var myRef = _ref.myRef,
        id = _ref.id,
        tabindex = _ref.tabindex,
        _onBlur = _ref.onBlur,
        setter = _ref.setter;

    var _React$useState = React.useState(''),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        value = _React$useState2[0],
        setValue = _React$useState2[1];

    function handle_input(event) {
        var newValue = event.target.value.toUpperCase();
        setValue(newValue);

        if (newValue == "" || newValue.length < 3) {
            return;
        }

        if (setter) {
            var query = { designation: new RegExp(newValue) };
            getArticles(query, setter);
        }
    }

    function handleBlur(event, onBlur) {
        setTimeout(function () {
            return onBlur(event);
        }, 200);
    }

    return React.createElement('input', { type: 'text',
        ref: myRef,
        id: id,
        title: 'nbr_coli',
        value: value,
        onInput: handle_input,
        tabindex: tabindex,
        onBlur: function onBlur(e) {
            if (_onBlur) handleBlur(e, _onBlur);
        },
        required: true });
}

export default NormalDesignation;