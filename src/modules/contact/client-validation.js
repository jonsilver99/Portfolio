import { Observable } from 'rxjs'
import { fieldValidators } from './field-validator-funcs'

const fieldsObservers = {}
const invalidFields = {}

export class ClientValidator {

    static initFieldsObservers(inputElements, parentForm) {
        // unsubscribe any previous subscriptions to the field observers
        this.unsubscribeFieldObservers()

        // delete all previous field observers
        this.deleteFieldsObservers()

        // reset invalid fields
        this.resetInvalidFields(inputElements)

        for (let i = 0; i < inputElements.length; i++) {
            let field = inputElements[i]
            let fieldName = $(field).attr('name')

            // initialize all required fields as invalid since they dont have any value initialy
            if (fieldName != 'phone') invalidFields[fieldName] = true

            fieldsObservers[fieldName] = new Observable.fromEvent(field, 'input')
                .do(input => {
                    let validation = fieldValidators[fieldName](input.currentTarget.value)
                    this.setFieldStatus(field, validation)
                })
                .do(() => this.setOverallValidity(parentForm))
                .subscribe(() => null, err => console.log(err))
        }
        this.setOverallValidity(parentForm)
    }

    static setFieldStatus(field, validation) {
        let fieldname = $(field).attr('name')
        let valid = validation.valid;
        if (!valid) {
            $(field).addClass('invalid-form-field')
            $(field).next('label').find('.invalid-msg').html(validation.msg || 'Invalid value')
            invalidFields[fieldname] = true
        }
        else if (valid) {
            $(field).removeClass('invalid-form-field')
            $(field).next('label').find('.invalid-msg').html('')
            if (fieldname in invalidFields) delete invalidFields[fieldname]
        }
    }

    static setOverallValidity(parentForm) {
        let submit = $(parentForm).find("button[type=submit]")
        if (Object.keys(invalidFields).length > 0 && invalidFields.constructor === Object) {
            submit.attr('disabled', true)
        } else {
            submit.attr('disabled', false)
        }
    }

    static unsubscribeFieldObservers() {
        // if no observeables are set quit function
        if (!Object.keys(fieldsObservers).length) return

        for (let fieldname in fieldsObservers) {
            let observer = fieldsObservers[fieldname]
            observer.unsubscribe()
        }
    }

    static deleteFieldsObservers() {
        // if no observeables are set quit function
        if (!Object.keys(fieldsObservers).length) return

        for (let fieldname in fieldsObservers) {
            delete fieldsObservers[fieldname]
        }
    }

    static resetInvalidFields(inputElements) {
        if (inputElements) {
            // the invalid style (red highlight and caption) from all the input elements
            $(inputElements).removeClass('invalid-form-field')
                .next('label').find('.invalid-msg').html('')
        }

        // if no invalid fields are set quit function
        if (!Object.keys(invalidFields).length) return

        for (let fieldname in invalidFields) {
            delete invalidFields[fieldname]
        }
    }

}