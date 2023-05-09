const core = require('@actions/core');

const setup = require('./lib/setup-guance');

(async () => {
  try {
    await setup();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
