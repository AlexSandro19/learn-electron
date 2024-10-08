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
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { sequelize } from '../../database/models/index';
import { User } from '../../database/models/user';
import { Composit, Component, ParentComponentChildComponent } from '../../database/models/relationships';
import bcrypt from "bcrypt";
import validator from 'validator';
import { password } from '../../database/config/config';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

const saltRounds = 10;

// const getCompositsResponse = [{ id: 3, name: "zzz", createdAt: "2024-08-01T21:01:01.020Z", updatedAt: "2024-08-01T21:01:01.020Z", components: [{ id: 1, name: "wwww", createdAt: "2024-08-01T21:49:28.553Z", updatedAt: "2024-08-01T21:49:28.553Z", compositId: 3, subcomponents:  [{ id: 4, name: "eeee", createdAt: "2024-08-01T23:33:28.316Z", updatedAt: "2024-08-01T23:33:28.316Z", compositId: 4, subcomponents:  [{ id: 4, name: "eeee", createdAt: "2024-08-01T23:33:28.316Z", updatedAt: "2024-08-01T23:33:28.316Z", compositId: 4 }, { id: 5, name: "yyyy", createdAt: "2024-08-02T04:00:05.294Z", updatedAt: "2024-08-02T04:00:05.294Z", compositId: 4 }, { id: 6, name: "tttt", createdAt: "2024-08-02T17:02:24.233Z", updatedAt: "2024-08-02T17:02:24.233Z", compositId: 4 }]}, { id: 5, name: "cccc", createdAt: "2024-08-02T04:00:05.294Z", updatedAt: "2024-08-02T04:00:05.294Z", compositId: 4 }]}, { id: 3, name: "xxxx", createdAt: "2024-08-01T23:33:12.179Z", updatedAt: "2024-08-01T23:33:12.179Z", compositId: 3 }] }, { id: 4, name: "qqq", createdAt: "2024-08-01T21:49:23.895Z", updatedAt: "2024-08-01T21:49:23.895Z", components: [{ id: 4, name: "eeee", createdAt: "2024-08-01T23:33:28.316Z", updatedAt: "2024-08-01T23:33:28.316Z", compositId: 4 }, { id: 5, name: "cccc", createdAt: "2024-08-02T04:00:05.294Z", updatedAt: "2024-08-02T04:00:05.294Z", compositId: 4 }, { id: 6, name: "vvvv", createdAt: "2024-08-02T17:02:24.233Z", updatedAt: "2024-08-02T17:02:24.233Z", compositId: 4 }] }];

(async () => {
  await sequelize.authenticate()
    .then(() => {
      console.log('Successfully connected to database!')

    })
    .catch((error) => console.log('Failed to connect database:', error))

  await sequelize.sync();
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
  console.log(arg);
  event.reply('ipc-example', 'pong');
});

// Authentication Handling

ipcMain.on('signup', async (event, arg) => {
  const { name, username, email, password } = arg.data;
  console.log(arg.data);
  const response = { user: null, msg: "", error: null }
  let wrong_input = ''
  for (const user_input in arg.data) {
    wrong_input += (validator.isEmpty(arg.data[user_input]) ? `Provide a ${user_input}. \n` : ``)
  }
  wrong_input += (validator.isEmail(email) ? `` : `Provide a valid email`)
  if (wrong_input.length) {
    response.error = true;
    response.msg = wrong_input;
    event.reply('signup', response);
  } else {
    const user = await User.findOne({ where: { username: username } });

    if (user === null) {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
          response.error = true;
          response.msg = "Error saving the User. Please sign up later.";
          event.reply('signup', response);
        } else {
          const user = await User.create({ name, username, email, password: hash });
          response.user = user;
          response.msg = "New user created!"
          console.log(user instanceof User); // true
          console.log('New user created');
          console.log('response:', response);
          event.reply('signup', response);

        }
      });
    } else {
      response.error = true;
      response.msg = "User already exists";
      console.log('User already exists');
      event.reply('signup', response);
    }
  }

});

ipcMain.on('signin', async (event, arg) => {
  const { username, password } = arg.data;
  console.log(arg.data);
  const response = { user: null, msg: "", error: null }
  // check if already created
  let wrong_input = ''
  for (const user_input in arg.data) {
    wrong_input += (validator.isEmpty(arg.data[user_input]) ? `Provide a ${user_input}. \n` : ``)
  }
  if (wrong_input.length) {
    response.error = true;
    response.msg = wrong_input;
    event.reply('signin', response);
  } else {
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      response.error = true;
      response.msg = 'User not found';
      console.log('User not found');
      event.reply('signin', response);
    } else {
      bcrypt.compare(password, user.password, function (err, isSame) {
        if (isSame) {
          response.user = user;
          response.msg = 'Sign In Successfull.'
          console.log(user instanceof User); // true
          console.log('User found');
          event.reply('signin', response);
        } else {
          response.error = true;
          response.msg = 'Incorrect password. Try again.';
          console.log('Incorrect password. Try again.');
          event.reply('signin', response);
        }
      });
    }
  }
});

// Composit & Component Handling
ipcMain.handle('addComposit', async (event, arg) => {
  console.log("addComposit received arg: ", arg)
  const { compositName } = arg.data;
  const response = { composit: null, msg: "", error: false }
  // const composit = (await Composit.create({ name: compositName }))?.toJSON();
  try {
    // Composit.create({ name: compositName }).then((composit) => {
    //   const compositToJson = composit?.toJSON();
    //   compositToJson.components = [];
    //   response.composit = compositToJson;
    //   console.log("addComposit response created: ", response);
    if (validator.isEmpty(compositName)) {
      throw new Error(`Composit name needs to contain characters(letters, numbers, etc).`)
    }

    const compositAlreadyPresent = await Composit.count({ where: { name: compositName } });
    if (compositAlreadyPresent) {
      throw new Error(`Composit with name - ${compositName} is already present. Provide another name.`)
    }
    const composit = (await Composit.create({ name: compositName }))?.toJSON();
    composit.components = [];
    console.log("addComposit composit: ", composit);
    response.composit = composit;
  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }
    console.log("addComposit error: ", error);
  }
  console.log("addComposit response outside: ", response);
  return response;
  // composit.components = [];
  // console.log("addComposit composit: ", composit);
  // response.composit = composit;
  // console.log("response: ", response);


});

ipcMain.handle('deleteComposit', async (event, arg) => {
  console.log("deleteComposit received")
  const { compositId } = arg.data;
  const response = { isCompositDeleted: false, msg: "", error: null }

  try {
    if (!(Number.isInteger(compositId))) {
      throw new Error(`Provide correct Composit value`)
    }
    const compositToDelete = await Composit.findByPk(compositId);
    if (!compositToDelete) {
      throw new Error(`Provided Composit doesn't exist`)
    }
    const deletedRows = await compositToDelete?.destroy();
    const isCompositDeleted = deletedRows ? true : false;
    console.log("isCompositDeleted: ", isCompositDeleted);
    response.isCompositDeleted = isCompositDeleted;
    console.log("response: ", response);

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("deleteComposit error: ", error);
  }

  return response;
});

ipcMain.handle('renameComposit', async (event, arg) => {
  console.log("renameComposit received")
  const { compositId, newCompositName } = arg.data;
  const response = { isCompositUpdated: false, msg: "", error: null }

  try {

    if (!(Number.isInteger(compositId))) {
      throw new Error(`Provide correct Composit value`)
    } else if (validator.isEmpty(newCompositName)) {
      throw new Error(`New Composit name needs to contain characters(letters, numbers, etc).`)
    }

    const composit = await Composit.findByPk(compositId);
    if (composit) {
      composit.name = newCompositName;
      await composit.save();
      response.isCompositUpdated = true;
    } else {
      throw new Error(`Provided Composit doesn't exist`)
    }
    console.log("response: ", response);

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("renameComposit error: ", error);
  }

  return response;
});

ipcMain.handle('getComposits', async (event) => {
  const response = { composits: null, msg: "", error: null }
  // const composits = (await Composit.findAll({ include: Component })).map(composit => composit?.toJSON());
  // https://sequelize.org/docs/v7/querying/select-in-depth/#filtering-associated-models

  // const compositsWithJson = (await Composit.findAll({
  //   include: [
  //     {
  //       model: Component,
  //       required: false, // added to include Composits which don't have a Component associated to them
  //       where: {
  //         main_component: true,
  //       },
  //     },
  //   ],
  // })).map(composit => composit?.toJSON());

  try {
    const composits = await Composit.findAll({
      include: [
        {
          model: Component,
          required: false, // added to include Composits which don't have a Component associated to them
          where: {
            main_component: true,
          },
        },
      ],
    });

    const compositsComponentsSubcomponents = await Promise.all(composits.map(async (composit) => {
      // const compositComponents = await composit.getComponents();
      console.log("getComposits each composit: ", composit);
      const compositComponentsToJson = await Promise.all(await composit.components?.map(async (component) => {
        const getCompWithSubComp = await getComponentSubcomponents(component);
        console.log("getComposits getCompWithSubComp: ", getCompWithSubComp);
        return getCompWithSubComp;
      }));
      console.log("getComposits compositComponentsToJson: ", compositComponentsToJson);
      const compositToJson = composit?.toJSON();
      compositToJson.components = compositComponentsToJson;
      return compositToJson;
    }));
    console.log("getComposits compositsComponentsSubcomponents: ", JSON.stringify(compositsComponentsSubcomponents));
    console.log("getComposits composits: ", composits);
    response.composits = compositsComponentsSubcomponents;

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("getComposits error: ", error);

  }

  return response;
});

const getComponentSubcomponents = async (componentObj) => {
  console.log('updateComponentWithNewSubcomponent, componentObj: ', componentObj);
  const componentSubComponents = await componentObj.getChildren();
  console.log('updateComponentWithNewSubcomponent, componentSubComponents: ', componentSubComponents);
  let componentSubComponentsToJSON = []
  if (componentSubComponents?.length > 0) {
    componentSubComponentsToJSON = await Promise.all(componentSubComponents.map(async (component) => { // have Promise.all because getComponentSubcomponents is async and is called recursively
      const resp = await getComponentSubcomponents(component); // await not necessary, but kept it to point that getComponentSubcomponents is async (if I understand it correctly)
      console.log('updateComponentWithNewSubcomponent, resp: ', resp);
      return resp;
    }));
  }
  componentObj.dataValues.subcomponents = componentSubComponentsToJSON;
  console.log('updateComponentWithNewSubcomponent, componentObj.dataValues.subcomponents: ', componentObj.dataValues.subcomponents);
  const componentObjToJson = componentObj.toJSON();
  console.log('updateComponentWithNewSubcomponent, componentObjToJson: ', componentObjToJson);
  return componentObjToJson;
}

ipcMain.handle('addComponent', async (event, arg) => {
  console.log("addComponent received")
  console.log("addComponent arg.data: ", arg.data);
  const { componentName, compositId } = arg.data;

  const response = { component: null, msg: "", error: null }
  try {

    if (!(Number.isInteger(compositId))) {
      throw new Error(`Provide correct Composit value`)
    } else if (validator.isEmpty(componentName)) {
      throw new Error(`Component name needs to contain characters(letters, numbers, etc).`)
    }

    const composit = await Composit.findByPk(compositId);
    // Sequelize provides createComponent method on composit object because we defined 
    //    association between Composit and Component tables 
    //    (check here: https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances)
    const component = composit ? (await composit.createComponent({ name: componentName, main_component: true })).toJSON() : null;
    console.log("addComponent composit: ", composit);
    console.log("addComponent component: ", component);
    response.component = component;
  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("addComponent error: ", error);
  }

  return response;
});

ipcMain.handle('addSubComponent', async (event, arg) => {
  console.log("addSubComponent arg.data: ", arg.data);
  const { subComponentName, componentId, compositId } = arg.data;
  console.log("addSubComponent componentName: ", componentId);
  console.log("addSubComponent subComponentName: ", subComponentName);
  const response = { subComponent: null, composit: null, msg: "", error: null }

  try {

    if (!(Number.isInteger(compositId))) {
      throw new Error(`Provide correct Composit value`)
    } else if (!(Number.isInteger(componentId))) {
      throw new Error(`Provide correct Component value`)
    } else if (validator.isEmpty(subComponentName)) {
      throw new Error(`SubComponent name needs to contain characters(letters, numbers, etc).`)
    }

    const composit = await Composit.findByPk(compositId);
    const component = await Component.findByPk(componentId);
    // if composit object is not returned -> give error
    const subComponent = composit ? (await composit.createComponent({ name: subComponentName })).toJSON() : null;
    // using Sequelize special function to accees the associated Children of Component: https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
    const newComponent = await component.addChildren(subComponent.id);
    console.log("addSubComponent subComponent: ", subComponent);
    console.log("addSubComponent newComponent: ", newComponent);
    response.subComponent = subComponent;

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("addSubComponent error: ", error);
  }

  return response;
});

ipcMain.handle('deleteComponent', async (event, arg) => {
  console.log("deleteComponent received")
  const { componentId } = arg.data;
  const response = { isComponentDeleted: false, msg: "", error: null }

  try {
    if (!(Number.isInteger(componentId))) {
      throw new Error(`Provide correct Component value`)
    }
    const component = await Component.findByPk(componentId);
    const componentIdsToDelete = await getComponentIds(component);
    const componentIdsToDeleteFlat = componentIdsToDelete.flat(Infinity);
    console.log('deleteComponent, componentIdsToDeleteFlat: ', componentIdsToDeleteFlat);
    const deletedRows = await Component.destroy({ where: { id: componentIdsToDeleteFlat } })
    const isComponentDeleted = deletedRows ? true : false;
    console.log("isComponentDeleted: ", isComponentDeleted);
    response.isComponentDeleted = isComponentDeleted;

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("deleteComponent error: ", error);
  }

  console.log("response: ", response);
  return response;
});

const getComponentIds = async (component) => {
  const componentChildren = await component.getChildren();
  const componentChildrenIds = [];
  if (componentChildren.length > 0) {
    const componentChildrenIdsResponse = await Promise.all(componentChildren.map(async (componentChild) => {
      return (await getComponentIds(componentChild));
    }))
    componentChildrenIds.push(...componentChildrenIdsResponse)
  }
  return [component?.id, ...componentChildrenIds];
}

ipcMain.handle('renameComponent', async (event, arg) => {
  console.log("renameComponent received arg.data: ", arg.data)
  const { componentId, newComponentName } = arg.data;
  const response = { isComponentUpdated: false, msg: "", error: null }
  try {

    if (!(Number.isInteger(componentId))) {
      throw new Error(`Provide correct Component value`)
    } else if (validator.isEmpty(newComponentName)) {
      throw new Error(`New Component name needs to contain characters(letters, numbers, etc).`)
    }

    const component = await Component.findByPk(componentId);
    if (component) {
      component.name = newComponentName;
      await component.save();
      response.isComponentUpdated = true;
    } else {
      response.msg = "Provided Component doesn't exist";
      response.error = true;
    }

  } catch (error) {
    response.error = true;
    if (error?.message) {
      response.msg = error?.message;
    } else if (error?.errors) {
      response.msg = error.errors.map(err => err.message).join(" AND ");
    } else {
      response.msg = "Server error occured.";
    }

    console.log("renameComponent error: ", error);
  }

  console.log("response: ", response);
  return response;
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
  // if (isDebug) {
  //   await installExtensions();
  // }


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
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  })
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
