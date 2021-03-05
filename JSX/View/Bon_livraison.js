import PageHeader from '../Components/PageHeader.js'
import Designation, { setCurrentFocus } from '../Components/Designation.js'
import NormalDesignation from '../Components/NormalDesignation.js'
import Prix from '../Components/Prix.js'
import TotalInPanel from '../Components/TotalInPanel.js'
import TotalInBon from '../Components/TotalInBon.js'
import TableItemBon from '../Components/TableItemBon.js'
import MySortable from '../Components/Sortable.js'

import NumberToCurrency from '../Helpers/NumberToCurrency.js'
import {getArticles} from '../MongoDB/dataBaseHelpers.js'

const { ReactSortable } = require("react-sortablejs");

const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017/Magasin";

function Main() {
    const [client, setClient] = React.useState('')
    //const [adresse, setAdresse] = React.useState()

    const [value, setValue] = React.useState('')
    const [nbr_coli, setNbr_coli] = React.useState(0)
    const [quantite, setQuantite] = React.useState(0)
    const [PU, setPU] = React.useState(0)

    const [montant, setMontant] = React.useState(0)
    const [total, setTotal] = React.useState(0)

    const [items, setItems] = React.useState([])//for autocomplete
    const [table_items, setTable_items] = React.useState([])// items in bon
    //const [can_add, setCan_add] = React.useState(false)

    const [typePrix, setTypePrix] = React.useState("gros")
    const [type_prix_disabled, setType_prix_disabled] = React.useState(false);

    const [pdf_printed, setPdf_printed] = React.useState(false);
    //const [printed, setPrinted] = React.useState(false)

    const designationRef = React.useRef(null)// ref to focus the designation field
    const footerRef = React.useRef(null)// ref to manipulate the footer height

    const [draggingElement, setDraggingElement] = React.useState(false)

    // update Montant
    React.useEffect(() => {
        calc_Montant(quantite, PU, setMontant)
    }, [quantite, PU])

    // extend the footer depending the autocomplete items
    React.useEffect(() => {
        items.length ? footer_up() : footer_down()
    }, [items.length])

    let date = new Date().toLocaleDateString(undefined,
        {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            /*hour:'numeric',
            minute: 'numeric',*/
        })
    //date = "Le " + date[0].toUpperCase() + date.slice(1)
    date = "Le " + date

    function change_client(e) {
        const client = e.target.value.toUpperCase();
        setClient(client);
    }
    function change_adresse(e) {
        const adresse = e.target.value;
        setAdresse(adresse);
    }

    function change(e) {
        const val = e.target.value.toUpperCase()
        setValue(val)
        if (val == "") {
            setItems([])
            return
        }

        if (val.length < 3) return;

        const query = { designation: new RegExp(val) }
        getArticles(query,(result)=>{
            if (result.length === 1 && result[0].designation === val) {
                setArticleInPanel(result[0])
            } else {
                setItems(result.map(article => {
                    const x = article.designation.indexOf(val);
                    const first = article.designation.slice(0, x);
                    const bold = article.designation.slice(x, x + val.length);
                    const last = article.designation.slice(x + val.length);

                    return (
                        <div
                            title={`( ${article.nbr_coli} )`}
                            tabIndex="-1"
                            onClick={() => { setArticleInPanel(article) }
                            }>
                            {first}<strong>{bold}</strong>{last}
                        </div>
                    )
                }))
            }
        })
    }

    function handle_typePrix_change(event) {
        setTypePrix(event.target.value)
    }

    function setArticleInPanel(article) {
        setValue(article.designation)
        setNbr_coli(article.nbr_coli)
        setQuantite(article.nbr_coli)
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
                setPU(article.PU)
                break;
        }

        setItems([])
        setCurrentFocus(-1) //initialize autocomplete
    }

    function calc_Montant(quantite, PU, montantSetter) {
        const isQuantite = !isNaN(quantite) && quantite != ''
        const isPU = !isNaN(PU) && PU != ''

        isQuantite && isPU && montantSetter(quantite * PU)
    }

    function push_to_table() {
        const tmp_item = {
            nbr_coli,
            value,
            quantite,
            PU,
            montant
        }

        setTable_items(prevTable_items => [...prevTable_items, tmp_item])
        setTotal(prevTotal => prevTotal + montant)

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
        setTable_items(prevTable_items =>
            prevTable_items.map((item, index) => index == id ? { ...item, quantite } : item)
        )
        calc_Montant(quantite, PU, (montant) => handle_change_montant(id, montant))
    }

    function handle_change_montant(id, montant) {
        const prevMontant = table_items[id].montant
        setTable_items(prevTable_items =>
            prevTable_items.map((item, index) => index == id ? { ...item, montant } : item)
        )
        setTotal(prevTotal => prevTotal - prevMontant + montant)
    }

    function remove_article_from_table(id, montantArticle) {
        setTable_items(prevTable_items => {
            const newTable_items = prevTable_items.filter((item, index) => index != id)
            newTable_items.length == 0 && setType_prix_disabled(false)
            return newTable_items;
        })
        setTotal(prevTotal => prevTotal - montantArticle)
    }

    function handle_start_dragging(event) {
        setDraggingElement(true)
    }

    function handle_end_dragging(event) {
        setDraggingElement(false)
    }

    function footer_up() {
        footerRef.current.style.height = '15rem'
    }

    function footer_down() {
        footerRef.current.style.height = "7.5rem"
        setItems([])
    }

    return (
        <div class="main">
            <PageHeader title={'Bon de Livraison'} />
            <div class="page">
                <div>Bon de livraison</div>
                <div class="general-info">
                    <div class="client-info">
                        <div>Client:
                            <Designation
                                id={"client"}
                                value={client}
                                change={change_client}
                                tabindex="1"
                                autocomplete={false}
                                />
                                {/*<NormalDesignation 
                                    id={"client"}
                                    tabindex='1'
                                />*/}
                        </div>
                        {/*<div>Adresse: <Designation
                            id="adresse"
                            value={adresse}
                            change={change_adresse}
                            tabindex="-1" /> </div>*/}
                    </div>
                    <div>{date}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Désignation</th>
                            <th>Quantité</th>
                            {/*<th>Nbr./Coli.</th>*/}
                            <th>Prix Unité</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    {
                        <ReactSortable tag='tbody' list={table_items} setList={setTable_items}
                            animation={150}
                            multiDrag={true}// Enable multi-drag
                            selectedClass={'selected_to_drage'} // The class applied to the selected items
                            ghostClass={'sortable_ghost'}
                            onStart={handle_start_dragging}
                            onEnd={handle_end_dragging}
                        >
                            {
                                table_items.map((item, index) => {
                                    return (
                                        <TableItemBon index={index}
                                            item={item}
                                            draggingElement={draggingElement}
                                            handle_change_quantite={handle_change_quantite}
                                            remove_article_from_table={remove_article_from_table}
                                            setTotal={setTotal} />
                                    )
                                })
                            }
                        </ReactSortable>
                    }
                </table>
                <TotalInBon total={total} />
            </div>
            <footer ref={footerRef}>
                <div class="panel">
                    <div class="champs">
                        <div class="champ autocomplete">
                            <label for="designation">Désignation</label>
                            <Designation myRef={designationRef}
                                title={nbr_coli}
                                id="designation"
                                value={value}
                                change={change}
                                tabindex="1"
                                onBlur={() => footer_down()} />
                            <div class="autocomplete-items">
                                {items}
                            </div>
                        </div>

                        <div class="champ">
                            <label for="quantite">Quantité</label>
                            <Prix id={'quantite'} value={quantite} setter={setQuantite} tabindex={1} />
                        </div>

                        <div class="champ">
                            <label for="prixUnite">Prix Unité</label>
                            <Prix value={PU} setter={setPU} tabindex={1} />
                        </div>
                        <div class="champ">
                            <label for="montant">Montant</label>
                            <Prix value={montant} tabindex={-1} />
                        </div>
                    </div>
                    <div class="btn">
                        <select id="typePrix" value={typePrix}
                            onChange={handle_typePrix_change}
                            disabled={type_prix_disabled}
                            tabindex="-1">
                            <option value="achat">Achat</option>
                            <option value="gros">Gros</option>
                            <option value="detail">Detail</option>
                        </select>
                        <div>
                            <input type="button" class="standard-btn" value="Enregistrer" onClick={() => printAsPDF(client, setPdf_printed)} tabindex="3" disabled={pdf_printed} />
                            <input type="button" class="standard-btn" value="Imprimé" onClick={() => printer(client, pdf_printed, setPdf_printed)} tabindex="2" disabled={false} />
                            <input type="button" class="standard-btn" value="Ajouter" onClick={push_to_table} tabindex="1" />
                        </div>
                    </div>
                </div>
                <TotalInPanel total={total} />
            </footer>
        </div >
    )
}

ReactDOM.render(<Main />, document.getElementsByTagName("body")[0])


// PRINT MODULE
const { remote } = require("electron");

function printer(client, pdf_printed, setPdf_printed) {
    //printAsPDF(client);

    //TO PRINT
    remote.getCurrentWebContents().print({
        silent: true,
        color: false,
        margins: {
            marginType: 'none'
        }
    }, (success, failureReason) => {
        if (!success) console.log(failureReason);
        else {
            console.log('Print Initiated');
            //setPrinted(true)

            if (!pdf_printed)
                printAsPDF(client, setPdf_printed);
        }
    });
}

function printAsPDF(client, setPdf_printed) {

    const path = require('path');
    const fs = require('fs');

    let date = new Date().toLocaleString().replace(/\sà\s/, '_').replace(/:/g, '-');

    let fileName = "../Bons/" + (client + "_" + date + ".pdf").replace(/[\s \/]/g, "-");

    let pdfPath = path.join(__dirname, fileName);
    let options = {
        marginsType: 1,
        printBackground: false,
        printSelectionOnly: false,
        landscape: false,
        pageSize: 'A4',
        scaleFactor: 100
    };
    // TO PDF
    remote.getCurrentWebContents().printToPDF(options).then(data => {
        fs.writeFile(pdfPath, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
                setPdf_printed(true)

                remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                    type: 'info',
                    title: 'Information',
                    message: 'Le bon a bien été enregistrer.'
                })
            }
        });
    }).catch(error => {
        console.log(error)
    });
}



//----------------------- USELESS --------

function PU_champ(props) {
    return <input type="text" name="" id="prixUnite"
        value={props.value}
        tabindex={props.tabindex}
        onInput={(e) => { props.setPU(e.target.value); props.calc_Montant(props.qtt, e.target.value) }}
        onBlur={() => {
            if (props.value != '' && NumberToCurrency(props.value) != undefined)
                props.setPU(NumberToCurrency(props.value))
        }}
    />
}

function Quantite(props) {
    return <input type="text" name="" id="quantite"
        value={props.value}
        tabindex={props.tabindex}
        onInput={(e) => { props.setQuantite(e.target.value); props.calc_Montant(e.target.value, props.pu) }}
    />
}

function Montant_champ(props) {
    return <input type="text" id="montant" readonly='true' value={NumberToCurrency(props.value)} tabindex={props.tabindex} />
}