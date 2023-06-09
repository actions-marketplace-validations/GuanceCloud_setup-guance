// Node.js core
const os = require('os');

// External
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

const binaryName = 'guance';

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function getArch () {
  const osArch = os.arch();
  const mappings = {
    x32: '386',
    x64: 'amd64'
  };
  return mappings[osArch] || osArch;
}

// os in [darwin, linux, windows...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function getOS () {
  const osPlatform = os.platform();
  const mappings = {
    win32: 'windows'
  };
  return mappings[osPlatform] || osPlatform;
}

async function downloadCLI (url) {
  core.debug(`Downloading Guance CLI from ${url}`);
  const pathToCLIZip = await tc.downloadTool(url);

  core.debug('Extracting Guance CLI zip file');

  const pathToCLI = await tc.extractTar(pathToCLIZip);

  core.debug(`Guance CLI path is ${pathToCLI}.`);

  if (!pathToCLIZip || !pathToCLI) {
    throw new Error(`Unable to download Guance CLI from ${url}`);
  }

  return pathToCLI;
}

function buildUrl (release) {
  return `https://github.com/GuanceCloud/guance-cli/releases/download/v${release.version}/${binaryName}_${release.version}_${release.os}_${release.arch}.tar.gz`;
}

async function run () {
  try {
    const platform = getOS();
    const arch = getArch();
    const version = core.getInput('version');

    core.debug(`Getting build for Guance CLI version ${version}: ${platform} ${arch}`);

    const release = {
      os: platform,
      arch,
      version
    };

    // Download requested version
    const pathToCLI = await downloadCLI(buildUrl(release));

    // Add to path
    core.addPath(pathToCLI);
    return release;
  } catch (error) {
    core.error(error);
    throw error;
  }
}

module.exports = run;
