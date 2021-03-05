import NumberToCurrency from '../Helpers/NumberToCurrency.js';

export default function TableItemListe(_ref) {
    var article = _ref.article;

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            article.nbr_coli
        ),
        React.createElement(
            'td',
            null,
            article.designation
        ),
        React.createElement(
            'td',
            null,
            NumberToCurrency(article.prix_achat)
        ),
        React.createElement(
            'td',
            null,
            NumberToCurrency(article.prix_gros)
        ),
        React.createElement(
            'td',
            null,
            NumberToCurrency(article.prix_detail)
        )
    );
}