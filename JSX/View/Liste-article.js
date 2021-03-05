import PageHeader from '../Components/PageHeader.js'
import Designation from '../Components/Designation.js'
import TableItemListe from '../Components/TableItemListe.js'
import NormalDesignation from '../Components/NormalDesignation.js'
import { getArticles } from '../MongoDB/dataBaseHelpers.js'

function Main() {
    const [value, setValue] = React.useState('')
    const [liste, setListe] = React.useState()

    function change(e) { // passing it to Designation
        const val = e.target.value.toUpperCase()
        setValue(val)

        // get the correspending articles from the DB
        const query = { designation: new RegExp(val) }
        getArticles(query, setListe)
    }

    function getAll() {
        const query = {}
        getArticles(query, setListe)
    }

    // get the articles onMount
    React.useEffect(getAll, [])

    return (
        <div class="main" >
            <PageHeader title={'Liste des Articles'} hasBackButton={true} />
            <div class="page">
                <div id="designation-div">
                    Rechercher :
                    <Designation value={value} change={change} autocomplete={false} />
                    {/*<NormalDesignation setter={setListe} />*/}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nbr./Coli.</th>
                            <th>Désignation</th>
                            <th>Prix Achat</th>
                            <th>Prix Gros</th>
                            <th>Prix Détail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liste && liste.map(article => <TableItemListe article={article} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

ReactDOM.render(<Main />, document.getElementsByTagName("body")[0])
