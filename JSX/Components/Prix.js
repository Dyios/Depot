import NumberToCurrency from '../Helpers/NumberToCurrency.js'

function Prix({ id, className, value, tabindex, setter }) {
    const [internalValue, setInternalValue] = React.useState(value)// type String
    const [focused, setFocused] = React.useState(false)

    // update the state when the props.value change so it re-render
    React.useEffect(() => {
        if (value == 0) {
            setInternalValue('')
        }
        else if (!focused)
            id == 'quantite' ? setInternalValue(value) : setInternalValue(NumberToCurrency(value))
    }, [value])

    function equation_to_float(equation) {

        return typeof (equation) == 'string' &&
            equation.split('+').map(toSub =>
                toSub.split('-').map(toDiv =>
                    toDiv.split('/').map(toMult =>
                        toMult.split('*').reduce((previous, current) => current * previous)
                    ).reduce((previous, current) => parseFloat(previous) / parseFloat(current))
                ).reduce((previous, current) => parseFloat(previous) - parseFloat(current))
            ).reduce((previous, current) => parseFloat(current) + parseFloat(previous))
    }

    function show_equation_result() {
        const calculatedQuantite = equation_to_float(internalValue)
        if (calculatedQuantite) {
            setInternalValue(calculatedQuantite)
            setter(parseFloat(calculatedQuantite))
        }
    }

    function change(e) {
        setInternalValue(e.target.value)
        setter(parseFloat(e.target.value))
    }

    function handle_key_up(event) {
        if (event.keyCode === 13) {
            show_equation_result()
        }
    }

    return <input type="text" name="" id={id}
        className={className}
        value={internalValue}
        onInput={change}
        onKeyUp={handle_key_up}
        tabindex={tabindex}
        onFocus={() => setFocused(true)}
        onBlur={() => {
            setFocused(false)
            if (id != 'quantite')
                setInternalValue(prevInternalValue => prevInternalValue != 0 ? NumberToCurrency(prevInternalValue) : '')
            else {
                show_equation_result()
            }
        }}
    >
    </input>
}

export default Prix