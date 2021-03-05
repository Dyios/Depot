import NumberToCurrency from '../Helpers/NumberToCurrency.js'
import HOCTotal from './HOCTotal.js'

function TotalInBon({total}) {

    return <div id='total'>Total : {total} DA</div>
}


export default HOCTotal(TotalInBon)