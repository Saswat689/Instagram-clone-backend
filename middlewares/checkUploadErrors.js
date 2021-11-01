const checkUploadErrors = async (err, req, res, next) => {
  console.log("error =", err);
  if (err) {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
  next();
};

module.exports = checkUploadErrors;
