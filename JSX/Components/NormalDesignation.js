import { getArticles } from '../MongoDB/dataBaseHelpers.js'

function NormalDesignation({ myRef, id, tabindex, onBlur, setter }) {

    const [value, setValue] = React.useState('')

    function handle_input(event) {
        const newValue = event.target.value.toUpperCase()
        setValue(newValue);

        if (newValue == "" || newValue.length < 3) {
            return
        }

        if (setter) {
            const query = { designation: new RegExp(newValue) }
            getArticles(query, setter)
        }

    }

    function handleBlur(event, onBlur) {
        setTimeout(() => onBlur(event), 200)
    }

    return (
        <input type="text"
            ref={myRef}
            id={id}
            title={'nbr_coli'}
            value={value}
            onInput={handle_input}
            tabindex={tabindex}
            onBlur={(e) => {
                if (onBlur)
                    handleBlur(e, onBlur)
            }}
            required />
    )
}

export default NormalDesignation