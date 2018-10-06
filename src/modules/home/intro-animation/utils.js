export function getSVGCanvasDimensions(svgCanvas) {
    let dimensions = {
        h: svgCanvas.height.animVal.valueInSpecifiedUnits,
        w: svgCanvas.width.animVal.valueInSpecifiedUnits
    }
    return dimensions
}

export function getSVGCanvasCenter(svgCanvas) {
    let canvasW = svgCanvas.width.animVal.valueInSpecifiedUnits
    let canvasH = svgCanvas.height.animVal.valueInSpecifiedUnits
    let centerX = canvasW / 2 - svgEl.getBBox().width / 2
    let centerY = canvasH / 2 - svgEl.getBBox().height / 2
    return { x: centerX, y: centerY }
}

// This function gets an svg element coords after any transformation has been applied to it 
export function getSvgElementCoords(svgCanvas, svgEl) {
    const initialBounds = svgEl.getBBox();

    let point = svgCanvas.createSVGPoint();
    // top-left corner position of element relative to SVG container
    let ctm = svgEl.getCTM()
    // add half of the element width and height to the x and y respectivley to get the center point position of
    // the element (multiply that by the scale cause the boxes are scaled down)
    ctm.e += (boxGroupBounds.width / 2) * ctm.a
    ctm.f += (boxGroupBounds.width / 2) * ctm.d
    let svgPos = point.matrixTransform(ctm)
    // console.log('top - left relative to svg canvas', svgPos)
    return point.matrixTransform(ctm)
}

export function removeSkipAnimationButton(skipAnimButton) {
    skipAnimButton.style.setProperty('opacity', '0', 'important')
    setTimeout(function () { skipAnimButton.remove() }, 1000)
}