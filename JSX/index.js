const { remote } = require('electron')
const path = require('path')

function changeFile(page){
    //console.log(e)
    remote.getCurrentWindow().loadFile(path.join(__dirname,`${page}.html`));
}

function openFile(page){
    const { width, height } = remote.screen.getPrimaryDisplay().workAreaSize
    win = new remote.BrowserWindow({
        width: width-100, 
        height: height-100,
        title: '',
        show:false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname,`${page}.html`));

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    //win.maximize()
    win.setMenuBarVisibility(false)
    win.once('ready-to-show',()=>win.show())
}

function navigation(page, e){
    if( e.ctrlKey )
        openFile(page)
    else
        changeFile(page)
}