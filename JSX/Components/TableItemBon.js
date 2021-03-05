import NumberToCurrency from '../Helpers/NumberToCurrency.js'
import DesignationInBon from './DesignationInBon.js'
import Prix from './Prix.js'

function TableItemBon({ index, item, draggingElement, handle_change_quantite, remove_article_from_table }) {

    const myRef = React.useRef(null)
    const { id, nbr_coli, value, quantite, PU, montant } = item

    //show the new line when out of the page
    React.useEffect(() => {
        myRef.current != null && myRef.current.scrollIntoView({
            behavior: 'smooth', block: 'start', inline: 'center'
        })
    }, [])

    function setQuantite(quantite) {
        handle_change_quantite(index, quantite, PU)
    }

    function handle_mouse_enter(event) {
        const element = myRef.current
        !draggingElement && element.classList.add("hover_effect")
    }

    function handle_mouse_leave(event) {
        const element = myRef.current
        element.classList.remove("hover_effect")
    }

    return (
        <tr id={index} ref={myRef}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
        >
            <DesignationInBon value={value}
                nbr_coli={nbr_coli}
                index={index}
                montant={montant}
                remove_article_from_table={remove_article_from_table}
            />
            {/*<td title={nbr_coli} >{value}</td>*/}
            {/*<td>{quantite}</td>*/}
            <td>
                <Prix id='quantite' className='table_quantite' value={quantite} setter={setQuantite} />
            </td>
            {/*<td>{nbr_coli}</td>*/}
            <td>{NumberToCurrency(PU)}</td>
            <td>{NumberToCurrency(montant)}</td>
        </tr>
    )
}

export default TableItemBon