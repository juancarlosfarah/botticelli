import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app } from 'electron';
import { BrowserWindow, ipcMain, shell } from 'electron';
import { systemPreferences } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import log from 'electron-log/main';
import fs from 'fs';
import i18nextBackend from 'i18next-electron-fs-backend';
import path from 'path';
import { join } from 'path';
import process from 'process';
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
import { DeleteOneAudioChannel } from './channels/audio/DeleteOneAudioChannel';
import { GenerateAudioTranscriptonChannel } from './channels/audio/GenerateAudiosTranscriptionChannel';
import { GetManyAudioChannel } from './channels/audio/GetManyAudiosChannel';
import { PostManyAudiosChannel } from './channels/audio/PostAudiosMessageChannel';
import { PostOneAudioChannel } from './channels/audio/PostOneAudioChannel';
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

log.info('[MAIN] Main process started from:', __filename);

log.info('[main] Botticelli starting...');
log.info(`[BOOT] Started with args: ${JSON.stringify(process.argv)}`);

let isQuitting = false;

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

class Main {
  private mainWindow: BrowserWindow | null = null;
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
          if (process.platform === 'darwin') {
            systemPreferences
              .askForMediaAccess('microphone')
              .then((granted) => {
                log.info('[PERMISSIONS] Microphone access granted:', granted);
                if (!granted) {
                  log.warn('[PERMISSIONS] User denied microphone permission');
                }
              });
          }

          this.createWindow();
          log.info('[MAIN] app is ready');
          app.on('before-quit', () => {
            isQuitting = true;
          });

          if (app.isPackaged) {
            const whisperBin = {
              darwin: 'main',
              linux: 'main',
              win32: 'main.exe',
            }[process.platform];

            const whisperBinaryPath = path.join(
              process.resourcesPath,
              'whisper-bin',
              process.platform,
              whisperBin,
            );

            if (fs.existsSync(whisperBinaryPath)) {
              process.env.WHISPER_CPP_DIR = path.dirname(whisperBinaryPath);
              process.env.WHISPER_CPP_BIN = whisperBinaryPath;

              log.info(
                '[INIT] whisper-node initialized with prebuilt binary:',
                whisperBinaryPath,
              );
            } else {
              log.error(
                '[INIT] whisper-node binary not found at:',
                whisperBinaryPath,
              );

              log.info('[INIT] resourcesPath:', process.resourcesPath);

              const isProd = app.isPackaged;
              const resolvedFfmpegPath = isProd
                ? path.join(process.resourcesPath, 'ffmpeg')
                : require('ffmpeg-static');

              log.info('[INIT] resolved FFmpeg path:', resolvedFfmpegPath);
            }
          }

          app.on('activate', () => {
            // re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (!this.mainWindow || this.mainWindow.isDestroyed()) {
              this.createWindow();
            } else {
              this.mainWindow.show();
              this.mainWindow.focus();
            }
          });

          this.createWindow();

          if (is.dev) {
            installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
              .then((name) => log.debug(`Added Extension:  ${name}`))
              .catch((err) => log.error('An error occurred: ', err));
          }
        });

        app.on('window-all-closed', this.onWindowAllClosed.bind(this));

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
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.show();
      this.mainWindow.focus();
      return;
    }

    log.info('[WINDOW] createWindow called');

    const indexPath = is.dev
      ? path.resolve(__dirname, '..', '..', 'out', 'renderer', 'index.html')
      : path.resolve(__dirname, '..', 'renderer', 'index.html');

    log.info('[DEBUG] Loading file from:', indexPath);
    log.info('[CHECK] Attempting to load:', indexPath);

    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      backgroundColor: '#ffffff',
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        sandbox: false,
        devTools: is.dev,
      },
    });

    const mainWindow = this.mainWindow;

    mainWindow.on('show', () => {
      log.info('[DEBUG] mainWindow show event');
    });

    mainWindow.on('ready-to-show', () => {
      log.info('[DEBUG] mainWindow ready-to-show event');
    });

    mainWindow.on('closed', () => {
      log.info('[DEBUG] mainWindow closed');
      this.mainWindow = null;
    });

    mainWindow.on('close', (e) => {
      if (process.platform === 'darwin' && !isQuitting) {
        e.preventDefault();
        mainWindow.hide();
      }
    });

    mainWindow.webContents.on(
      'did-fail-load',
      (_event, errorCode, errorDescription, validatedURL) => {
        log.error(
          `[LOAD FAIL] Code ${errorCode} on ${validatedURL}: ${errorDescription}`,
        );
      },
    );

    mainWindow.once('ready-to-show', () => {
      log.info('[WINDOW] ready-to-show');
      mainWindow.show();
      mainWindow.focus();
    });

    // Fallback: show after timeout if ready-to-show doesn't fire
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
        mainWindow.show();
        mainWindow.focus();
      }
    }, 3000);

    // Sets up main bindings for our i18next backend
    i18nextBackend.mainBindings(ipcMain, mainWindow, fs);

    const menuBuilder = MenuFactory(mainWindow, app.name);
    menuBuilder.buildMenu(i18nextMainBackend);

    // Set up necessary bindings to update the menu items
    // based on the current language selected
    i18nextMainBackend.on('initialized', () => {
      i18nextMainBackend.changeLanguage('en');
      i18nextMainBackend.off('initialized');
    });

    i18nextMainBackend.on('languageChanged', (lng) => {
      if (i18nextMainBackend.isInitialized) {
        menuBuilder.buildMenu(i18nextMainBackend);
        mainWindow.webContents.send('languageSignal', lng);
      }
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
      if (!fs.existsSync(indexPath)) {
        log.info('[ERROR] index.html does not exist at', indexPath);
      } else {
        log.info('[SUCCESS] index.html found, loading...');
        log.info('[DEBUG] __dirname:', __dirname);
        log.info('[DEBUG] Files in same folder:', fs.readdirSync(__dirname));

        mainWindow.loadFile(indexPath);
      }
    }

    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
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
  // audios
  new PostOneAudioChannel(),
  new GenerateAudioTranscriptonChannel(),
  new PostManyAudiosChannel(),
  new GetManyAudioChannel(),
  new DeleteOneAudioChannel(),
]);
