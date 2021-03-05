import PageHeader from '../Components/PageHeader.js';

function Bienvenue() {

    function openBons() {
        //navigation('Liste-bon',event)
        var path = require('path');

        var _require = require('electron'),
            shell = _require.shell; // deconstructing assignment

        var pathBon = path.join(__dirname, '../Bons');

        shell.openItem(pathBon);
    }

    return React.createElement(
        'div',
        { 'class': 'main' },
        React.createElement(PageHeader, { title: 'Bienvenue' }),
        React.createElement(
            'div',
            { 'class': 'page' },
            React.createElement(
                'div',
                { 'class': 'left' },
                React.createElement(
                    'button',
                    { 'class': 'big-button', onClick: function onClick() {
                            return openFile("Bon-livraison");
                        } },
                    'Bon de Livraison'
                ),
                React.createElement(
                    'button',
                    { 'class': 'big-button', onClick: function onClick(event) {
                            return navigation("Gestion-articles", event);
                        } },
                    'Ajouter / Modifier Article'
                )
            ),
            React.createElement(
                'div',
                { 'class': 'right' },
                React.createElement(
                    'button',
                    { 'class': 'big-button', onClick: function onClick(event) {
                            return navigation('Liste-article', event);
                        } },
                    'Liste des Articles'
                ),
                React.createElement(
                    'button',
                    { 'class': 'big-button', onClick: function onClick() {
                            return openBons();
                        } },
                    'Liste des Bon'
                )
            )
        )
    );
}

ReactDOM.render(React.createElement(Bienvenue, null), document.getElementsByTagName("body")[0]);