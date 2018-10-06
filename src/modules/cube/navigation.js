$(document).ready(function () {

    // Cube navigation / transformation menu and buttons
    const navigationMenu = $('#navigation-menu');
    const navButtons = $('.nav-button');

    // camera facing to walls dictionary
    const directionToWalls = {
        'face-left': 'left-wall',
        'face-right': 'right-wall',
        'face-back': 'back-wall',
        'outside-the-box': 'outside-the-box',
        'rotating': 'rotating',
        // unsued:
        'face-front': 'front-wall',
        'work-view': 'work-view'
    }

    // Once intro animation is finished reveal the navigation bar
    emitter.on('intro-animation-finished', revealNavigation)

    // if user skips intro animation reveal the navigation bar
    emitter.on('intro-animation-skipped', revealNavigation)

    // on camera facing front wall - initialize the page
    emitter.on('camera-facing-changed', function () {
        if (cubeState.get('cameraFacing') == 'outside-the-box') {
            setTimeout(() => room.classList.add('rotating'), 0)
        } else {
            setTimeout(() => room.classList.remove('rotating'), 0)
        }
    })

    $('#face-left').on('click', () => navigateRoom('face-left'))

    $('#face-back').on('click', () => navigateRoom('face-back'))

    $('#face-right').on('click', () => navigateRoom('face-right'))

    $('#outside-the-box').on('click', () => navigateRoom('outside-the-box'))
    
    debugger;
    navigateRoom('face-left')

    function revealNavigation() {
        if (!cubeState.get('navigationButtonsEnabled')) cubeState.set('navigationButtonsEnabled', true)
        navigationMenu.removeClass('concealed')
    }

    function navigateRoom(nextFacing) {
        let currentlyFacing = cubeState.get('cameraFacing');

        // if cube already facing the requested direction (nextFacing) then quit this function
        if (currentlyFacing == directionToWalls[nextFacing]) return

        // if current facing and next facing are different emit any special - direction specific events
        emitSpecialNavigationEvents(currentlyFacing, nextFacing)

        // higlight selected navigation button
        highlightNavMenu(nextFacing)

        $(room).one(determineAnimationEndEventName('transitionEnd'), function () {
            cubeState.set('cameraFacing', directionToWalls[nextFacing])
            emitter.emit('camera-facing-changed')
        })

        if (room.classList.contains('rotating')) {
            room.classList.remove('rotating')
            setTimeout(function () {
                resetFacingTransformations()
                room.classList.add(nextFacing)
            }, 25);
        } else {
            resetFacingTransformations()
            room.classList.add(nextFacing)
        }
    }

    function emitSpecialNavigationEvents(currentlyFacing, nextFacing) {
        // if cube is currently facing 'outside-the-box' and leaving to another direction - emit
        // the 'leaving-contact-section' event so the contact module will hide the form
        if (currentlyFacing == 'outside-the-box') emitter.emit('leaving-contact-section')

        // if next direction is 'outside-the-box' - emit the 'entering-contact-section' event
        // so the main entry.js module will activate the space background
        if (nextFacing == 'outside-the-box') emitter.emit('entering-contact-section')
    }

    function highlightNavMenu(nextFacing) {
        switch (nextFacing) {
            case 'face-front':
            case 'face-back':
            case 'face-right': {
                navButtons.css('color', 'black')
                break;
            }
            default: {
                navButtons.css('color', 'rgb(221, 221, 221)')
                break;
            }
        }
        navButtons.removeClass('selected')
        $(`#${nextFacing}`).addClass('selected')
    }

    function resetFacingTransformations(exclude) {
        // let toRemove = ['face-left', 'face-front', 'face-right', 'face-back', 'work-view', 'outside-the-box', 'rotating']
        let toRemove = ['face-left', 'face-front', 'face-right', 'face-back', 'work-view', 'outside-the-box']
        if (exclude) toRemove = toRemove.filter(cameraFace => cameraFace != exclude)
        room.classList.remove(...toRemove)
    }

    function determineAnimationEndEventName(animationType) {
        let el = document.createElement("dummy");
        const possibleEventNames = {
            // possible 'animationend' event names on different browsers
            animationEnd: {
                "animation": "animationend",
                "OAnimation": "oAnimationEnd",
                "MozAnimation": "animationend",
                "WebkitAnimation": "webkitAnimationEnd"
            },
            // possible 'transitionend' event names on different browsers
            transitionEnd: {
                "transition": "transitionend",
                "OTransition": "oTransitionEnd",
                "MozTransition": "transitionend",
                "WebkitTransition": "webkitTransitionEnd"
            }
        }

        for (let eventName in possibleEventNames[animationType]) {
            if (el.style[eventName] !== undefined) {
                return possibleEventNames[animationType][eventName];
            }
        }
    }

})