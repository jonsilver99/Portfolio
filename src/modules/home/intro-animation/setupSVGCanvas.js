export default function setupSVGCanvas(SVGCanvas, containerWallId) {
    const containerWall = document.getElementById(containerWallId)
    const wallW = containerWall.clientWidth
    const wallH = containerWall.clientHeight

    SVGCanvas.setAttribute('width', wallW)
    SVGCanvas.setAttribute('height', wallH)
    // SVGCanvas.setAttribute('viewBox', `${-wallW / 2} ${-wallH / 2} ${wallW} ${wallH}`)
    SVGCanvas.setAttribute('viewport-fill', 'red')
}