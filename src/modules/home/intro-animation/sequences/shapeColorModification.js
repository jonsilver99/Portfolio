import { TimelineMax } from 'gsap/all'

export function fillShape(svgEl, duration) {
    return function () {
        let t = new TimelineMax()
        return t.to(svgEl, duration, { opacity: 1, 'fill-opacity': 1 })
    }
}

export function tweenShapeColor(svgEl, duration, fromColor, toColor) {
    return function () {
        let t = new TimelineMax()
        return t.fromTo(svgEl.childNodes, duration,
            { fill: fromColor },
            { fill: toColor }
        )
    }
}