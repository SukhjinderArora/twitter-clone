const util = require('util');

const cloudStorage = require('../services/cloud-storage');
const { GCP_STORAGE_BUCKET_ID } = require('./config');

const bucket = cloudStorage.bucket(GCP_STORAGE_BUCKET_ID);

const uploadImage = (file, fileName, bucketName) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = util.format(
          `https://storage.googleapis.com/${bucketName}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on('error', () => {
        reject(new Error('Unable to upload image, something went wrong'));
      })
      .end(buffer);
  });

module.exports = { uploadImage };
