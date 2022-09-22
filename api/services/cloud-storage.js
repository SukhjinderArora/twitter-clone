const { Storage } = require('@google-cloud/storage');
const path = require('path');

const serviceKey = path.join(__dirname, '..', 'configs', 'gcp-keys.json');

const { GCP_PROJECT_ID } = require('../utils/config');

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: GCP_PROJECT_ID,
});

module.exports = storage;
