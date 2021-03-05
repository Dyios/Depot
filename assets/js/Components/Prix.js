var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import NumberToCurrency from '../Helpers/NumberToCurrency.js';

function Prix(_ref) {
    var id = _ref.id,
        className = _ref.className,
        value = _ref.value,
        tabindex = _ref.tabindex,
        setter = _ref.setter;

    var _React$useState = React.useState(value),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        internalValue = _React$useState2[0],
        setInternalValue = _React$useState2[1]; // type String


    var _React$useState3 = React.useState(false),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        focused = _React$useState4[0],
        setFocused = _React$useState4[1];

    // update the state when the props.value change so it re-render


    React.useEffect(function () {
        if (value == 0) {
            setInternalValue('');
        } else if (!focused) id == 'quantite' ? setInternalValue(value) : setInternalValue(NumberToCurrency(value));
    }, [value]);

    function equation_to_float(equation) {

        return typeof equation == 'string' && equation.split('+').map(function (toSub) {
            return toSub.split('-').map(function (toDiv) {
                return toDiv.split('/').map(function (toMult) {
                    return toMult.split('*').reduce(function (previous, current) {
                        return current * previous;
                    });
                }).reduce(function (previous, current) {
                    return parseFloat(previous) / parseFloat(current);
                });
            }).reduce(function (previous, current) {
                return parseFloat(previous) - parseFloat(current);
            });
        }).reduce(function (previous, current) {
            return parseFloat(current) + parseFloat(previous);
        });
    }

    function show_equation_result() {
        var calculatedQuantite = equation_to_float(internalValue);
        if (calculatedQuantite) {
            setInternalValue(calculatedQuantite);
            setter(parseFloat(calculatedQuantite));
        }
    }

    function change(e) {
        setInternalValue(e.target.value);
        setter(parseFloat(e.target.value));
    }

    function handle_key_up(event) {
        if (event.keyCode === 13) {
            show_equation_result();
        }
    }

    return React.createElement('input', { type: 'text', name: '', id: id,
        className: className,
        value: internalValue,
        onInput: change,
        onKeyUp: handle_key_up,
        tabindex: tabindex,
        onFocus: function onFocus() {
            return setFocused(true);
        },
        onBlur: function onBlur() {
            setFocused(false);
            if (id != 'quantite') setInternalValue(function (prevInternalValue) {
                return prevInternalValue != 0 ? NumberToCurrency(prevInternalValue) : '';
            });else {
                show_equation_result();
            }
        }
    });
}

export default Prix;