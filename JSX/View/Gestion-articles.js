import PageHeader from '../Components/PageHeader.js'
import Designation, { setCurrentFocus } from '../Components/Designation.js'
import NumberToCurrency from '../Helpers/NumberToCurrency.js'
import Prix from '../Components/Prix.js'

const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017/Magasin";

function Main() {
    const [value, setValue] = React.useState()
    const [nbr_coli, setNbr_coli] = React.useState()
    const [prix_achat, setPrix_achat] = React.useState()
    const [prix_gros, setPrix_gros] = React.useState()
    const [prix_detail, setPrix_detail] = React.useState()

    const [items, setItems] = React.useState()//for autocomplete

    const [modifier_disabled, setModifier_disabled] = React.useState(true)//for autocomplete

    const designation_changeRef = React.useRef(null)

    function change(e) {
        const val = e.target.value.toUpperCase()

        if (val[val.length - 1] == "(" || val[val.length - 1] == ")") return;

        setValue(val)
        setModifier_disabled(true)
        if (val == "") {
            setItems([])
            return
        }

        if (val.length < 3) return;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("Magasin");
            var query = { designation: new RegExp(val) }
            dbo.collection("articles").find(query).sort({ designation: 1 }).toArray(function (err, result) {
                if (err) throw err

                if (result.length === 1 && result[0].designation === val) {
                    setArticleIn(result[0])
                } else {
                    let tmp_items = []
                    for (let i = 0, c = result.length; i < c; i++) {
                        // bold the suggestions
                        let x = result[i].designation.indexOf(val);
                        let first = result[i].designation.slice(0, x);
                        let bold = result[i].designation.slice(x, x + val.length);
                        let last = result[i].designation.slice(x + val.length);

                        tmp_items.push(
                            <div
                                onClick={() => setArticleIn(result[i])}>
                                {first}<strong>{bold}</strong>{last}
                            </div>)
                    }
                    setItems(tmp_items)
                }
            })
            db.close()
        })
    }

    function setArticleIn(article) {
        setValue(article.designation)
        setNbr_coli(article.nbr_coli)
        setPrix_achat(article.prix_achat)
        setPrix_gros(article.prix_gros)
        setPrix_detail(article.prix_detail)
        setItems([])

        setCurrentFocus(-1) //initialize autocomplete
        setModifier_disabled(false)
    }

    function Ajouter() {
        function add(e) {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("Magasin");

                /*const prix_achat_tmp = prix_achat.replace(/\s/g, '');
                const prix_gros_tmp = prix_gros.replace(/\s/g, '');
                const prix_detail_tmp = prix_detail.replace(/\s/g, '');*/
                dbo.collection("articles").updateOne({ designation: value },
                    {
                        $set: {
                            designation: value,
                            nbr_coli: parseInt(nbr_coli),
                            prix_achat: parseFloat(prix_achat),
                            prix_gros: parseFloat(prix_gros),
                            prix_detail: parseFloat(prix_detail)
                        }
                    }, { upsert: true }, function (err, result) {
                        if (err) throw err
                        let msg = result.result.nModified ? "mis à jour" : "ajouter"
                        alert(`Article ${msg} :
                        
            ${value}   |   (${nbr_coli})   |   ${prix_achat}   |   ${prix_gros}   |   ${prix_detail}`)
                    })
                    
                db.close()
            });
        }

        return <input type="submit" class="standard-btn" value="Ajouter" onClick={add}></input>;
    }

    function change_designation() {
        setTimeout(() => {
            designation_changeRef.current.style.visibility = "visible";
            designation_changeRef.current.style.width = "100%";
            designation_changeRef.current.style.height = "100%";
        }, 100); // wait to blur designation

        setTimeout(() => {
            designation_changeRef.current.focus()
        }, 1000)// wait end of animation

    }

    function Change_designation({myRef}) {
        const [change_value, setChange_value] = React.useState(value);

        function change(e) {
            const val = e.target.value.toUpperCase()
            setChange_value(val)
        }

        function hideInput(e) {
            myRef.current.style.visibility = "hidden";
            myRef.current.style.width = "0%";
            myRef.current.style.height = "0%";

            if (value === change_value) return;

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("Magasin");

                dbo.collection("articles").updateOne({ designation: value },
                    { $set: { designation: change_value } })
            })

            const { dialog, getCurrentWindow } = require("electron").remote;

            let msg1 = `Ancienne designation :     ${value}\n`
            let msg2 = `\nNouvelle  designation :     ${change_value}`
            dialog.showMessageBox(getCurrentWindow(), {
                type: "none",
                title: "Designation mise à jour",
                message: msg1 + msg2,
            });

            setValue(change_value)
        }

        return (
            <input ref={myRef} id="designation_change" value={change_value} onChange={change} onBlur={hideInput}></input>
        );
    }

    return (
        <div class="main">
            <PageHeader title={'Ajouter / Modifier Article'} hasBackButton={true} />
            <div class="page">
                <form>
                    <div class="info">
                        <label for="designation">Désignation</label>:
                        <div class='autocomplete'>
                            <Designation
                                id={"designation"}
                                value={value}
                                change={change}
                                onBlur={() => {
                                    setItems([])
                                }}
                            />
                            <Change_designation myRef={designation_changeRef} />
                            <div class='autocomplete-items'>{items}</div>
                        </div>
                        <input type="button" id="modifier-btn" class="standard-btn" value="Modifier" onClick={() => change_designation()} tabindex="-1" disabled={modifier_disabled} />
                    </div>
                    {/*<div class="info">
                            <label for="categorie">Catégorie</label>:
                            <select id="categorie">
                                <option value="#">Deo</option>
                                <option value="#">Shampoin</option>
                            </select>
                        </div>*/}
                    <div class="info">
                        <label for="quantite">Nbr / Coli.</label>:
                            <Prix id="quantite" value={nbr_coli} setter={setNbr_coli} ></Prix>
                    </div>
                    <div class="prix">
                        <div class="typePrix">
                            <label for="prixAchat">Prix Achat</label>
                            <Prix id='prixAchat' value={prix_achat} setter={setPrix_achat} />
                        </div>
                        <div class="typePrix">
                            <label for="prixGros">Prix Gros</label>
                            <Prix id='prixGros' value={prix_gros} setter={setPrix_gros} />
                        </div>
                        <div class="typePrix">
                            <label for="prixDetail">Prix Détail</label>
                            <Prix id='prixDetail' value={prix_detail} setter={setPrix_detail} />
                        </div>
                    </div>
                    <div class="form-btn">
                        <Ajouter />
                    </div>
                </form>
            </div>
        </div>
    )
}

ReactDOM.render(<Main />, document.getElementsByTagName("body")[0])
