import { TweenMax, TimelineMax } from 'gsap/all'

(function () {

    // Cube navigation / transformation menu and buttons
    const navigationMenu = $('#navigation-menu');
    const navButtons = $('.nav-button');

    // Once intro animation is finished reveal the navigation bar
    emitter.on('intro-animation-finished', function () {
        if (!cubeState.get('navigationButtonsEnabled')) cubeState.set('navigationButtonsEnabled', true)
        navigationMenu.css('opacity', '1')
    })

    // on camera facing front wall - initialize the page
    emitter.on('camera-facing-changed', function () {

        if (cubeState.get('cameraFacing') == 'outside-the-box') {
            // setTimeout(() => room.classList.add('rotating'), 0)
        } else {
            // setTimeout(() => room.classList.remove('rotating'), 0)
        }
    })

    $('#face-left').on('click', () => navigateRoom('left-wall'))

    $('#face-right').on('click', () => navigateRoom('right-wall'))

    $('#face-front').on('click', () => navigateRoom('front-wall'))

    $('#face-back').on('click', () => navigateRoom('back-wall'))

    $('#outside-the-box').on('click', () => navigateRoom('outside-the-box'))

    navigateRoom('left-wall')

    function navigateRoom(faceDirection) {

        const wallFacingConfig = {
            'unInitialized': {},
            "left-wall": { z: '53vw', x: '0vw', y: '0vw', rotationY: '-90deg', rotationZ: '0deg', rotationX: '0deg' },
            "back-wall": { z: '48vw', x: '0vw', y: '0vw', rotationY: '0deg', rotationZ: '0deg', rotationX: '0deg' },
            "right-wall": { z: '51vw', x: '1vw', y: '0vw', rotationY: '90deg', rotationZ: '0deg', rotationX: '0deg' },
            "front-wall": { z: '48vw', x: '1vw', y: '1vw', rotationY: '180deg', rotationZ: '0deg', rotationX: '0deg' },
            "outside-the-box": { z: '-185vw', x: '-80vw', y: '18vw', rotationY: '10deg', rotationZ: '5deg', rotationX: '5deg' }
        }

        // if cube already facing the requested direction (faceDirection) then quit this function
        if (cubeState.get('cameraFacing') == faceDirection) return

        // higlight selected navigation button
        highlightNavMenu(faceDirection)

        // transform room 
        let previousFace = cubeState.get('cameraFacing')
        return TweenMax.fromTo(room, 1,
            wallFacingConfig[previousFace],
            wallFacingConfig[faceDirection]
        )
    }

    function highlightNavMenu(faceDirection) {
        switch (faceDirection) {
            case 'front-wall':
            case 'back-wall':
            case 'right-wall': {
                navigationMenu.css('color', 'black')
                break;
            }
            default: {
                navigationMenu.css('color', 'rgb(221, 221, 221)')
                break;
            }
        }
        navButtons.removeClass('selected')
        $(`#${faceDirection}`).addClass('selected')
    }

    function resetFacingTransformations(exclude) {
        // let toRemove = ['face-left', 'face-front', 'face-right', 'face-back', 'work-view', 'outside-the-box', 'rotating']
        let toRemove = ['face-left', 'face-front', 'face-right', 'face-back', 'work-view', 'outside-the-box']
        if (exclude) toRemove = toRemove.filter(cameraFace => cameraFace != exclude)
        room.classList.remove(...toRemove)
    }

})()







/* Wall facing modes */
// left transform: translateZ(53vw) translateX(0vw) rotateY(-90deg);

// back transform: translateZ(48vw) translateY(0vw) rotateY(0deg);

// right transform: translateZ(51vw) translateX(1vw) rotateY(90deg);

// front transform: translateZ(48vw) translateY(0vw) rotateY(180deg);

// outside-the-box transform: translateZ(-185vw) translateX(-80vw) translateY(18vw) rotateY(10deg) rotateZ(5deg) rotateX(5deg);

// rotating
// transform: translateZ(-185vw) translateX(-80vw) translateY(18vw) rotateY(10deg) rotateZ(5deg) rotateX(5deg);
// transform: translateZ(-185vw) translateX(-80vw) translateY(18vw) rotateY(360deg) rotateZ(5deg) rotateX(5deg);

/* 'unInitialized' | 'left-wall' | 'back-wall' |'right-wall' | 'front-wall' | 'outside-the-box'  */