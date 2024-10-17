const globalErrHandler = (err, req, res, next ) => {
    const statusCode = err.statusCode ? err.statusCode : 500;
    const status = err.status ? err.status : 'Failed...!';
    const message = err.message;
    const stack = err.stack;

    //Send response
    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

module.exports = globalErrHandler;