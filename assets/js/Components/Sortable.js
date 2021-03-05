var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import TableItemBon from './TableItemBon.js';
import '../../../node_modules/sortablejs/sortable.js';

function MySortable(_ref) {
    var items = _ref.items,
        handle_change_quantite = _ref.handle_change_quantite,
        remove_article_from_table = _ref.remove_article_from_table,
        setTotal = _ref.setTotal,
        setItems = _ref.setItems;

    var _React$useState = React.useState(items),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        internalItems = _React$useState2[0],
        setInternalItems = _React$useState2[1];

    var tbodyRef = React.useRef(null);

    React.useEffect(function () {
        setInternalItems(items);
    }, [items]);

    React.useEffect(function () {
        if (tbodyRef.current != null) {
            Sortable.create(tbodyRef.current, {
                animation: 150,
                multiDrag: true, // Enable multi-drag
                selectedClass: 'selected_to_drage', // The class applied to the selected items
                onEnd: function onEnd(event) {
                    //console.log(event.to.children)
                    var newItems = [];
                    /*setItems(prevItems => {
                        
                        for (let i = 0; i < prevItems.length; i++) {
                            newItems.push(prevItems[event.to.children[i].id])
                        }
                        console.log("new state:", newItems)
                        return newItems
                    })*/
                    setInternalItems(function (prevItems) {
                        for (var i = 0; i < prevItems.length; i++) {
                            newItems.push(prevItems[event.to.children[i].id]);
                        }
                        console.log("new state:", newItems);
                        return newItems;
                    });
                }
            });
        }
    }, []);

    return React.createElement(
        'tbody',
        { ref: tbodyRef },
        items.map(function (item, index) {
            return React.createElement(TableItemBon, { index: index,
                item: item,
                handle_change_quantite: handle_change_quantite,
                remove_article_from_table: remove_article_from_table,
                setTotal: setTotal });
        })
    );
}

export default MySortable;