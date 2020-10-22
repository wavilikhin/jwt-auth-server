class ErrorResponse extends Error {
  constructor(name, statusCode) {
    super();
    this.name = name || 'CridentialsError';
    this.statusCode = statusCode || 403;
  }
}

module.exports = { ErrorResponse };
