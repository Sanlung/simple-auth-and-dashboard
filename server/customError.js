class CustomApiError extends Error {
  constructor(code, message) {
    super(message);
    this.statusCode = code;
  }
}

module.exports = CustomApiError;
