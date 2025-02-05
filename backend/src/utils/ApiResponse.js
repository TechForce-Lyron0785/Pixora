class ApiResponse {
  constructor(
    statusCode,
    message = "Success",
    data = null,
    metadata = null
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
    this.responseType = this.getResponseType(statusCode);
    this.metadata = metadata; // For pagination, counts etc.
    this.timestamp = new Date().toISOString();
  }

  getResponseType(statusCode) {
    switch(statusCode) {
      case 200:
        return 'OK';
      case 201:
        return 'CREATED';
      case 204:
        return 'NO_CONTENT'; 
      case 206:
        return 'PARTIAL_CONTENT';
      case 304:
        return 'NOT_MODIFIED';
      default:
        return 'SUCCESS';
    }
  }
}

export { ApiResponse };
