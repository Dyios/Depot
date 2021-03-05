import NumberToCurrency from '../Helpers/NumberToCurrency.js';
import HOCTotal from './HOCTotal.js';

function TotalInPanel(_ref) {
    var total = _ref.total;


    return React.createElement(
        'div',
        { 'class': 'total' },
        React.createElement(
            'div',
            { 'class': 'text-total' },
            'TOLAL :'
        ),
        React.createElement(
            'div',
            { 'class': 'nombre-total' },
            React.createElement('input', { type: 'text', name: '', id: 'montant-total', value: total, title: total, tabindex: '-1' })
        )
    );
}

export default HOCTotal(TotalInPanel);