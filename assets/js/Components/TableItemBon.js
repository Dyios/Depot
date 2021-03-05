import NumberToCurrency from '../Helpers/NumberToCurrency.js';
import DesignationInBon from './DesignationInBon.js';
import Prix from './Prix.js';

function TableItemBon(_ref) {
    var index = _ref.index,
        item = _ref.item,
        draggingElement = _ref.draggingElement,
        handle_change_quantite = _ref.handle_change_quantite,
        remove_article_from_table = _ref.remove_article_from_table;


    var myRef = React.useRef(null);
    var id = item.id,
        nbr_coli = item.nbr_coli,
        value = item.value,
        quantite = item.quantite,
        PU = item.PU,
        montant = item.montant;

    //show the new line when out of the page

    React.useEffect(function () {
        myRef.current != null && myRef.current.scrollIntoView({
            behavior: 'smooth', block: 'start', inline: 'center'
        });
    }, []);

    function setQuantite(quantite) {
        handle_change_quantite(index, quantite, PU);
    }

    function handle_mouse_enter(event) {
        var element = myRef.current;
        !draggingElement && element.classList.add("hover_effect");
    }

    function handle_mouse_leave(event) {
        var element = myRef.current;
        element.classList.remove("hover_effect");
    }

    return React.createElement(
        'tr',
        { id: index, ref: myRef,
            onMouseEnter: handle_mouse_enter,
            onMouseLeave: handle_mouse_leave
        },
        React.createElement(DesignationInBon, { value: value,
            nbr_coli: nbr_coli,
            index: index,
            montant: montant,
            remove_article_from_table: remove_article_from_table
        }),
        React.createElement(
            'td',
            null,
            React.createElement(Prix, { id: 'quantite', className: 'table_quantite', value: quantite, setter: setQuantite })
        ),
        React.createElement(
            'td',
            null,
            NumberToCurrency(PU)
        ),
        React.createElement(
            'td',
            null,
            NumberToCurrency(montant)
        )
    );
}

export default TableItemBon;