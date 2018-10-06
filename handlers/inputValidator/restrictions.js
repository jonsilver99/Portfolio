'use strict'
const restrictions = {
    ilegalChars: new RegExp(/[|*&;$^?%"'`=/\\\\<>(){}\\-\\+,]/g),

    onlyNums: new RegExp(/^[0-9]*$/),

    validEmail: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),

    requiredFields: [
        "name",
        "email",
        "message"
    ],

    maxLengths: {
        name: 25,
        email: 50,
        phone: 20,
        message: 300,
    }
};

module.exports = restrictions