import './work-style.css'
import { Observable } from 'rxjs'
import { addProjectsToLine, configLineAndScroller } from './line-config'
import { applyScrollAnimation, unsubscribeScrollEvent } from './animations'

$(window).on('load', function () {

    // pseudo scroller
    const pseudoScroller = $('#pseudo-scroller')[0]

    // work section wrapper
    const workSection = $('#work')[0]

    // line wrapper
    const scrollContent = $('#scroll-content')[0]

    // line
    const line = $('#projects-line')[0];

    // global event callbacks
    emitter.on('window-resized', function () {
        resetLine(line);
    })

    // on camera facing right wall 
    emitter.on('camera-facing-changed', function () {
        if (cubeState.get('cameraFacing') == 'right-wall') setTimeout(resetLine(line), 0)
        else if (cubeState.get('cameraFacing') == 'outside-the-box') hideWorkSection(workSection)
    })

    emitter.on('leaving-contact-section', () => revealWorkSection(workSection))

    // on cube resize - initialize the page
    emitter.on('cubeSetup', function () {
        initializePage()
    })

    initializePage()

    function initializePage() {
        // unsubscribe scroll observable
        unsubscribeScrollEvent()
        addProjectsToLine(line)
        configLineAndScroller(scrollContent, line, pseudoScroller)
        applyScrollAnimation(line)
    }
});

function resetLine(line) {
    $(document).scrollTop(2);
    $(document).scrollTop(0);
}

function hideWorkSection(section) {
    $(section).addClass('no-display')
        .prev('.wall-outer-surface').removeClass('no-display')
}

function revealWorkSection(section) {
    $(section).removeClass('no-display')
        .prev('.wall-outer-surface').addClass('no-display')
}
