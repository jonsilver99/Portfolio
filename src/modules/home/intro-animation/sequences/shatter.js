import { TweenMax, TimelineMax } from 'gsap/all'


export function shatter(animShape) {
    return function () {
        const frames = { total: 25 }
        const totalframes = 25
        const pathsConfig = {
            0: new Pathconfig(-33, 43, -69, 0, 0),
            1: new Pathconfig(219, 400, -4, -28, -11),
            2: new Pathconfig(69, 58, -68, 0, -8),
            3: new Pathconfig(0, -13, 24, 5, 2),
            4: new Pathconfig(10, 6, 106, 17, -35),
            5: new Pathconfig(70, 91, 119, 0, 86),
        }

        function Pathconfig(finalTx, finalTy, finalRx, finalRy, finalRz) {
            this.tx = { current: 0, final: finalTx || 0 }
            this.ty = { current: 0, final: finalTy || 0 }
            this.rx = { current: 0, final: finalRx || 0 }
            this.ry = { current: 0, final: finalRy || 0 }
            this.rz = { current: 0, final: finalRz || 0 }
            this.update = function (totalframes) {
                for (let key in this) {
                    this[key].current += this[key].final / totalframes
                }
            }
        }

        function applyTransform(path, config) {
            path.style.transform =
                `translateX(${config.tx.current}px) 
                 translateY(${config.ty.current}px) 
                 rotateX(${config.rx.current}deg) 
                 rotateY(${config.ry.current}deg) 
                 rotateZ(${config.rz.current}deg)`
        }

        return TweenMax.to(frames, 25, {
            total: 0,
            useFrames: true,
            onUpdate: () => {
                animShape.paths.forEach(function (path, i) {
                    applyTransform(path, pathsConfig[i])
                    pathsConfig[i].update(totalframes)
                });
            },
            onComplete: () => TweenMax.to(animShape.group, 5, { opacity: 0 })
        })
    }
}