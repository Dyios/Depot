function Designation({ myRef, name, id, title, value, change, tabindex, onBlur, autocomplete = true }) {
    
    function handleBlur(event, onBlur){
        setTimeout(() => onBlur(event), 200)
    }

    return (
        <input type="text" name={name}
            ref={myRef}
            id={id}
            title={title}
            value={value}
            onInput={change}
            tabindex={tabindex}
            onKeyDown={autocomplete && navigate_autocomplete}
            onBlur={(e) => {
                if (onBlur )
                    handleBlur(e, onBlur )
                currentFocus = -1
            }}
            required />
    )
}

let currentFocus = -1;
export function setCurrentFocus(value) { currentFocus = value }

function navigate_autocomplete(e) {

    const y = document.getElementsByClassName("autocomplete-items")[0];
    const x;
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

        x[currentFocus].scrollIntoView({
            block: 'end', inline: 'center'
        })

    } else if (e.keyCode == 38) { //up
        e.preventDefault()
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        if (currentFocus > 0) currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);

        x[currentFocus].scrollIntoViewIfNeeded({
            block: 'start', inline: 'center'
        })
        
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
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

}


export default Designation