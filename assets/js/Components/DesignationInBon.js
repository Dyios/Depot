//import  from '../../css/Components/DesignationInBon.css'

function DesignationInBon(_ref) {
    var value = _ref.value,
        nbr_coli = _ref.nbr_coli,
        index = _ref.index,
        montant = _ref.montant,
        remove_article_from_table = _ref.remove_article_from_table;


    return React.createElement(
        'td',
        { title: nbr_coli, className: 'DesignationInBon_container' },
        value,
        React.createElement(
            'div',
            { className: 'buttons_container' },
            React.createElement('input', { type: 'button', className: 'button',
                value: 'X',
                onClick: function onClick() {
                    return remove_article_from_table(index, montant);
                }
            })
        )
    );
}

export default DesignationInBon;