import NumberToCurrency from '../Helpers/NumberToCurrency.js'
import HOCTotal from './HOCTotal.js'

function TotalInPanel({total}) {

    return (
        <div class="total">
            <div class="text-total">
                TOLAL :
                    </div>
            <div class="nombre-total">
                <input type="text" name="" id="montant-total" value={total} title={total} tabindex="-1" />
            </div>
        </div>
    )
}


export default HOCTotal(TotalInPanel)