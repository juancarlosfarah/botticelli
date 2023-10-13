import 'reflect-metadata';
import 'reflect-metadata';
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

import { AppDataSource } from './data-source';
import { POST_CONVERSATION_CHANNEL } from '../shared/channels';
import { IpcChannel } from './interfaces/IpcChannel';
import { PostConversationChannel } from './channels/PostConversationChannel';

// AppDataSource.initialize()
//   .then(async () => {
//     console.log('Inserting a new user into the database...');
//     const user = new User();
//     user.firstName = 'Timber';
//     user.lastName = 'Saw';
//     user.age = 25;
//     await AppDataSource.manager.save(user);
//     console.log('Saved a new user with id: ' + user.id);
//
//     console.log('Loading users from the database...');
//     const users = await AppDataSource.manager.find(User);
//     console.log('Loaded users: ', users);
//
//     console.log('Here you can setup and run express / fastify / any other framework.');
//   })
//   .catch((error) => console.log(error));

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
        app.whenReady().then(this.createWindow);
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
    ipcChannels.forEach((channel) =>
      ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)),
    );
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
new Main().init([new PostConversationChannel()]);
