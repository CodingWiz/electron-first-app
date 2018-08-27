const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

//set env
process.env.NODE_ENV = 'production';

let win, addWindow;

app.on('ready', function() {
    win = new BrowserWindow({/*width:800, height:600*/});

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

    //win.webContents.openDevTools();

    /*win.on('closed', () => {
        win = null;
    })*/

    //Quit app when closed
    win.on('closed', function() { 
        app.quit();
    });
});

//Catch item add
ipcMain.on('item:add', function(e, item) {
    win.webContents.send('item:add', item);
    addWindow.close();
});

//Menus
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                //Add window
                label: 'Add item',
                click() {
                    addWindow = new BrowserWindow({width:300, height:200, title:'Shopping list item'});

                    addWindow.loadURL(url.format({
                        pathname: path.join(__dirname, "addWindow.html"),
                        protocol: "file",
                        slashes: true
                    }));

                    /*const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

                    Menu.setApplicationMenu(mainMenu);*/

                    //win.webContents.openDevTools();

                    addWindow.on('closed', () => {
                        addWindow = null;
                    })
                }
            },
            {
                label: 'Clear items',
                click() {
                    win.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

//add dev tools if not in prod
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developper Tools',
        submenu: [
            {
                label: 'Toogle Devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

//if mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//if mac, close everything
app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})