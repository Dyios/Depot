import NormalDesignation from './NormalDesignation.js'

const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017/Magasin";

function AutocompleteItem({ article }) {

    const x = article.designation.indexOf(value);
    const first = article.designation.slice(0, x);
    const bold = article.designation.slice(x, x + value.length);
    const last = article.designation.slice(x + value.length);

    return (
        <div
            title={`( ${article.nbr_coli} )`}
            tabIndex="-1"
            onClick={() => {
                setValue(article.designation)
                setTitle(article.nbr_coli)
                setArticleInPanel(article)
            }
            }>
            {first}<strong>{bold}</strong>{last}
        </div>
    )
}

function AutocompleteDesignation({ myRef, id, tabindex, autocomplete, setArticleInPanel, beforeInput }) {

    const [value, setValue] = React.useState('')
    //const [title, setTitle] = React.useState('')
    const [autocompleteItems, setAutocompleteItems] = React.useEffect([])

    function handle_input(event) {
        const newValue = event.target.toUpperCase()
        setValue(newValue);

        if (newValue == "" || newValue.length < 3) {
            setAutocompleteItems([])
            return
        }

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("Magasin");
            var query = { designation: new RegExp(newValue) }
            dbo.collection("articles").find(query).sort({ designation: 1 }).toArray(function (err, result) {
                if (err) throw err

                if (result.length === 1 && result[0].designation === newValue) {
                    setTitle(result[0].nbr_coli)
                    setArticleInPanel(result[0])
                } else {
                    setAutocompleteItems(result.map(article => {
                        const x = article.designation.indexOf(val);
                        const first = article.designation.slice(0, x);
                        const bold = article.designation.slice(x, x + val.length);
                        const last = article.designation.slice(x + val.length);

                        return (
                            <div
                                title={`( ${article.nbr_coli} )`}
                                tabIndex="-1"
                                onClick={() => {
                                    setValue(article.designation)
                                    setTitle(article.nbr_coli)
                                    setArticleInPanel(article)
                                }
                                }>
                                {first}<strong>{bold}</strong>{last}
                            </div>
                        )
                    }))
                }
            })
        });
    }

    function set_autocomplete_items(result) {
        setAutocompleteItems(result.map(article => {

            return <AutocompleteItem article />
        }
    }

    function handleBlur(event, onBlur) {
                setTimeout(() => onBlur(event), 200)
            }

    // beforeInput : <label for="designation">Désignation</label>
    return (
            <div class="champ autocomplete">
                {beforeInput}
                {/*<input type="text"
                ref={myRef}
                id={id}
                title={nbr_coli}
                value={value}
                onInput={handle_input}
                tabindex={tabindex}
                onKeyDown={autocomplete && navigate_autocomplete}
                onBlur={(e) => {
                    if (onBlur)
                        handleBlur(e, onBlur)
                }}
                required />*/}
                <NormalDesignation myRef={myRef}
                    id={id}
                    value={value}
                    tabindex={tabindex}
                    setter={result => {
                        setAutocompleteItems(result.)
                    }}
                />
                <div class="autocomplete-items">
                    {autocompleteItems}
                </div>
            </div>
        )
    }

    let currentFocus = -1;
    export function setCurrentFocus(value) { currentFocus = value }

    function navigate_autocomplete(e) {

        var y = document.getElementsByClassName("autocomplete-items")[0];
        var x;
        if (y) x = y.getElementsByTagName("div");

        if (x.length == 0) return

        if (currentFocus > x.length) currentFocus = -1;

        if (e.keyCode == 40) {
            e.preventDefault()
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            if (currentFocus < x.length - 1) currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
            if (x[currentFocus].offsetTop > y.scrollTop + 7 * x[currentFocus].offsetHeight) {
                y.scrollTop += x[currentFocus].offsetHeight;
                //y.scrollTop = x[currentFocus].offsetTop;
            }

        } else if (e.keyCode == 38) { //up
            e.preventDefault()
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

    export default AutocompleteDesignation