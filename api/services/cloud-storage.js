const { Storage } = require('@google-cloud/storage');

const { GCP_PROJECT_ID, GCP_SERVICE_ACCOUNT_KEY } = require('../utils/config');

const storage = new Storage({
  credentials: JSON.parse(GCP_SERVICE_ACCOUNT_KEY),
  projectId: GCP_PROJECT_ID,
});

module.exports = storage;
