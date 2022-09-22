const cloudStorage = require('../services/cloud-storage');

const deleteImage = async (fileName, bucketName) => {
  await cloudStorage.bucket(bucketName).file(fileName).delete();
};

module.exports = { deleteImage };
