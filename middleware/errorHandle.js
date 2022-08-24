function notFound(req, res, next) {
    const error = new Error("Not Found");
    res.status(404);
    next(error)
}

function errorHandler(error, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode);

    console.log("\x1b[31m%s\x1b[0m","Error : " +error.message)

    var data = { message: error.message }
    if (process.env.NODE_ENV != 'production') {
        data.stack = error.stack;
    }
    res.json(data)
}


module.exports = {
    notFound,
    errorHandler
}