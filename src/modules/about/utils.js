export function hideItems(items) {
    return TweenMax.set(items, { opacity: 0 })
}

export function revealItems(items) {
    return TweenMax.set(items, { opacity: 1 })
}

export function revealContentLoader(loader) {
    if ($(loader).hasClass('no-display')) $(loader).removeClass('no-display')
}

export function removeContentLoader(loader) {
    if (!$(loader).hasClass('no-display')) $(loader).addClass('no-display')
}

export function resetPositionAnimations(elements) {
    if (!Array.isArray(elements)) elements = [elements]
    elements.forEach(function (element) {
        element.style.transform = ''
        element.style.opacity = ''
        TweenMax.set(element, { transform: 'matrix(1, 0, 0, 1, 0, 0)', opacity: 1 })
        // element.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
    });
}

export function lockElementInteractions(element) {
    $(element).scrollTop(0)
    $(element).addClass('locked-element')
    // console.log('element locked')
}

export function unlockElementInteractions(element) {
    $(element).scrollTop(0)
    $(element).removeClass('locked-element')
    // console.log('element unlocked')
}


function preventDefault(e) {
    return function (e) {
        e = e || element.event;
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
    }
}


function preventDefaultForScrollKeys(e) {
    return function (e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
}

function disableScroll(element) {
    // older FF
    if (element.addEventListener) {
        element.addEventListener('DOMMouseScroll', preventDefault(e), false);
    }
    element.onwheel = preventDefault(e); // modern standard
    element.onmousewheel = preventDefault(e); // older browsers, IE
    element.ontouchmove = preventDefault(e);; // mobile
    document.onmousewheel = preventDefault(e);
    document.onkeydown = preventDefaultForScrollKeys(e);
}

function enableScroll(element) {
    if (element.removeEventListener) {
        element.removeEventListener('DOMMouseScroll', preventDefault(e), false);
    }
    element.onmousewheel = null;
    element.onwheel = null;
    element.ontouchmove = null;
    document.onmousewheel = null;
    document.onkeydown = null;
}
