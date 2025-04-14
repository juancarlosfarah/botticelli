import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import log from 'electron-log/main';
import fs from 'fs';
import i18nextBackend from 'i18next-electron-fs-backend';
import { join } from 'path';
import 'reflect-metadata';
import 'reflect-metadata';

import icon from '../../resources/icon.png?asset';
import i18nextMainBackend from '../shared/locales/i18n.main.config';
import { DeleteAgentChannel } from './channels/agent/DeleteAgentChannel';
import { GetAgentChannel } from './channels/agent/GetAgentChannel';
import { GetAgentsChannel } from './channels/agent/GetAgentsChannel';
import { DeleteOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/DeleteOneArtificialAssistantChannel';
import { GetManyArtificialAssistantsChannel } from './channels/agent/artificial/assistant/GetManyArtificialAssistantsChannel';
import { GetOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/GetOneArtificialAssistantChannel';
import { PatchOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/PatchOneArtificialAssistantChannel';
import { PostOneArtificialAssistantChannel } from './channels/agent/artificial/assistant/PostOneArtificialAssistantChannel';
import { DeleteOneArtificialEvaluatorChannel } from './channels/agent/artificial/evaluator/DeleteOneArtificialEvaluatorChannel';
import { GetManyArtificialEvaluatorsChannel } from './channels/agent/artificial/evaluator/GetManyArtificialEvaluatorsChannel';
import { GetOneArtificialEvaluatorChannel } from './channels/agent/artificial/evaluator/GetOneArtificialEvaluatorChannel';
import { PatchOneArtificialEvaluatorChannel } from './channels/agent/artificial/evaluator/PatchOneArtificialEvaluatorChannel';
import { PostOneArtificialEvaluatorChannel } from './channels/agent/artificial/evaluator/PostOneArtificialEvaluatorChannel';
import { DeleteOneArtificialParticipantChannel } from './channels/agent/artificial/participant/DeleteOneArtificialParticipantChannel';
import { GetManyArtificialParticipantsChannel } from './channels/agent/artificial/participant/GetManyArtificialParticipantsChannel';
import { GetOneArtificialParticipantChannel } from './channels/agent/artificial/participant/GetOneArtificialParticipantChannel';
import { PatchOneArtificialParticipantChannel } from './channels/agent/artificial/participant/PatchOneArtificialParticipantChannel';
import { PostOneArtificialParticipantChannel } from './channels/agent/artificial/participant/PostOneArtificialParticipantChannel';
import { GetManyHumanAssistantsChannel } from './channels/agent/human/assistant/GetManyHumanAssistantsChannel';
import { GetOneHumanAssistantChannel } from './channels/agent/human/assistant/GetOneHumanAssistantChannel';
import { PatchOneHumanAssistantChannel } from './channels/agent/human/assistant/PatchOneHumanAssistantChannel';
import { PostOneHumanAssistantChannel } from './channels/agent/human/assistant/PostOneHumanAssistantChannel';
import { GetManyHumanParticipantsChannel } from './channels/agent/human/participant/GetManyHumanParticipantsChannel';
import { GetOneHumanParticipantChannel } from './channels/agent/human/participant/GetOneHumanParticipantChannel';
import { PatchOneHumanParticipantChannel } from './channels/agent/human/participant/PatchOneHumanParticipantChannel';
import { PostOneHumanParticipantChannel } from './channels/agent/human/participant/PostOneHumanParticipantChannel';
import { PostManyKeyPressEventsChannel } from './channels/event/PostManyKeyPressEventsChannel';
import { PostOneKeyPressEventChannel } from './channels/event/PostOneKeyPressEventChannel';
import { CompleteExchangeChannel } from './channels/exchange/CompleteExchangeChannel';
import { DeleteOneExchangeChannel } from './channels/exchange/DeleteOneExchangeChannel';
import { DeleteOneExchangeTemplateChannel } from './channels/exchange/DeleteOneExchangeTemplateChannel';
import { DismissExchangeChannel } from './channels/exchange/DismissExchangeChannel';
import { GetManyExchangeTemplatesChannel } from './channels/exchange/GetManyExchangeTemplatesChannel';
import { GetManyExchangesChannel } from './channels/exchange/GetManyExchangesChannel';
import { GetOneExchangeChannel } from './channels/exchange/GetOneExchangeChannel';
import { GetOneExchangeTemplateChannel } from './channels/exchange/GetOneExchangeTemplateChannel';
import { PatchOneExchangeTemplateChannel } from './channels/exchange/PatchOneExchangeTemplateChannel';
import { PostOneExchangeChannel } from './channels/exchange/PostOneExchangeChannel';
import { PostOneExchangeTemplateChannel } from './channels/exchange/PostOneExchangeTemplateChannel';
import { StartExchangeChannel } from './channels/exchange/StartExchangeChannel';
import { DeleteOneExperimentChannel } from './channels/experiment/DeleteOneExperimentChannel';
import { GetManyExperimentsChannel } from './channels/experiment/GetManyExperimentsChannel';
import { GetOneExperimentChannel } from './channels/experiment/GetOneExperimentChannel';
import { PatchOneExperimentChannel } from './channels/experiment/PatchOneExperimentChannel';
import { PostOneExperimentChannel } from './channels/experiment/PostOneExperimentChannel';
import { DeleteOneInteractionChannel } from './channels/interaction/DeleteOneInteractionChannel';
import { DeleteOneInteractionTemplateChannel } from './channels/interaction/DeleteOneInteractionTemplateChannel';
import { GetManyInteractionTemplatesChannel } from './channels/interaction/GetManyInteractionTemplatesChannel';
import { GetManyInteractionsChannel } from './channels/interaction/GetManyInteractionsChannel';
import { GetOneInteractionChannel } from './channels/interaction/GetOneInteractionChannel';
import { GetOneInteractionTemplateChannel } from './channels/interaction/GetOneInteractionTemplateChannel';
import { PatchOneInteractionChannel } from './channels/interaction/PatchOneInteractionChannel';
import { PatchOneInteractionTemplateChannel } from './channels/interaction/PatchOneInteractionTemplateChannel';
import { PostOneInteractionChannel } from './channels/interaction/PostOneInteractionChannel';
import { PostOneInteractionTemplateChannel } from './channels/interaction/PostOneInteractionTemplateChannel';
import { SetCurrentExchangeChannel } from './channels/interaction/SetCurrentExchangeChannel';
import { StartInteractionChannel } from './channels/interaction/StartInteractionChannel';
import { GetMessagesChannel } from './channels/message/GetMessagesChannel';
import { PostMessageChannel } from './channels/message/PostMessageChannel';
import { GenerateResponseChannel } from './channels/response/GenerateResponseChannel';
import { GetManySettingsChannel } from './channels/settings/GetManySettingsChannel';
import { GetOneSettingChannel } from './channels/settings/GetOneSettingChannel';
import { PatchOneSettingChannel } from './channels/settings/PatchOneSettingChannel';
import { DeleteOneSimulationChannel } from './channels/simulation/DeleteOneSimulationChannel';
import { GetManySimulationsChannel } from './channels/simulation/GetManySimulationsChannel';
import { GetOneSimulationChannel } from './channels/simulation/GetOneSimulationChannel';
import { PatchOneSimulationChannel } from './channels/simulation/PatchOneSimulationChannel';
import { PostOneSimulationChannel } from './channels/simulation/PostOneSimulationChannel';
import { DeleteOneTriggerChannel } from './channels/trigger/DeleteOneTriggerChannel';
import { GetManyTriggersChannel } from './channels/trigger/GetManyTriggersChannel';
import { GetOneTriggerChannel } from './channels/trigger/GetOneTriggerChannel';
import { PatchOneTriggerChannel } from './channels/trigger/PatchOneTriggerChannel';
import { PostOneTriggerChannel } from './channels/trigger/PostOneTriggerChannel';
import { AppDataSource } from './data-source';
import { IpcChannel } from './interfaces/IpcChannel';
import MenuFactory from './menu';

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

    // Sets up main bindings for our i18next backend
    i18nextBackend.mainBindings(ipcMain, mainWindow, fs);

    const menuBuilder = MenuFactory(mainWindow, app.name);

    menuBuilder.buildMenu(i18nextMainBackend);

    // Set up necessary bindings to update the menu items
    // based on the current language selected
    i18nextMainBackend.on('initialized', (loaded) => {
      i18nextMainBackend.changeLanguage('en');
      i18nextMainBackend.off('initialized'); // Remove listener to this event as it's not needed anymore
    });

    // When the i18n framework starts up, this event is called
    // (presumably when the default language is initialized)
    // BEFORE the "initialized" event is fired - this causes an
    // error in the logs. To prevent said error, we only call the
    // below code until AFTER the i18n framework has finished its
    // "initialized" event.
    i18nextMainBackend.on('languageChanged', (lng) => {
      if (i18nextMainBackend.isInitialized) {
        menuBuilder.buildMenu(i18nextMainBackend);
        mainWindow.webContents.send('languageSignal', lng);
      }
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
  // exchanges
  new PostOneExchangeTemplateChannel(),
  new PostOneExchangeChannel(),
  new GetManyExchangeTemplatesChannel(),
  new GetOneExchangeTemplateChannel(),
  new DeleteOneExchangeTemplateChannel(),
  new GetManyExchangesChannel(),
  new DeleteOneExchangeChannel(),
  new GetOneExchangeChannel(),
  new StartExchangeChannel(),
  new DismissExchangeChannel(),
  new CompleteExchangeChannel(),
  new PatchOneExchangeTemplateChannel(),
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
  new GetManyArtificialAssistantsChannel(),
  new DeleteOneArtificialAssistantChannel(),
  new GetOneArtificialAssistantChannel(),
  new PatchOneArtificialAssistantChannel(),
  //   |_ participant
  new PostOneArtificialParticipantChannel(),
  new GetOneArtificialParticipantChannel(),
  new GetManyArtificialParticipantsChannel(),
  new DeleteOneArtificialParticipantChannel(),
  new PatchOneArtificialParticipantChannel(),
  //   |_ evaluator
  new PostOneArtificialEvaluatorChannel(),
  new GetOneArtificialEvaluatorChannel(),
  new GetManyArtificialEvaluatorsChannel(),
  new DeleteOneArtificialEvaluatorChannel(),
  new PatchOneArtificialEvaluatorChannel(),
  // |_ human
  //   |_ assistant
  new PostOneHumanAssistantChannel(),
  new PatchOneHumanAssistantChannel(),
  new GetOneHumanAssistantChannel(),
  new GetManyHumanAssistantsChannel(),
  //   |_ participant
  new PostOneHumanParticipantChannel(),
  new PatchOneHumanParticipantChannel(),
  new GetOneHumanParticipantChannel(),
  new GetManyHumanParticipantsChannel(),
  // triggers
  new PostOneTriggerChannel(),
  new GetOneTriggerChannel(),
  new GetManyTriggersChannel(),
  new DeleteOneTriggerChannel(),
  new PatchOneTriggerChannel(),
  // interactions
  new PostOneInteractionChannel(),
  new GetOneInteractionChannel(),
  new GetManyInteractionsChannel(),
  new DeleteOneInteractionChannel(),
  new StartInteractionChannel(),
  new PostOneInteractionTemplateChannel(),
  new PatchOneInteractionTemplateChannel(),
  new PatchOneInteractionChannel(),
  new GetOneInteractionTemplateChannel(),
  new GetManyInteractionTemplatesChannel(),
  new DeleteOneInteractionTemplateChannel(),
  new SetCurrentExchangeChannel(),
  // experiments
  new PostOneExperimentChannel(),
  new GetOneExperimentChannel(),
  new GetManyExperimentsChannel(),
  new DeleteOneExperimentChannel(),
  new PatchOneExperimentChannel(),
  // simulations
  new PostOneSimulationChannel(),
  new GetOneSimulationChannel(),
  new GetManySimulationsChannel(),
  new DeleteOneSimulationChannel(),
  new PatchOneSimulationChannel(),
  // settings
  new PatchOneSettingChannel(),
  new GetOneSettingChannel(),
  new GetManySettingsChannel(),
  // events
  new PostOneKeyPressEventChannel(),
  new PostManyKeyPressEventsChannel(),
]);
