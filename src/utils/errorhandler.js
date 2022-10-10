exports.ErrorHandler = (message,  statusCode) => {
    return {
      message,
      success: false,
      code: statusCode,
    };
  };