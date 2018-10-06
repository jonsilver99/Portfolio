'use strict';

const restrictions = require('./restrictions')
const illegalChars = restrictions.ilegalChars
const requiredFields = restrictions.requiredFields
const maxLengths = restrictions.maxLengths
const validEmail = restrictions.validEmail
const onlyNums = restrictions.onlyNums

class InputValidator {

    static processData(data) {
        let errors = {}
        // if no data given
        if (!data || Object.keys(data).length < 1) {
            errors.noInput = 'no input given or input object is empty'
            return errors
        }

        // validate all fields
        for (let fieldName in data) {
            let validationStatus = this.isValid(fieldName, data[fieldName])
            if (validationStatus !== 'valid') {
                errors[fieldName] = validationStatus
            }
        }
        return (Object.keys(errors).length === 0 && errors.constructor === Object) ? 'all data is valid' : errors;
    }

    static isValid(fieldName, fieldValue) {
        let fieldErrors = [];
        if (requiredFields.includes(fieldName)) {
            if (this.hasNoValue(fieldValue)) {
                fieldErrors.push('No input given');
            }
        }

        if (this.ilegalValue(fieldValue, illegalChars)) {
            fieldErrors.push('Input contains ilegal chars');
        }


        if (this.invalidLength(fieldValue, maxLengths[fieldName])) {
            fieldErrors.push('input is too long');
        }

        if (fieldName == 'email') {
            if (this.invalidEmail(fieldValue))
                fieldErrors.push('invalid email address');
        }

        if (fieldName == 'phone') {
            if (this.invalidPhone(fieldValue))
                fieldErrors.push('invalid phone number');
        }

        return (fieldErrors.length > 0) ? fieldErrors : 'valid';
    }


    static hasNoValue(input) {
        return (input == null || input == '') ? true : false;
    }

    static ilegalValue(input, ilegal) {
        return (ilegal.test(input)) ? true : false;
    }

    static invalidLength(input, maxLengthAllowed) {
        return (input.length > maxLengthAllowed) ? true : false;
    }

    static invalidEmail(input) {
        return (validEmail.test(input) == false) ? true : false;
    }

    static invalidPhone(input) {
        return (onlyNums.test(input) == false) ? true : false;
    }

    static sanitizeValues(input, replaceValue) {
        let sanitized = input.replace(sanitizeChars, replaceValue)
        return sanitized;
    }
}

module.exports = InputValidator;