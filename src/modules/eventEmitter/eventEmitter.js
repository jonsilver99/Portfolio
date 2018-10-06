const emitter = {
    on: function (eventName, callback) {
        if (!this[eventName] || !Array.isArray(this[eventName])) {
            this[eventName] = []
        }
        this[eventName].push(callback)
    },

    emit: function (eventName, param) {
        for (let i = 0; i < this[eventName].length; i++) {
            let subscribedCB = this[eventName][i]
            if (param) subscribedCB(param);
            else subscribedCB();
        }
    }
}

module.exports = emitter
// change this so that the emitter holds an 'events' property 