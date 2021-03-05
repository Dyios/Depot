import NumberToCurrency from '../Helpers/NumberToCurrency.js'

function HOCTotal(WrappedComponent) {

    return (props) => {
        const [total, setTotal] = React.useState(valueToShow())

        function valueToShow() {
            return props.total != 0 ? NumberToCurrency(props.total) : ''
        }

        React.useEffect(() => {
            setTotal(valueToShow())
        }, [props.total])

        return <WrappedComponent total={total} />
    }
}


export default HOCTotal