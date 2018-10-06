const ilegalChars = new RegExp(/[|*&;$%"'`=/\\\\<>(){}+,]/);
const onlyNums = new RegExp(/^[0-9]*$/);
const onlyNums2 = new RegExp(/^\d+$/);
const validEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

export const fieldValidators = {
    name: function (input) {
        let errors = []
        if (input == '') errors.push('Required field')
        if (ilegalChars.test(input)) errors.push('Ilegal chars')
        if (input.length > 25) errors.push('Name too long')
        return (errors.length) ? { valid: false, msg: errors[0] } : { valid: true }
    },
    phone: function (input) {
        let errors = []
        if (!onlyNums.test(input)) errors.push('Invalid phone#')
        if (input.length > 20) errors.push('phone# too long')
        return (errors.length) ? { valid: false, msg: errors[0] } : { valid: true }
    },
    email: function (input) {
        let errors = []
        if (input == '') errors.push('Required field')
        if (ilegalChars.test(input)) errors.push('Ilegal chars')
        if (!validEmail.test(input)) errors.push('Invalid email')
        if (input.length > 50) errors.push('Email too long')
        return (errors.length) ? { valid: false, msg: errors[0] } : { valid: true }
    },
    message: function (input) {
        let errors = []
        if (input == '') errors.push('Required field')
        if (ilegalChars.test(input)) errors.push('Ilegal chars')
        if (input.length > 300) errors.push('Message too long')
        return (errors.length) ? { valid: false, msg: errors[0] } : { valid: true }
    }
}