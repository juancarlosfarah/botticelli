import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import log from 'electron-log/main';
import { join } from 'path';
import 'reflect-metadata';
import 'reflect-metadata';

import icon from '../../resources/icon.png?asset';
import { DeleteAgentChannel } from './channels/agent/DeleteAgentChannel';
import { GetAgentChannel } from './channels/agent/GetAgentChannel';
import { GetAgentsChannel } from './channels/agent/GetAgentsChannel';
import { DeleteOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/DeleteOneArtificialAssistantChannel';
import { GetManyArtificialAssistantChannel } from './channels/agent/artificial/assistant/GetManyArtificialAssistantChannel';
import { GetOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/GetOneArtificialAssistantChannel';
import { PostOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/PostOneArtificialAssistantChannel';
import { DeleteOneArtificialParticipantChannel } from './channels/agent/artificial/participant/DeleteOneArtificialParticipantChannel';
import { GetManyArtificialParticipantsChannel } from './channels/agent/artificial/participant/GetManyArtificialParticipantsChannel';
import { GetOneArtificialParticipantChannel } from './channels/agent/artificial/participant/GetOneArtificialParticipantChannel';
import { PostOneArtificialParticipantChannel } from './channels/agent/artificial/participant/PostOneArtificialParticipantChannel';
import { PostOneHumanAssistantChannel } from './channels/agent/human/assistant/PostOneHumanAssistantChannel';
import { PostOneHumanParticipantChannel } from './channels/agent/human/participant/PostOneHumanParticipantChannel';
import { DeleteConversationChannel } from './channels/conversation/DeleteConversationChannel';
import { GetConversationChannel } from './channels/conversation/GetConversationChannel';
import { GetConversationsChannel } from './channels/conversation/GetConversationsChannel';
import { PostConversationChannel } from './channels/conversation/PostConversationChannel';
import { DeleteOneInteractionChannel } from './channels/interaction/DeleteOneInteractionChannel';
import { GetManyInteractionsChannel } from './channels/interaction/GetManyInteractionsChannel';
import { GetOneInteractionChannel } from './channels/interaction/GetOneInteractionChannel';
import { PostOneInteractionChannel } from './channels/interaction/PostOneInteractionChannel';
import { GetMessagesChannel } from './channels/message/GetMessagesChannel';
import { PostMessageChannel } from './channels/message/PostMessageChannel';
import { GenerateResponseChannel } from './channels/response/GenerateResponseChannel';
import { DeleteOneTriggerChannel } from './channels/trigger/DeleteOneTriggerChannel';
import { GetManyTriggersChannel } from './channels/trigger/GetManyTriggersChannel';
import { GetOneTriggerChannel } from './channels/trigger/GetOneTriggerChannel';
import { PostOneTriggerChannel } from './channels/trigger/PostOneTriggerChannel';
import { AppDataSource } from './data-source';
import { IpcChannel } from './interfaces/IpcChannel';

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

class Main {
  public init(ipcChannels: IpcChannel[]): void {
    // initialize the logger for any renderer process
    log.initialize({ preload: true });

    AppDataSource.initialize()
      .then(() => {
        // set app user model id for windows
        electronApp.setAppUserModelId('com.electron');

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.whenReady().then(() => {
          this.createWindow();

          installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
            .then((name) => log.debug(`Added Extension:  ${name}`))
            .catch((err) => log.error('An error occurred: ', err));
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
      .catch((error) => log.error(error));
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
      log.debug(`registering ${channel.getName()}`);
      ipcMain.on(channel.getName(), (event, request) =>
        channel.handle(event, request),
      );
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
  // conversations
  new PostConversationChannel(),
  new GetConversationsChannel(),
  new DeleteConversationChannel(),
  new GetConversationChannel(),
  // messages
  new PostMessageChannel(),
  new GetMessagesChannel(),
  new GenerateResponseChannel(),
  // agents
  new GetAgentsChannel(),
  new GetAgentChannel(),
  new DeleteAgentChannel(),
  // |_ artificial
  //   |_ assistant
  new PostOneArtificialAssistantChannel(),
  new GetManyArtificialAssistantChannel(),
  new DeleteOneArtificialAssistantChannel(),
  new GetOneArtificialAssistantChannel(),
  //   |_ participant
  new PostOneArtificialParticipantChannel(),
  new GetOneArtificialParticipantChannel(),
  new GetManyArtificialParticipantsChannel(),
  new DeleteOneArtificialParticipantChannel(),
  // |_ human
  //   |_ assistant
  new PostOneHumanAssistantChannel(),
  //   |_ participant
  new PostOneHumanParticipantChannel(),
  // triggers
  new PostOneTriggerChannel(),
  new GetOneTriggerChannel(),
  new GetManyTriggersChannel(),
  new DeleteOneTriggerChannel(),
  // interactions
  new PostOneInteractionChannel(),
  new GetOneInteractionChannel(),
  new GetManyInteractionsChannel(),
  new DeleteOneInteractionChannel(),
]);
