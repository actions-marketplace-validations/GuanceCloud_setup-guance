// Mock external modules by default
jest.mock('@actions/core');
jest.mock('@actions/tool-cache');
// Mock Node.js core modules
jest.mock('os');

const os = require('os');

const io = require('@actions/io');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

const setup = require('../lib/setup-guance');

// Overwrite defaults
// core.debug = jest
//   .fn(console.log);
// core.error = jest
//   .fn(console.error);

describe('Setup Terraform', () => {
  const HOME = process.env.HOME;
  const APPDATA = process.env.APPDATA;

  beforeEach(() => {
    process.env.HOME = '/tmp/asdf';
    process.env.APPDATA = '/tmp/asdf';
  });

  afterEach(async () => {
    await io.rmRF(process.env.HOME);
    process.env.HOME = HOME;
    process.env.APPDATA = APPDATA;
  });

  test('gets specific version and adds token and hostname on linux, amd64', async () => {
    const version = '0.1.1';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(version);

    tc.downloadTool = jest
      .fn()
      .mockReturnValueOnce('file.zip');

    tc.extractZip = jest
      .fn()
      .mockReturnValueOnce('file');

    os.platform = jest
      .fn()
      .mockReturnValue('linux');

    os.arch = jest
      .fn()
      .mockReturnValue('amd64');

    const versionObj = await setup();
    expect(versionObj.version).toEqual('0.1.1');

    // downloaded CLI has been added to path
    expect(core.addPath).toHaveBeenCalled();
  });

  test('gets specific version and adds token and hostname on windows, 386', async () => {
    const version = '0.1.1';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(version);

    tc.downloadTool = jest
      .fn()
      .mockReturnValueOnce('file.zip');

    io.mv = jest.fn();

    tc.extractZip = jest
      .fn()
      .mockReturnValueOnce('file');

    os.platform = jest
      .fn()
      .mockReturnValue('win32');

    os.arch = jest
      .fn()
      .mockReturnValue('386');

    const versionObj = await setup();
    expect(versionObj.version).toEqual('0.1.1');

    // downloaded CLI has been added to path
    expect(core.addPath).toHaveBeenCalled();
  });

  test('fails when specific version cannot be found', async () => {
    const version = '0.9.9';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(version);

    try {
      await setup();
    } catch (e) {
      expect(core.error).toHaveBeenCalled();
    }
  });

  test('fails when CLI for os and architecture cannot be found', async () => {
    const version = '0.1.1';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(version);

    tc.downloadTool = jest
      .fn()
      .mockReturnValueOnce('file.zip');

    tc.extractZip = jest
      .fn()
      .mockReturnValueOnce('file');

    os.platform = jest
      .fn()
      .mockReturnValue('madeupplat');

    os.arch = jest
      .fn()
      .mockReturnValue('madeuparch');

    try {
      await setup();
    } catch (e) {
      expect(core.error).toHaveBeenCalled();
    }
  });

  test('fails when CLI cannot be downloaded', async () => {
    const version = '0.1.1';

    core.getInput = jest
      .fn()
      .mockReturnValueOnce(version);

    tc.downloadTool = jest
      .fn()
      .mockReturnValueOnce('');

    tc.extractZip = jest
      .fn()
      .mockReturnValueOnce('');

    os.platform = jest
      .fn()
      .mockReturnValue('linux');

    os.arch = jest
      .fn()
      .mockReturnValue('amd64');

    try {
      await setup();
    } catch (e) {
      expect(core.error).toHaveBeenCalled();
    }
  });
});
