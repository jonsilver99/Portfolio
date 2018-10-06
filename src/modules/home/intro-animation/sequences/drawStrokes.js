import { TweenMax } from 'gsap/all'
import Vivus from 'vivus'

export function drawStrokes(svgEl, duration, type) {
    return function () {
        TweenMax.set(svgEl, {
            opacity: 1
        })
        // new Vivus()
        let vivus = new Vivus(svgEl, {
            duration: duration,
            // onReady: () => console.log('ready'),
            type: type || 'sync'
        });
        vivus.setFrameProgress(0)

        let currentFrame = 0
        let frames = { current: 0 }

        return TweenMax.to(frames, duration, {
            current: duration,
            useFrames: true,
            onUpdate: () => {
                vivus.setFrameProgress(currentFrame)
                currentFrame += 1 / duration
            }
        })
    }
}