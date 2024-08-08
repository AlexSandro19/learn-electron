// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  // ipcRenderer: {
  //   sendMessage(channel: Channels, ...args: unknown[]) {
  //     ipcRenderer.send(channel, ...args);
  //   },
  //   on(channel: Channels, func: (...args: unknown[]) => void) {
  //     const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
  //       func(...args);
  //     ipcRenderer.on(channel, subscription);

  //     return () => {
  //       ipcRenderer.removeListener(channel, subscription);
  //     };
  //   },
  //   once(channel: Channels, func: (...args: unknown[]) => void) {
  //     ipcRenderer.once(channel, (_event, ...args) => func(...args));
  //   },
  // },
  ipcRenderer: {
    sendMessage(channel: 'ipc-example', ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    
    on(channel: 'ipc-example', func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: 'ipc-example', func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  authRenderer: {
    sendSignup(...args: unknown[]) {
      ipcRenderer.send('signup', ...args);
    },
    onSignup(func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on('signup', subscription);

      return () => {
        ipcRenderer.removeListener('signup', subscription);
      };
    },
    sendSignin(...args: unknown[]) {
      ipcRenderer.send('signin', ...args);
    },
    onSignin(func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on('signin', subscription);

      return () => {
        ipcRenderer.removeListener('signin', subscription);
      };
    },
  },
  testRenderer: {
    // sendAddComposit(...args: unknown[]) {
    //   ipcRenderer.send('addComposit', ...args);
    // },
    // onAddComposit(func: (...args: unknown[]) => void) {
    //   const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
    //     func(...args);
    //   ipcRenderer.on('addComposit', subscription);

    //   return () => {
    //     ipcRenderer.removeListener('addComposit', subscription);
    //   };
    // },
    // code below doesnt work, I guess because it's a function instead of a callback function
    // invokeAddComposit(args) {
    //   ipcRenderer.invoke('addCompositTest', args);
    // },
    invokeAddComposit: (args) => ipcRenderer.invoke('addComposit', args),
    invokeDeleteComposit: (args) => ipcRenderer.invoke('deleteComposit', args),
    invokeRenameComposit: (args) => ipcRenderer.invoke('renameComposit', args),
    invokeGetComposits: () => ipcRenderer.invoke('getComposits'),
    sendAddComponent(...args: unknown[]) {
      ipcRenderer.send('addComponent', ...args);
    },
    onAddComponent(func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on('addComponent', subscription);
      
      return () => {
        ipcRenderer.removeListener('addComponent', subscription);
      };
    },
    sendRenameComponent(...args: unknown[]) {
      ipcRenderer.send('renameComponent', ...args);
    },
    sendDeleteComponent(...args: unknown[]) {
      ipcRenderer.send('deleteComponent', ...args);
    },
    sendAddSubcomponent(...args: unknown[]) {
      ipcRenderer.send('addSubcomponent', ...args);
    },
    sendRenameSubcomponent(...args: unknown[]) {
      ipcRenderer.send('renameSubcomponent', ...args);
    },
    sendDeleteSubcomponent(...args: unknown[]) {
      ipcRenderer.send('deleteSubcomponent', ...args);
    },
  invokeAddComponent: (args) => ipcRenderer.invoke('addComponent', args),
  invokeDeleteComponent: (args) => ipcRenderer.invoke('deleteComponent', args),
  invokeRenameComponent: (args) => ipcRenderer.invoke('renameComponent', args),
  invokeAddSubComponent: (args) => ipcRenderer.invoke('addSubComponent', args),
  invokeDeleteSubComponent: (args) => ipcRenderer.invoke('deleteSubComponent', args),
  invokeRenameSubComponent: (args) => ipcRenderer.invoke('renameSubComponent', args),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
