'use strict';

class ResponseHandler {

    static success(res, status, message, data, notify) {
        return res.status(status).send({
            success: true,
            message: message,
            data: data,
        });
    }

    static error(res, status, message, errdata, authFailed) {
        return res.status(status).send({
            success: false,
            message: message,
            errData: errdata,
        });
    }
}

module.exports = ResponseHandler;