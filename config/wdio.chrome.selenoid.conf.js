const exec = require('child_process').exec;
const allure = require('allure-commandline');
const selenoidVideo = require('wdio-selenoid-video-reporter').default;

exports.config = {
  runner: 'local',
  specs: [
      './test/specs/**/*.spec.js',
      //'./test/specs/structure/StructureProperties.spec.js'
  ],
  suites: {
      superuser: [
          './test/specs/**/*.spec.js',
      ],
      user: [
          './test/specs/**/*.spec.js',
      ]
  },
  // Patterns to exclude.
  exclude: [
      // 'path/to/excluded/files'
  ],
  maxInstances: 8,
  maxInstancesPerCapability: 1,
  capabilities: [{
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      maxInstances: 4,
      //
      browserName: 'chrome',
      'goog:chromeOptions': {
          args: [
            '--disable-infobars',
            '--window-size=1366,768',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
          ],
          prefs: {
              'directory_upgrade': true,
              'prompt_for_download': false,
          }
      },
      'selenoid:options': {
        enableVNC: true,
        enableVideo: true,
        screenResolution: '1366x768x24',
    }
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'https://localhost',
  waitforTimeout: 15000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  hostname: 'localhost',
  port: 4444,
  path: "/wd/hub",
  framework: 'mocha',
  mochaOpts: {
      ui: 'bdd',
      timeout: 600000
  },

  beforeSession: function (config, capabilities, specs) {
    if (capabilities['selenoid:options'] && specs.length > 0) {
        capabilities['selenoid:options'].name = path.parse(specs[0]).name;
    }
    },
  beforeSession() { // before hook works as well
      require('expect-webdriverio').setOptions({
          wait: 5000
      });
  },
  before: async function (capabilities, specs) {
      await browser.setTimeout({ 'pageLoad': 20000 });
  },
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
      if (error) {
          await browser.takeScreenshot();
      }
  },
  // afterStep: function (test, scenario, { error, duration, passed }) {
  //     browser.takeScreenshot();
  // },
  onComplete: async function() {
      const reportError = new Error('Could not generate Allure report');
      const generation = allure(['generate', 'allure-results', '--clean']);

      return await new Promise(async (resolve, reject) => {
          const generationTimeout = setTimeout(
              () => reject(reportError),
              5000);
          exec('cp -R allure-report/history allure-results');
          generation.on('exit', function(exitCode) {
              clearTimeout(generationTimeout);

              if (exitCode !== 0) {
                  return reject(reportError);
              }

              console.log('Allure report successfully generated');
              resolve();
          });
      });
  },
  reporters: [['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false,
    }], 'spec',[selenoidVideo, {
        saveAllVideos: true,
    }]]
}