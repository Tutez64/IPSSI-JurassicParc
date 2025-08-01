function errorHandler(err, req, res, next) {
    console.error(err.stack);  // Log the error for debugging
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message  // Hide details in prod
    });
}

module.exports = errorHandler;