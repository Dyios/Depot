var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import NormalDesignation from './NormalDesignation.js';

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var url = "mongodb://localhost:27017/Magasin";

function AutocompleteItem(_ref) {
    var article = _ref.article;


    return React.createElement(
        "div",
        {
            title: "( " + article.nbr_coli + " )",
            tabIndex: "-1",
            onClick: function onClick() {
                setValue(article.designation);
                setTitle(article.nbr_coli);
                setArticleInPanel(article);
            } },
        first,
        React.createElement(
            "strong",
            null,
            bold
        ),
        last
    );
}

function AutocompleteDesignation(_ref2) {
    var myRef = _ref2.myRef,
        id = _ref2.id,
        tabindex = _ref2.tabindex,
        autocomplete = _ref2.autocomplete,
        setArticleInPanel = _ref2.setArticleInPanel,
        beforeInput = _ref2.beforeInput;

    //const [title, setTitle] = React.useState('')
    var _React$useEffect = React.useEffect([]),
        _React$useEffect2 = _slicedToArray(_React$useEffect, 2),
        autocompleteItems = _React$useEffect2[0],
        setAutocompleteItems = _React$useEffect2[1];

    function handle_input(event) {
        var newValue = event.target.toUpperCase();
        setValue(newValue);

        if (newValue == "" || newValue.length < 3) {
            setAutocompleteItems([]);
            return;
        }

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("Magasin");
            var query = { designation: new RegExp(newValue) };
            dbo.collection("articles").find(query).sort({ designation: 1 }).toArray(function (err, result) {
                if (err) throw err;

                if (result.length === 1 && result[0].designation === newValue) {
                    setTitle(result[0].nbr_coli);
                    setArticleInPanel(result[0]);
                } else {
                    setAutocompleteItems(result.map(function (article) {
                        var x = article.designation.indexOf(val);
                        var first = article.designation.slice(0, x);
                        var bold = article.designation.slice(x, x + val.length);
                        var last = article.designation.slice(x + val.length);

                        return React.createElement(
                            "div",
                            {
                                title: "( " + article.nbr_coli + " )",
                                tabIndex: "-1",
                                onClick: function onClick() {
                                    setValue(article.designation);
                                    setTitle(article.nbr_coli);
                                    setArticleInPanel(article);
                                } },
                            first,
                            React.createElement(
                                "strong",
                                null,
                                bold
                            ),
                            last
                        );
                    }));
                }
            });
        });
    }

    function handleBlur(event, onBlur) {
        setTimeout(function () {
            return onBlur(event);
        }, 200);
    }

    // beforeInput : <label for="designation">Désignation</label>
    return React.createElement(
        "div",
        { "class": "champ autocomplete" },
        beforeInput,
        React.createElement(NormalDesignation, { myRef: myRef,
            id: id,
            tabindex: tabindex
        }),
        React.createElement(
            "div",
            { "class": "autocomplete-items" },
            autocompleteItems
        )
    );
}

var currentFocus = -1;
export function setCurrentFocus(value) {
    currentFocus = value;
}

function navigate_autocomplete(e) {

    var y = document.getElementsByClassName("autocomplete-items")[0];
    var x;
    if (y) x = y.getElementsByTagName("div");

    if (x.length == 0) return;

    if (currentFocus > x.length) currentFocus = -1;

    if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        if (currentFocus < x.length - 1) currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        if (x[currentFocus].offsetTop > y.scrollTop + 7 * x[currentFocus].offsetHeight) {
            y.scrollTop += x[currentFocus].offsetHeight;
            //y.scrollTop = x[currentFocus].offsetTop;
        }
    } else if (e.keyCode == 38) {
        //up
        e.preventDefault();
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        if (currentFocus > 0) currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        if (x[currentFocus].offsetTop < y.scrollTop) {
            y.scrollTop = x[currentFocus].offsetTop;
        }
    } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
    }
    //scroll to element:
    //y.scrollTop = 0;//set to top
    //y.scrollTop = x[currentFocus].offsetTop - y.offsetHeight + x[currentFocus].offsetHeight;//then set equal to the position of the selected element minus the height of scrolling div
}
function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    /*if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);*/
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

export default AutocompleteDesignation;