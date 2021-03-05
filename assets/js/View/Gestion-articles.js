var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import PageHeader from '../Components/PageHeader.js';
import Designation, { setCurrentFocus } from '../Components/Designation.js';
import NumberToCurrency from '../Helpers/NumberToCurrency.js';
import Prix from '../Components/Prix.js';

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var url = "mongodb://localhost:27017/Magasin";

function Main() {
    var _React$useState = React.useState(),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        value = _React$useState2[0],
        setValue = _React$useState2[1];

    var _React$useState3 = React.useState(),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        nbr_coli = _React$useState4[0],
        setNbr_coli = _React$useState4[1];

    var _React$useState5 = React.useState(),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        prix_achat = _React$useState6[0],
        setPrix_achat = _React$useState6[1];

    var _React$useState7 = React.useState(),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        prix_gros = _React$useState8[0],
        setPrix_gros = _React$useState8[1];

    var _React$useState9 = React.useState(),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        prix_detail = _React$useState10[0],
        setPrix_detail = _React$useState10[1];

    var _React$useState11 = React.useState(),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        items = _React$useState12[0],
        setItems = _React$useState12[1]; //for autocomplete

    var _React$useState13 = React.useState(true),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        modifier_disabled = _React$useState14[0],
        setModifier_disabled = _React$useState14[1]; //for autocomplete

    var designation_changeRef = React.useRef(null);

    function change(e) {
        var val = e.target.value.toUpperCase();

        if (val[val.length - 1] == "(" || val[val.length - 1] == ")") return;

        setValue(val);
        setModifier_disabled(true);
        if (val == "") {
            setItems([]);
            return;
        }

        if (val.length < 3) return;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("Magasin");
            var query = { designation: new RegExp(val) };
            dbo.collection("articles").find(query).sort({ designation: 1 }).toArray(function (err, result) {
                if (err) throw err;

                if (result.length === 1 && result[0].designation === val) {
                    setArticleIn(result[0]);
                } else {
                    var tmp_items = [];

                    var _loop = function _loop(i, c) {
                        // bold the suggestions
                        var x = result[i].designation.indexOf(val);
                        var first = result[i].designation.slice(0, x);
                        var bold = result[i].designation.slice(x, x + val.length);
                        var last = result[i].designation.slice(x + val.length);

                        tmp_items.push(React.createElement(
                            'div',
                            {
                                onClick: function onClick() {
                                    return setArticleIn(result[i]);
                                } },
                            first,
                            React.createElement(
                                'strong',
                                null,
                                bold
                            ),
                            last
                        ));
                    };

                    for (var i = 0, c = result.length; i < c; i++) {
                        _loop(i, c);
                    }
                    setItems(tmp_items);
                }
            });
            db.close();
        });
    }

    function setArticleIn(article) {
        setValue(article.designation);
        setNbr_coli(article.nbr_coli);
        setPrix_achat(article.prix_achat);
        setPrix_gros(article.prix_gros);
        setPrix_detail(article.prix_detail);
        setItems([]);

        setCurrentFocus(-1); //initialize autocomplete
        setModifier_disabled(false);
    }

    function Ajouter() {
        function add(e) {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("Magasin");

                var prix_achat_tmp = prix_achat.replace(/\s/g, '');
                var prix_gros_tmp = prix_gros.replace(/\s/g, '');
                var prix_detail_tmp = prix_detail.replace(/\s/g, '');
                dbo.collection("articles").updateOne({ designation: value }, {
                    $set: {
                        designation: value,
                        nbr_coli: parseInt(nbr_coli),
                        prix_achat: parseFloat(prix_achat_tmp),
                        prix_gros: parseFloat(prix_gros_tmp),
                        prix_detail: parseFloat(prix_detail_tmp)
                    }
                }, { upsert: true }, function (err, result) {
                    if (err) throw err;
                    var msg = result.result.nModified ? "mis à jour" : "ajouter";
                    alert('Article ' + msg + ' :\n                        \n            ' + value + '   |   (' + nbr_coli + ')   |   ' + prix_achat + '   |   ' + prix_gros + '   |   ' + prix_detail);
                });
                /*alert(` Article mis à jour :
                    - encient
                        (${result[0].nbr_coli})  ${result[0].designation}  ${result[0].prix_achat}  ${result[0].prix_gros}  ${result[0].prix_detail}
                    - nouveau
                        (${nbr_coli})  ${value}  ${prix_achat}  ${prix_gros}  ${prix_detail}`)*/

                /*alert(` Article ajouter :
                (${nbr_coli})  ${value}  ${prix_achat}  ${prix_gros}  ${prix_detail}`)*/
                db.close();
            });
        }

        return React.createElement('input', { type: 'submit', 'class': 'standard-btn', value: 'Ajouter', onClick: add });
    }

    function change_designation() {
        setTimeout(function () {
            designation_changeRef.current.style.visibility = "visible";
            designation_changeRef.current.style.width = "100%";
            designation_changeRef.current.style.height = "100%";
        }, 100); // wait to blur designation

        setTimeout(function () {
            designation_changeRef.current.focus();
        }, 1000); // wait end of animation
    }

    function Change_designation(_ref) {
        var myRef = _ref.myRef;

        var _React$useState15 = React.useState(value),
            _React$useState16 = _slicedToArray(_React$useState15, 2),
            change_value = _React$useState16[0],
            setChange_value = _React$useState16[1];

        function change(e) {
            var val = e.target.value.toUpperCase();
            setChange_value(val);
        }

        function hideInput(e) {
            myRef.current.style.visibility = "hidden";
            myRef.current.style.width = "0%";
            myRef.current.style.height = "0%";

            if (value === change_value) return;

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("Magasin");

                dbo.collection("articles").updateOne({ designation: value }, { $set: { designation: change_value } });
            });

            var _require$remote = require("electron").remote,
                dialog = _require$remote.dialog,
                getCurrentWindow = _require$remote.getCurrentWindow;

            var msg1 = 'Ancienne designation :     ' + value + '\n';
            var msg2 = '\nNouvelle  designation :     ' + change_value;
            dialog.showMessageBox(getCurrentWindow(), {
                type: "none",
                title: "Designation mise à jour",
                message: msg1 + msg2
            });

            setValue(change_value);
        }

        return React.createElement('input', { ref: myRef, id: 'designation_change', value: change_value, onChange: change, onBlur: hideInput });
    }

    return React.createElement(
        'div',
        { 'class': 'main' },
        React.createElement(PageHeader, { title: 'Ajouter / Modifier Article', hasBackButton: true }),
        React.createElement(
            'div',
            { 'class': 'page' },
            React.createElement(
                'form',
                null,
                React.createElement(
                    'div',
                    { 'class': 'info' },
                    React.createElement(
                        'label',
                        { 'for': 'designation' },
                        'D\xE9signation'
                    ),
                    ':',
                    React.createElement(
                        'div',
                        { 'class': 'autocomplete' },
                        React.createElement(Designation, {
                            id: "designation",
                            value: value,
                            change: change,
                            onBlur: function onBlur() {
                                setItems([]);
                            }
                        }),
                        React.createElement(Change_designation, { myRef: designation_changeRef }),
                        React.createElement(
                            'div',
                            { 'class': 'autocomplete-items' },
                            items
                        )
                    ),
                    React.createElement('input', { type: 'button', id: 'modifier-btn', 'class': 'standard-btn', value: 'Modifier', onClick: function onClick() {
                            return change_designation();
                        }, tabindex: '-1', disabled: modifier_disabled })
                ),
                React.createElement(
                    'div',
                    { 'class': 'info' },
                    React.createElement(
                        'label',
                        { 'for': 'quantite' },
                        'Nbr / Coli.'
                    ),
                    ':',
                    React.createElement(Prix, { id: 'quantite', value: nbr_coli, setter: setNbr_coli })
                ),
                React.createElement(
                    'div',
                    { 'class': 'prix' },
                    React.createElement(
                        'div',
                        { 'class': 'typePrix' },
                        React.createElement(
                            'label',
                            { 'for': 'prixAchat' },
                            'Prix Achat'
                        ),
                        React.createElement(Prix, { id: 'prixAchat', value: prix_achat, setter: setPrix_achat })
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'typePrix' },
                        React.createElement(
                            'label',
                            { 'for': 'prixGros' },
                            'Prix Gros'
                        ),
                        React.createElement(Prix, { id: 'prixGros', value: prix_gros, setter: setPrix_gros })
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'typePrix' },
                        React.createElement(
                            'label',
                            { 'for': 'prixDetail' },
                            'Prix D\xE9tail'
                        ),
                        React.createElement(Prix, { id: 'prixDetail', value: prix_detail, setter: setPrix_detail })
                    )
                ),
                React.createElement(
                    'div',
                    { 'class': 'form-btn' },
                    React.createElement(Ajouter, null)
                )
            )
        )
    );
}

ReactDOM.render(React.createElement(Main, null), document.getElementsByTagName("body")[0]);