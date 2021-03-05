var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Magasin";

function to_price1(e) {
    if (!e.includes('.') && e !== '') return e + '.00';else if (e.includes('.') && e.slice(-2).includes('.')) return e + '0';else return e;
}
function to_price(e) {
    var price = void 0;
    if (!e.includes('.') && e !== '') price = e + '.00';else if (e.includes('.') && e.slice(-2).includes('.')) price = e + '0';else price = e;

    if (price.length > 6 && !price.includes(" ")) {
        var start = price.slice(0, price.length - 6);
        var end = price.slice(price.length - 6);
        var tmp = [];

        while (start.length > 3) {
            tmp.push(start.slice(start.length - 3));
            start = start.slice(0, start.length - 3);
        }
        tmp.push(start);
        tmp = tmp.reverse();

        var beautiful_price = "";
        for (var index = 0, c = tmp.length; index < c; index++) {
            beautiful_price += tmp[index] + " ";
        }
        beautiful_price += end + " ";

        return beautiful_price;
    }
    return price;
}

function Designation(props) {
    return React.createElement('input', { type: 'text', name: props.name,
        id: props.id,
        title: props.title,
        value: props.value,
        onInput: props.change,
        tabindex: props.tabindex,
        onKeyDown: navigate_autocomplete,
        onBlur: function onBlur(e) {
            if (props.onBlur) props.onBlur(e, false);
        },
        required: true });
}

function Prix(props) {

    function change(e) {
        props.setter(e.target.value);
    }

    return React.createElement('input', { type: 'text', name: '', id: props.id,
        value: props.value,
        onInput: change,
        tabindex: props.tabindex,
        onBlur: function onBlur() {
            if (props.id != 'quantite') props.setter(to_price(props.value));
        }
    });
}

var currentFocus = -1;
function navigate_autocomplete(e) {

    var y = document.getElementsByClassName("autocomplete-items")[0];
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