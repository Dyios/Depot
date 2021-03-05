//import  from '../../css/Components/DesignationInBon.css'

function DesignationInBon({ value, nbr_coli, index, montant, remove_article_from_table }) {

    return (
        <td title={nbr_coli} className='DesignationInBon_container'>
            {value}
            <div className='buttons_container'>
                <input type="button" className='button'
                    value='X'
                    onClick={() => remove_article_from_table(index, montant)}
                />
            </div>
        </td>
    )
}

export default DesignationInBon