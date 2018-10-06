import { TweenMax, ModifiersPlugin, TimelineMax } from 'gsap/all'

export function morphShape(animatableShape, morphType, duration, pathData, fill) {

    return function () {
        let morphElem = animatableShape.paths

        if (morphType == 'group') {
            morphElem.forEach(path => {
                if (path.id != '0') TweenMax.set(path, { opacity: 0 })
                // if (path.id != '0') path.remove()
            })
        }

        let tween = new TimelineMax()
        let framesHolder = {}
        morphElem.forEach(el => { framesHolder[el.id] = { morphFrame: 0, tweenCount: 0 } })

        return tween.staggerTo(morphElem, duration,
            {
                data: { morphFrame: 0, tweenCount: 0 },
                attr: {
                    d: pathData,
                    fill: fill
                },
                modifiers: {
                    d: (d, targetElem) => {
                        if (morphType == 'group') {
                            return animatableShape.interpolations.boxToOneLetter(framesHolder[targetElem.id].morphFrame)
                        } else {
                            let charIndex = parseInt(targetElem.id)
                            return animatableShape.interpolations.boxFacesToLetters[charIndex](framesHolder[targetElem.id].morphFrame)
                        }
                    },
                },
                onUpdateParams: ['{self}'],
                onUpdate: (self) => {
                    // framesHolder[self.target.id].morphFrame += 0.05                                
                    framesHolder[self.target.id].morphFrame += self.progress()
                    framesHolder[self.target.id].tweenCount++
                },
            },
            0.25
        );
    }
}