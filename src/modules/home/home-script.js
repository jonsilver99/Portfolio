import './home-style.css';
import './intro-animation/introAnimation';




/************************************************************
    work around for the backface visibillity issue on Macs  
************************************************************/
$(document).ready(function () {
    const homeSectionWrapper = $('#home-section-wrapper')

    emitter.on('entering-contact-section', function () {
        homeSectionWrapper.css({
            'backface-visibility': 'hidden',
            '-webkit-backface-visibility': 'hidden'
        })
    })

    emitter.on('camera-facing-changed', function () {
        if (cubeState.get('cameraFacing') != 'outside-the-box') {
            homeSectionWrapper.css({
                'backface-visibility': 'initial',
                '-webkit-backface-visibility': 'initial'
            })
        }
    })

    // emitter.on('leaving-contact-section', function () {
    //     homeSectionWrapper.css({
    //         'backface-visibility': 'initial',
    //         '-webkit-backface-visibility': 'initial'
    //     })
    // })
})