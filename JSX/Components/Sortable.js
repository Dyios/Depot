import TableItemBon from './TableItemBon.js'
import '../../../node_modules/sortablejs/sortable.js';

function MySortable({ items, handle_change_quantite, remove_article_from_table, setTotal, setItems }) {
    const [internalItems, setInternalItems] = React.useState(items)
    const tbodyRef = React.useRef(null)

    React.useEffect(() => {
        setInternalItems(items)
    }, [items])

    React.useEffect(() => {
        if (tbodyRef.current != null) {
            Sortable.create(tbodyRef.current, {
                animation: 150,
                multiDrag: true, // Enable multi-drag
                selectedClass: 'selected_to_drage', // The class applied to the selected items
                onEnd: (event) => {
                    //console.log(event.to.children)
                    let newItems = []
                    /*setItems(prevItems => {
                        
                        for (let i = 0; i < prevItems.length; i++) {
                            newItems.push(prevItems[event.to.children[i].id])
                        }
                        console.log("new state:", newItems)
                        return newItems
                    })*/
                    setInternalItems(prevItems => {
                        for (let i = 0; i < prevItems.length; i++) {
                            newItems.push(prevItems[event.to.children[i].id])
                        }
                        console.log("new state:", newItems)
                        return newItems;
                    })
                }
            })
        }
    }, [])

    return (
        <tbody ref={tbodyRef}>
            {
                items.map((item, index) =>
                    <TableItemBon index={index}
                        item={item}
                        handle_change_quantite={handle_change_quantite}
                        remove_article_from_table={remove_article_from_table}
                        setTotal={setTotal} />

                )
            }
        </tbody>
    )
}

export default MySortable