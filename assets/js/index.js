var _require = require('electron'),
    remote = _require.remote;

var path = require('path');

function changeFile(page) {
    //console.log(e)
    remote.getCurrentWindow().loadFile(path.join(__dirname, page + '.html'));
}

function openFile(page) {
    var _remote$screen$getPri = remote.screen.getPrimaryDisplay().workAreaSize,
        width = _remote$screen$getPri.width,
        height = _remote$screen$getPri.height;

    win = new remote.BrowserWindow({
        width: width - 100,
        height: height - 100,
        title: '',
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, page + '.html'));

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    //win.maximize()
    win.setMenuBarVisibility(false);
    win.once('ready-to-show', function () {
        return win.show();
    });
}

function navigation(page, e) {
    if (e.ctrlKey) openFile(page);else changeFile(page);
}