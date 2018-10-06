import { TweenMax, ModifiersPlugin, TimelineMax } from 'gsap/all'
import * as flubber from 'flubber'

// canvas setup func
import setupSVGCanvas from './setupSVGCanvas'
import { getSVGCanvasDimensions, getSVGCanvasCenter, getSvgElementCoords, removeSkipAnimationButton } from './utils'

// shape classes
import { AnimatableShape } from './models/animateableShape'
import { SimpleShape } from './models/simpleShape'

// animation sequence functions
import { fallfromTop } from './sequences/fallFromTop'
import { shatter } from './sequences/shatter'
import { spread } from './sequences/spread'
import { morphShape } from './sequences/morphShape'
import { normalizeShapes } from './sequences/normalizeShapes'
import { drawStrokes } from './sequences/drawStrokes'
import { fillShape, tweenShapeColor } from './sequences/shapeColorModification'

$(window).on('load', function () {

    /****************************************
         intro animation related events
    ****************************************/
    const skipAnimationButton = $('#skip-intro-animation-button')

    skipAnimationButton.on('click', function () {
        emitter.emit('intro-animation-skipped')
        removeSkipAnimationButton(skipAnimationButton[0])
    })

    emitter.on('intro-animation-finished', function () {
        removeSkipAnimationButton(skipAnimationButton[0])
    })

    emitter.on('camera-facing-changed', function () {
        if (cubeState.get('cameraFacing') == 'left-wall' && !cubeState.get('introAnimationFinished')) {
            beginAnimation()
        }
    })


    // Make sure intro animation begins if it hadnt already for some reason
    setTimeout(function () {
        debugger;
        if (cubeState.get('introAnimationTriggered') == false) {
            beginAnimation()
        }
    }, 2000)



    /*************************
         SVG canvas setup
    *************************/
    // initialize and setup svg canvas
    const svgCanvas = document.getElementById('svg-viewbox-tests')
    setupSVGCanvas(svgCanvas, 'left-wall')
    // on cube resize - resize the svg canvas
    emitter.on('cubeSetup', () => setupSVGCanvas(svgCanvas, 'left-wall'))

    /********************************
         Setup animating objects
    ********************************/
    // extract SVG paths    
    const box1Paths = [...document.getElementById('box1').contentDocument.querySelectorAll("path")]
    const box2Paths = [...document.getElementById('box2').contentDocument.querySelectorAll("path")]
    const box3Paths = [...document.getElementById('box3').contentDocument.querySelectorAll("path")]
    const box4Paths = [...document.getElementById('box4').contentDocument.querySelectorAll("path")]
    const textPaths = [...document.getElementById('svgText').contentDocument.querySelectorAll("path")]

    // create animatable box objects from above svg paths
    const box1 = new AnimatableShape('box', 'mainBox', box1Paths)
    const box2 = new AnimatableShape('box', 'smallbox2', box2Paths)
    const box3 = new AnimatableShape('box', 'smallbox3', box3Paths)
    const box4 = new AnimatableShape('box', 'smallbox4', box4Paths)
    const box5 = new AnimatableShape('box', 'smallbox5', box2Paths)
    const title = new AnimatableShape('text', 'titleGroup', textPaths, undefined, [
        { type: 'text', id: 'myName', paths: new Array(19).fill().map((x, i) => i) },
        { type: 'text', id: 'jobTitle', paths: new Array(17).fill().map((x, i) => i + 18) },
    ])

    const particles = [
        new SimpleShape('rect', 'particle1', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[0].getAttribute('fill') }),
        new SimpleShape('rect', 'particle2', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[1].getAttribute('fill') }),
        new SimpleShape('rect', 'particle3', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[2].getAttribute('fill') }),
        new SimpleShape('rect', 'particle4', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[3].getAttribute('fill') }),
        new SimpleShape('rect', 'particle5', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[4].getAttribute('fill') }),
        new SimpleShape('rect', 'particle6', '', { x: 0, y: 0, height: 60, width: 60, fill: box1.paths[5].getAttribute('fill') }),
    ]

    // interpolation - this is the shape morphing functions
    const txtPathsData = title.paths.map((p) => p.getAttribute('d'))
    box2.addInterpolation('manyToMany', 'boxFacesToLetters', box2.paths, title.paths, [1, 3, 5, 9, 11, 13])
    box3.addInterpolation('manyToMany', 'boxFacesToLetters', box3.paths, title.paths, [2, 4, 6, 8, 10, 12])
    box4.addInterpolation('manyToOne', 'boxToOneLetter', box4.paths, title.paths[0])
    box5.addInterpolation('manyToMany', 'boxFacesToLetters', box5.paths, title.paths, [7, 14, 15, 16, 17])

    // Append shapes to dom
    svgCanvas.appendChild(box2.group)
    svgCanvas.appendChild(box3.group)
    svgCanvas.appendChild(box4.group)
    svgCanvas.appendChild(box5.group)
    particles.forEach(p => svgCanvas.appendChild(p.group))
    svgCanvas.appendChild(box1.group)
    svgCanvas.appendChild(title.group)

    /***********************************
         setup animation sequence
    ***********************************/
    let master;
    setupAnimationTimeline()

    function setupAnimationTimeline() {
        // normalize shape position - make it stick to 0,0 of the svg canvas
        box1.centerPosition()
        box2.centerPosition()
        box3.centerPosition()
        box4.centerPosition()
        box5.centerPosition()
        title.centerPosition()
        particles.forEach(p => p.centerPosition())

        // initialize the animating elements's positions and states
        TweenMax.set(box1.group, { rotation: -190, opacity: 0 })
        TweenMax.set(box2.group, { scale: 0.35, opacity: 0 })
        TweenMax.set(box3.group, { scale: 0.35, rotation: 120, opacity: 0 })
        TweenMax.set(box4.group, { scale: 0.4, rotation: 60, opacity: 0 })
        TweenMax.set(box5.group, { scale: 0.4, rotation: 90, opacity: 0 })
        TweenMax.set(particles.map(p => p.group), { opacity: 0 })

        TweenMax.set(title.group, { scale: 1.75 })
        TweenMax.set(title.subGroups.myName, { opacity: 0 })
        TweenMax.set(title.subGroups.jobTitle, { opacity: 0, "fill-opacity": '0' })
        TweenMax.set(title.subGroups.jobTitle.childNodes, { fill: 'rgb(87, 0, 123)' })

        // create the master animation timeline
        master = new TimelineMax({
            onCompleteParams: ['{self}'],
            paused: true,
            onComplete: function () {
                if (!cubeState.get('introAnimationFinished')) {
                    cubeState.set('introAnimationFinished', true)
                    emitter.emit('intro-animation-finished')
                }
            }
        })
        master.add(fallfromTop(box1))
            .add(shatter(box1), "+=0.65")
            .add(spread([box2, box3, box4, box5], particles), "+=0")
            .add(morphToTitle, "+=3.5")
            .add('drawMyName')
            .add(drawStrokes(title.subGroups.jobTitle, 100, 'oneByOne'), "drawMyName+=2.85")
            .add('drawJobTitle')
            .add(fillShape(title.subGroups.jobTitle, 1), "drawJobTitle+=1.75")

        function morphToTitle() {
            let t = new TimelineMax()
            t.add(morphShape(box4, 'group', 5, txtPathsData[0], title.paths[0].getAttribute('fill')), '+=0')
            t.add(morphShape(box2, 'paths', 5, txtPathsData[0], title.paths[0].getAttribute('fill')), '+=0')
            t.add(morphShape(box3, 'paths', 5, txtPathsData[0], title.paths[0].getAttribute('fill')), '+=0')
            t.add(morphShape(box5, 'paths', 5, txtPathsData[0], title.paths[0].getAttribute('fill')), '+=0')
            t.add(normalizeShapes([box4.group, box2.group, box3.group, box5.group], 2, title.initialPosition.matrix, 1.75), '+=0')
            return t
        }
    }

    // trigger animation
    function beginAnimation() {
        setTimeout(() => {
            if (master) {
                if (master.progress() > 0) {
                    resetAnimation()
                    setTimeout(() => master.play())
                } else {
                    master.play()
                }
                if (cubeState.get('introAnimationTriggered') == false) cubeState.set('introAnimationTriggered', true)
            }
        }, 0);
    }

    // reset animation
    function resetAnimation() {
        // stop timeline
        master.clear()
        TweenMax.killAll()

        // reset animatable shapes - resets the paths and transformations of the svg elements
        box1.reset(true, true, true)
        box2.reset(true, true, true)
        box3.reset(true, true, true)
        box4.reset(true, true, true)
        box5.reset(true, true, true)
        title.reset(true, true, true)
        particles.forEach(p => p.reset())

        // setup the animation objects and timeline once again
        setupAnimationTimeline()
    }

});