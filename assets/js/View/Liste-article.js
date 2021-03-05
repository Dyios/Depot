var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import PageHeader from '../Components/PageHeader.js';
import Designation from '../Components/Designation.js';
import TableItemListe from '../Components/TableItemListe.js';
import NormalDesignation from '../Components/NormalDesignation.js';
import { getArticles } from '../MongoDB/dataBaseHelpers.js';

function Main() {
    var _React$useState = React.useState(''),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        value = _React$useState2[0],
        setValue = _React$useState2[1];

    var _React$useState3 = React.useState(),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        liste = _React$useState4[0],
        setListe = _React$useState4[1];

    function change(e) {
        // passing it to Designation
        var val = e.target.value.toUpperCase();
        setValue(val);

        // get the correspending articles from the DB
        var query = { designation: new RegExp(val) };
        getArticles(query, setListe);
    }

    function getAll() {
        var query = {};
        getArticles(query, setListe);
    }

    // get the articles onMount
    React.useEffect(getAll, []);

    return React.createElement(
        'div',
        { 'class': 'main' },
        React.createElement(PageHeader, { title: 'Liste des Articles', hasBackButton: true }),
        React.createElement(
            'div',
            { 'class': 'page' },
            React.createElement(
                'div',
                { id: 'designation-div' },
                'Rechercher :',
                React.createElement(Designation, { value: value, change: change, autocomplete: false })
            ),
            React.createElement(
                'table',
                null,
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'Nbr./Coli.'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'D\xE9signation'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Prix Achat'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Prix Gros'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Prix D\xE9tail'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    liste && liste.map(function (article) {
                        return React.createElement(TableItemListe, { article: article });
                    })
                )
            )
        )
    );
}

ReactDOM.render(React.createElement(Main, null), document.getElementsByTagName("body")[0]);