class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message = "Record Already Exists") {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "Username or password is wrong!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthenticated(message = "You are not authenticated") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "You are not authorized") {
    return new CustomErrorHandler(403, message);
  }

  static notFound(message = "404 Not Found!") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "Internal Server Error!") {
    return new CustomErrorHandler(500, message);
  }
}

module.exports = CustomErrorHandler;
