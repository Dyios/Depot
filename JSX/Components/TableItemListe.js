import NumberToCurrency from '../Helpers/NumberToCurrency.js'

export default function TableItemListe({ article }) {
    return (
        <tr>
            <td>{article.nbr_coli}</td>
            <td>{article.designation}</td>
            <td>{NumberToCurrency(article.prix_achat)}</td>
            <td>{NumberToCurrency(article.prix_gros)}</td>
            <td>{NumberToCurrency(article.prix_detail)}</td>
        </tr>
    )
}