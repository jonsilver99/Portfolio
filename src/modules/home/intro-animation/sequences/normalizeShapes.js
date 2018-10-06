import { TweenMax, TimelineMax } from 'gsap/all'

export function normalizeShapes(shapes, duration, positionMatrix, scale) {

    return function () {
        // reset all rotations
        shapes.forEach(s => {
            let transformation = getTranslatedMatrix(s)
            TweenMax.set(s, { rotation: -transformation.rotation })
        })
        // if scale is set replace initial scale with it
        if (scale && !isNaN(scale)) {
            let matrixVals = positionMatrix.replace(/[matrix()]/g, "").split(',').map(val => parseFloat(val))
            matrixVals[0] = scale
            matrixVals[3] = scale
            matrixVals[4] *= scale
            matrixVals[5] *= scale
            positionMatrix = `matrix(${matrixVals[0]}, ${matrixVals[1]}, ${matrixVals[2]}, ${matrixVals[3]}, ${matrixVals[4]}, ${matrixVals[5]})`
        }

        let t = new TimelineMax()

        return t.staggerTo(shapes, duration, {
            transform: positionMatrix,
        }, 0.25)

    }

    function getTranslatedMatrix(shape) {
        let matrix = getMatrix(shape)

        let a = matrix.values[0] //scaleX
        let b = matrix.values[1] //skewY
        let c = matrix.values[2] //skewX
        let d = matrix.values[3] //scaleY
        let e = matrix.values[4] //translateX
        let f = matrix.values[5] //translateY

        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

        return {
            scaleX: a,
            scaleY: d,
            translateX: e,
            translateY: f,
            rotation: angle,
            asMatrix: matrix,
            get: function (prop, units) {
                return (prop == 'asMatrix') ? this.asMatrix : `${this[prop]}${units}`
            }
        }
    }

    function getMatrix(shape) {

        let matrixData = {
            string: undefined,
            values: undefined
        }
        const computedStyle = window.getComputedStyle(shape)

        // get matrix as string
        let matrixStr = computedStyle['transform'] ||
            computedStyle.getPropertyValue("-webkit-transform") ||
            computedStyle.getPropertyValue("-moz-transform") ||
            computedStyle.getPropertyValue("-ms-transform") ||
            computedStyle.getPropertyValue("-o-transform") ||
            computedStyle.getPropertyValue("transform");

        if (!matrixStr) throw 'Couldnt get computed style / matrix string'
        if (matrixStr == 'none') matrixStr = 'matrix(1, 0, 0, 1, 0, 0)'

        // get matrix as values array
        let matrixVal = matrixStr.replace(/[matrix()]/g, "").split(',').map(val => parseFloat(val))
        // let matrixVal = matrixStr.split('(')[1].split(')')[0].split(',').map(val => parseFloat(val))
        // let matrixVal = matrixStr.match(/([-+]?[\d\.]+)/g).map(val => parseFloat(val))

        matrixData.string = matrixStr
        matrixData.values = matrixVal

        return matrixData
    }
}