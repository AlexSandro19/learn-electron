// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
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
    invokeAddComposit: (args) => ipcRenderer.invoke('addComposit', args),
    invokeDeleteComposit: (args) => ipcRenderer.invoke('deleteComposit', args),
    invokeRenameComposit: (args) => ipcRenderer.invoke('renameComposit', args),
    invokeGetComposits: () => ipcRenderer.invoke('getComposits'),
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
