import NumberToCurrency from '../Helpers/NumberToCurrency.js';
import HOCTotal from './HOCTotal.js';

function TotalInBon(_ref) {
    var total = _ref.total;


    return React.createElement(
        'div',
        { id: 'total' },
        'Total : ',
        total,
        ' DA'
    );
}

export default HOCTotal(TotalInBon);