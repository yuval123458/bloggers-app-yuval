class httpError extends Error {
  constructor(errorMessage, errorCode) {
    super(errorMessage);
    this.code = errorCode;
  }
}

module.exports = httpError;
