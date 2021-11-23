import { CustomError } from '../errors/custom-errors';
require('dotenv').config();

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        msg: "internal server error",
        ...(process.env.DEBUG_MODE && {originalError: err.message})
    }
    if (err instanceof CustomError){ // if error is from customError
        statusCode = err.statusCode;
        data = {
            msg: err.message
        }
    }
    return res.status(statusCode).json({msg: data});
}

export default errorHandler;