exports.success = (message, results, statusCode) => {
    return {
      message,
      success: true,
      code: statusCode,
      results
    };
  };
