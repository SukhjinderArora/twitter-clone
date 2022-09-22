/* eslint-disable max-classes-per-file */
class InvalidFileTypeError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidFileTypeError);
    }
    this.name = 'InvalidFileTypeError';
  }
}

class FileSizeError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileSizeError);
    }
    this.name = 'FileSizeError';
  }
}

module.exports = {
  InvalidFileTypeError,
  FileSizeError,
};
