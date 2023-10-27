import 'reflect-metadata';
import 'reflect-metadata';
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

import { AppDataSource } from './data-source';
import { IpcChannel } from './interfaces/IpcChannel';
import { PostConversationChannel } from './channels/conversation/PostConversationChannel';
import { GetConversationsChannel } from './channels/conversation/GetConversationsChannel';
import { DeleteConversationChannel } from './channels/conversation/DeleteConversationChannel';
import { GetConversationChannel } from './channels/conversation/GetConversationChannel';
import { PostMessageChannel } from './channels/message/PostMessageChannel';
import { GetMessagesChannel } from './channels/message/GetMessagesChannel';
import { GenerateResponseChannel } from './channels/response/GenerateResponseChannel';

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

class Main {
  public init(ipcChannels: IpcChannel[]): void {
    AppDataSource.initialize()
      .then(() => {
        // Set app user model id for windows
        electronApp.setAppUserModelId('com.electron');
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.whenReady().then(() => {
          this.createWindow();

          installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
        });
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', this.onActivate);
        // Default open or close DevTools by F12 in development
        // and ignore CommandOrControl + R in production.
        // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on('browser-window-created', (_, window) => {
          optimizer.watchWindowShortcuts(window);
        });
        this.registerIpcChannels(ipcChannels);
      })
      .catch((error) => console.log(error));
  }

  /**
   * Quit when all windows are closed, except on macOS. There, it's common
   * for applications and their menu bar to stay active until the user quits
   * explicitly with Cmd + Q.
   * @private
   */
  private onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
    // alternative code
    // if (!this.mainWindow) {
    //   this.createWindow();
    // }
  }

  private registerIpcChannels(ipcChannels: IpcChannel[]): void {
    ipcChannels.forEach((channel) => {
      // debugging
      console.log(`registering ${channel.getName()}`);
      ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request));
    });
  }

  private createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        devTools: is.dev,
      },
    });

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
  }
}

// Here we go!
new Main().init([
  new PostConversationChannel(),
  new GetConversationsChannel(),
  new DeleteConversationChannel(),
  new GetConversationChannel(),
  new PostMessageChannel(),
  new GetMessagesChannel(),
  new GenerateResponseChannel(),
]);
