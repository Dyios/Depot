var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import PageHeader from '../Components/PageHeader.js';
import Designation, { setCurrentFocus } from '../Components/Designation.js';
import NormalDesignation from '../Components/NormalDesignation.js';
import Prix from '../Components/Prix.js';
import TotalInPanel from '../Components/TotalInPanel.js';
import TotalInBon from '../Components/TotalInBon.js';
import TableItemBon from '../Components/TableItemBon.js';
import MySortable from '../Components/Sortable.js';

import NumberToCurrency from '../Helpers/NumberToCurrency.js';
import { getArticles } from '../MongoDB/dataBaseHelpers.js';

var _require = require("react-sortablejs"),
    ReactSortable = _require.ReactSortable;

var _require2 = require("mongodb"),
    MongoClient = _require2.MongoClient;

var url = "mongodb://localhost:27017/Magasin";

function Main() {
    var _React$useState = React.useState(''),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        client = _React$useState2[0],
        setClient = _React$useState2[1];
    //const [adresse, setAdresse] = React.useState()

    var _React$useState3 = React.useState(''),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        value = _React$useState4[0],
        setValue = _React$useState4[1];

    var _React$useState5 = React.useState(0),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        nbr_coli = _React$useState6[0],
        setNbr_coli = _React$useState6[1];

    var _React$useState7 = React.useState(0),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        quantite = _React$useState8[0],
        setQuantite = _React$useState8[1];

    var _React$useState9 = React.useState(0),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        PU = _React$useState10[0],
        setPU = _React$useState10[1];

    var _React$useState11 = React.useState(0),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        montant = _React$useState12[0],
        setMontant = _React$useState12[1];

    var _React$useState13 = React.useState(0),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        total = _React$useState14[0],
        setTotal = _React$useState14[1];

    var _React$useState15 = React.useState([]),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        items = _React$useState16[0],
        setItems = _React$useState16[1]; //for autocomplete


    var _React$useState17 = React.useState([]),
        _React$useState18 = _slicedToArray(_React$useState17, 2),
        table_items = _React$useState18[0],
        setTable_items = _React$useState18[1]; // items in bon
    //const [can_add, setCan_add] = React.useState(false)

    var _React$useState19 = React.useState("gros"),
        _React$useState20 = _slicedToArray(_React$useState19, 2),
        typePrix = _React$useState20[0],
        setTypePrix = _React$useState20[1];

    var _React$useState21 = React.useState(false),
        _React$useState22 = _slicedToArray(_React$useState21, 2),
        type_prix_disabled = _React$useState22[0],
        setType_prix_disabled = _React$useState22[1];

    var _React$useState23 = React.useState(false),
        _React$useState24 = _slicedToArray(_React$useState23, 2),
        pdf_printed = _React$useState24[0],
        setPdf_printed = _React$useState24[1];
    //const [printed, setPrinted] = React.useState(false)

    var designationRef = React.useRef(null); // ref to focus the designation field
    var footerRef = React.useRef(null); // ref to manipulate the footer height

    var _React$useState25 = React.useState(false),
        _React$useState26 = _slicedToArray(_React$useState25, 2),
        draggingElement = _React$useState26[0],
        setDraggingElement = _React$useState26[1];

    // update Montant


    React.useEffect(function () {
        calc_Montant(quantite, PU, setMontant);
    }, [quantite, PU]);

    // extend the footer depending the autocomplete items
    React.useEffect(function () {
        items.length ? footer_up() : footer_down();
    }, [items.length]);

    var date = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
        /*hour:'numeric',
        minute: 'numeric',*/
    });
    //date = "Le " + date[0].toUpperCase() + date.slice(1)
    date = "Le " + date;

    function change_client(e) {
        var client = e.target.value.toUpperCase();
        setClient(client);
    }
    function change_adresse(e) {
        var adresse = e.target.value;
        setAdresse(adresse);
    }

    function change(e) {
        var val = e.target.value.toUpperCase();
        setValue(val);
        if (val == "") {
            setItems([]);
            return;
        }

        if (val.length < 3) return;

        var query = { designation: new RegExp(val) };
        getArticles(query, function (result) {
            if (result.length === 1 && result[0].designation === val) {
                setArticleInPanel(result[0]);
            } else {
                setItems(result.map(function (article) {
                    var x = article.designation.indexOf(val);
                    var first = article.designation.slice(0, x);
                    var bold = article.designation.slice(x, x + val.length);
                    var last = article.designation.slice(x + val.length);

                    return React.createElement(
                        'div',
                        {
                            title: '( ' + article.nbr_coli + ' )',
                            tabIndex: '-1',
                            onClick: function onClick() {
                                setArticleInPanel(article);
                            } },
                        first,
                        React.createElement(
                            'strong',
                            null,
                            bold
                        ),
                        last
                    );
                }));
            }
        });
    }

    function handle_typePrix_change(event) {
        setTypePrix(event.target.value);
    }

    function setArticleInPanel(article) {
        setValue(article.designation);
        setNbr_coli(article.nbr_coli);
        setQuantite(article.nbr_coli);
        switch (typePrix) {
            case "achat":
                setPU(article.prix_achat);
                break;
            case "gros":
                setPU(article.prix_gros);
                break;
            case "detail":
                setPU(article.prix_detail);
                break;
            default:
                setPU(article.PU);
                break;
        }

        setItems([]);
        setCurrentFocus(-1); //initialize autocomplete
    }

    function calc_Montant(quantite, PU, montantSetter) {
        var isQuantite = !isNaN(quantite) && quantite != '';
        var isPU = !isNaN(PU) && PU != '';

        isQuantite && isPU && montantSetter(quantite * PU);
    }

    function push_to_table() {
        var tmp_item = {
            nbr_coli: nbr_coli,
            value: value,
            quantite: quantite,
            PU: PU,
            montant: montant
        };

        setTable_items(function (prevTable_items) {
            return [].concat(_toConsumableArray(prevTable_items), [tmp_item]);
        });
        setTotal(function (prevTotal) {
            return prevTotal + montant;
        });

        setQuantite(0);
        setValue('');
        setPU(0);
        setMontant(0);

        setType_prix_disabled(true);
        setPdf_printed(false);
        //setPrinted(false);

        designationRef.current.focus();
    }

    function handle_change_quantite(id, quantite, PU) {
        setTable_items(function (prevTable_items) {
            return prevTable_items.map(function (item, index) {
                return index == id ? Object.assign({}, item, { quantite: quantite }) : item;
            });
        });
        calc_Montant(quantite, PU, function (montant) {
            return handle_change_montant(id, montant);
        });
    }

    function handle_change_montant(id, montant) {
        var prevMontant = table_items[id].montant;
        setTable_items(function (prevTable_items) {
            return prevTable_items.map(function (item, index) {
                return index == id ? Object.assign({}, item, { montant: montant }) : item;
            });
        });
        setTotal(function (prevTotal) {
            return prevTotal - prevMontant + montant;
        });
    }

    function remove_article_from_table(id, montantArticle) {
        setTable_items(function (prevTable_items) {
            var newTable_items = prevTable_items.filter(function (item, index) {
                return index != id;
            });
            newTable_items.length == 0 && setType_prix_disabled(false);
            return newTable_items;
        });
        setTotal(function (prevTotal) {
            return prevTotal - montantArticle;
        });
    }

    function handle_start_dragging(event) {
        setDraggingElement(true);
    }

    function handle_end_dragging(event) {
        setDraggingElement(false);
    }

    function footer_up() {
        footerRef.current.style.height = '15rem';
    }

    function footer_down() {
        footerRef.current.style.height = "7.5rem";
        setItems([]);
    }

    return React.createElement(
        'div',
        { 'class': 'main' },
        React.createElement(PageHeader, { title: 'Bon de Livraison' }),
        React.createElement(
            'div',
            { 'class': 'page' },
            React.createElement(
                'div',
                null,
                'Bon de livraison'
            ),
            React.createElement(
                'div',
                { 'class': 'general-info' },
                React.createElement(
                    'div',
                    { 'class': 'client-info' },
                    React.createElement(
                        'div',
                        null,
                        'Client:',
                        React.createElement(Designation, {
                            id: "client",
                            value: client,
                            change: change_client,
                            tabindex: '1',
                            autocomplete: false
                        })
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    date
                )
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
                            'D\xE9signation'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Quantit\xE9'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Prix Unit\xE9'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Montant'
                        )
                    )
                ),
                React.createElement(
                    ReactSortable,
                    { tag: 'tbody', list: table_items, setList: setTable_items,
                        animation: 150,
                        multiDrag: true // Enable multi-drag
                        , selectedClass: 'selected_to_drage' // The class applied to the selected items
                        , ghostClass: 'sortable_ghost',
                        onStart: handle_start_dragging,
                        onEnd: handle_end_dragging
                    },
                    table_items.map(function (item, index) {
                        return React.createElement(TableItemBon, { index: index,
                            item: item,
                            draggingElement: draggingElement,
                            handle_change_quantite: handle_change_quantite,
                            remove_article_from_table: remove_article_from_table,
                            setTotal: setTotal });
                    })
                )
            ),
            React.createElement(TotalInBon, { total: total })
        ),
        React.createElement(
            'footer',
            { ref: footerRef },
            React.createElement(
                'div',
                { 'class': 'panel' },
                React.createElement(
                    'div',
                    { 'class': 'champs' },
                    React.createElement(
                        'div',
                        { 'class': 'champ autocomplete' },
                        React.createElement(
                            'label',
                            { 'for': 'designation' },
                            'D\xE9signation'
                        ),
                        React.createElement(Designation, { myRef: designationRef,
                            title: nbr_coli,
                            id: 'designation',
                            value: value,
                            change: change,
                            tabindex: '1',
                            onBlur: function onBlur() {
                                return footer_down();
                            } }),
                        React.createElement(
                            'div',
                            { 'class': 'autocomplete-items' },
                            items
                        )
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'champ' },
                        React.createElement(
                            'label',
                            { 'for': 'quantite' },
                            'Quantit\xE9'
                        ),
                        React.createElement(Prix, { id: 'quantite', value: quantite, setter: setQuantite, tabindex: 1 })
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'champ' },
                        React.createElement(
                            'label',
                            { 'for': 'prixUnite' },
                            'Prix Unit\xE9'
                        ),
                        React.createElement(Prix, { value: PU, setter: setPU, tabindex: 1 })
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'champ' },
                        React.createElement(
                            'label',
                            { 'for': 'montant' },
                            'Montant'
                        ),
                        React.createElement(Prix, { value: montant, tabindex: -1 })
                    )
                ),
                React.createElement(
                    'div',
                    { 'class': 'btn' },
                    React.createElement(
                        'select',
                        { id: 'typePrix', value: typePrix,
                            onChange: handle_typePrix_change,
                            disabled: type_prix_disabled,
                            tabindex: '-1' },
                        React.createElement(
                            'option',
                            { value: 'achat' },
                            'Achat'
                        ),
                        React.createElement(
                            'option',
                            { value: 'gros' },
                            'Gros'
                        ),
                        React.createElement(
                            'option',
                            { value: 'detail' },
                            'Detail'
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement('input', { type: 'button', 'class': 'standard-btn', value: 'Enregistrer', onClick: function onClick() {
                                return printAsPDF(client, setPdf_printed);
                            }, tabindex: '3', disabled: pdf_printed }),
                        React.createElement('input', { type: 'button', 'class': 'standard-btn', value: 'Imprim\xE9', onClick: function onClick() {
                                return printer(client, pdf_printed, setPdf_printed);
                            }, tabindex: '2', disabled: false }),
                        React.createElement('input', { type: 'button', 'class': 'standard-btn', value: 'Ajouter', onClick: push_to_table, tabindex: '1' })
                    )
                )
            ),
            React.createElement(TotalInPanel, { total: total })
        )
    );
}

ReactDOM.render(React.createElement(Main, null), document.getElementsByTagName("body")[0]);

// PRINT MODULE

var _require3 = require("electron"),
    remote = _require3.remote;

function printer(client, pdf_printed, setPdf_printed) {
    //printAsPDF(client);

    //TO PRINT
    remote.getCurrentWebContents().print({
        silent: true,
        color: false,
        margins: {
            marginType: 'none'
        }
    }, function (success, failureReason) {
        if (!success) console.log(failureReason);else {
            console.log('Print Initiated');
            //setPrinted(true)

            if (!pdf_printed) printAsPDF(client, setPdf_printed);
        }
    });
}

function printAsPDF(client, setPdf_printed) {

    var path = require('path');
    var fs = require('fs');

    var date = new Date().toLocaleString().replace(/\sà\s/, '_').replace(/:/g, '-');

    var fileName = "../Bons/" + (client + "_" + date + ".pdf").replace(/[\s \/]/g, "-");

    var pdfPath = path.join(__dirname, fileName);
    var options = {
        marginsType: 1,
        printBackground: false,
        printSelectionOnly: false,
        landscape: false,
        pageSize: 'A4',
        scaleFactor: 100
    };
    // TO PDF
    remote.getCurrentWebContents().printToPDF(options).then(function (data) {
        fs.writeFile(pdfPath, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
                setPdf_printed(true);

                remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                    type: 'info',
                    title: 'Information',
                    message: 'Le bon a bien été enregistrer.'
                });
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}

//----------------------- USELESS --------

function PU_champ(props) {
    return React.createElement('input', { type: 'text', name: '', id: 'prixUnite',
        value: props.value,
        tabindex: props.tabindex,
        onInput: function onInput(e) {
            props.setPU(e.target.value);props.calc_Montant(props.qtt, e.target.value);
        },
        onBlur: function onBlur() {
            if (props.value != '' && NumberToCurrency(props.value) != undefined) props.setPU(NumberToCurrency(props.value));
        }
    });
}

function Quantite(props) {
    return React.createElement('input', { type: 'text', name: '', id: 'quantite',
        value: props.value,
        tabindex: props.tabindex,
        onInput: function onInput(e) {
            props.setQuantite(e.target.value);props.calc_Montant(e.target.value, props.pu);
        }
    });
}

function Montant_champ(props) {
    return React.createElement('input', { type: 'text', id: 'montant', readonly: 'true', value: NumberToCurrency(props.value), tabindex: props.tabindex });
}