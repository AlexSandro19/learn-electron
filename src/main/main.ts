/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { sequelize } from '../../database/models/index';
import { User } from '../../database/models/user';
import bcrypt from "bcrypt";
import { password } from '../../database/config/config';

const saltRounds = 10;

(async () => {
  await sequelize.authenticate()
    .then(() => {
      console.log('Successfully connected to database!')

    })
    .catch((error) => console.log('Failed to connect database:', error))

  await sequelize.sync({ force: true });
  //console.log('sequelize synced')
})();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg)); const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(arg);
  event.reply('ipc-example', 'pong');
});

ipcMain.on('signup', async (event, arg) => {
  const { name, username, email, password } = arg.data;
  const response = {user: null, msg: "", error: null}
  console.log(arg.data);
  // check if already created
  const user = await User.findOne({ where: { username: username } });
  response.user = user;

  if (user === null) {
    bcrypt.hash(password, saltRounds, async function(err, hash) {
      if (err){
        response.error = err;
        response.msg = "Error saving the User. Please sign up later.";
        event.reply('signup', response);
      }else{
        const user = await User.create({name, username, email, password: hash});
        response.user = user;
        response.msg = "New user created!"
        console.log(user instanceof User); // true
        console.log('New user created');
        event.reply('signup', response);

      }
    });
  } else {
    response.error = true;
    response.msg = "User already exists";
    console.log('User already exists');
    event.reply('signup', response);
  }
});

ipcMain.on('signin', async (event, arg) => {
  const { username, password } = arg.data;
  console.log(arg.data);
  const response = {user: null, msg: "", error: null}
  // check if already created
  const user = await User.findOne({ where: { username: username } });
  if (user === null) {
    response.error = true;
    response.msg = 'User not found';
    console.log('User not found');
    event.reply('signin', response);
  } else {
    bcrypt.compare(password, user.password, function(err, isSame) {
        if (isSame){
          response.user = user;
          response.msg = 'Sign In Successfull.'
          console.log(user instanceof User); // true
          console.log('User found');
          event.reply('signin', response);
        }else{
          response.error = true;
          response.msg = 'Incorrect password. Try again.';
          console.log('Incorrect password. Try again.');
          event.reply('signin', response);
        }
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
