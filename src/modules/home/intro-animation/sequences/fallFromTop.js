import { TweenMax, TimelineMax } from 'gsap/all'

export function fallfromTop(animShape) {
    return function () {
        TweenMax.set(animShape.group, { opacity: 1 })

        let t = new TimelineMax()
        t.add(TweenMax.fromTo(animShape.group, .65,
            {
                x: '+=180',
                y: '-=450',
                rotation: 0,
                scale: 0.75
            },
            {
                ease: Linear.easeNone,
                x: animShape.initialX,
                y: animShape.initialY,
                rotation: -190,
                scale: 1
            },
        ))
        return t
    }
}