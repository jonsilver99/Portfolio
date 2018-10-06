const CubeState = {

    cameraFacing: 'unInitialized', /* 'unInitialized' | 'left-wall' | 'back-wall' |'right-wall' | 'front-wall' | 'outside-the-box'  */
    cameraPreviousFacing: '', /* 'unInitialized' | 'left-wall' | 'back-wall' |'right-wall' | 'front-wall' | 'outside-the-box' */
    introAnimationTriggered: false,
    introAnimationFinished: false,
    navigationButtonsEnabled: false,

    get: (propName) => {
        return CubeState[propName]
    },

    set: (propName, propValue) => {
        if (propName == 'cameraFacing' && propValue) {
            CubeState.cameraPreviousFacing = CubeState.cameraFacing
        }
        CubeState[propName] = propValue
        console.log(`current facing ${CubeState.cameraFacing}`, `previous facing ${CubeState.cameraPreviousFacing}`)
    }

}

module.exports = CubeState
