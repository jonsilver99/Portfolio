import './generalStyle.css';
import './outerspace.css';
import './content-loader.css';
import './content-loader-grid.css';

// modules
import './cube/cube-script';
import './home/home-script';
import './about/about-script';
import './work/work-script';
import './contact/contact-script';

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onresize = function () {
    emitter.emit('window-resized')
}

$(document).ready(function () {
    scrollDocumentToTop()
});

emitter.on('camera-facing-changed', function () {
    scrollDocumentToTop()
    // if camera not facing outside the box turn off the outerspace background
    if (cubeState.get('cameraFacing') != 'outside-the-box') {
        deactivateOuterSpaceBackground()
    }
})

emitter.on('entering-contact-section', activateOuterSpaceBackground)

function scrollDocumentToTop() {
    $(document).scrollTop(0);
}

function activateOuterSpaceBackground() {
    $('#stars, #stars2, #stars3').each(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active')
        }
    });
}

function deactivateOuterSpaceBackground() {
    $('#stars, #stars2, #stars3').each(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        }
    });
}