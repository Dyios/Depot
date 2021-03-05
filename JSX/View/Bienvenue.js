import PageHeader from '../Components/PageHeader.js'

function Bienvenue() {

    function openBons(){
        //navigation('Liste-bon',event)
        const path = require('path')
        const {shell} = require('electron') // deconstructing assignment

        let pathBon = path.join(__dirname, '../Bons');

        shell.openItem(pathBon);
      }

    return (
        <div class="main">
            <PageHeader title={'Bienvenue'} />
            <div class="page">
                <div class="left">
                    <button class="big-button" onClick={() => openFile("Bon-livraison")}>Bon de Livraison</button>
                    <button class="big-button" onClick={(event) => navigation("Gestion-articles", event)}>Ajouter / Modifier Article</button>
                </div>
                <div class="right">
                    <button class="big-button" onClick={(event) => navigation('Liste-article', event)}>Liste des Articles</button>
                    {/*<button class="big-button" onClick={event => navigation('Liste-clients', event)}>Liste des Clients</button>*/}
                    <button class="big-button" onClick={()=>openBons()}>Liste des Bon</button>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(<Bienvenue />, document.getElementsByTagName("body")[0]);