import { Observable } from 'rxjs'
import { TweenMax, TimelineMax } from 'gsap/all'

let lineScroll$ = null; // scroll observable used in paragraph fade animation

export function applyScrollAnimation(line) {
    line = $(line)

    if (lineScroll$) lineScroll$ = null

    // observe scroll and react
    lineScroll$ = Observable.fromEvent(window, 'scroll')
        .do(scrollEvent => {
            let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
            if (cubeState.get('cameraFacing') == 'right-wall') {
                scrollLine(line, currentScrollPos)
            }
        })
        .subscribe((scrollEvent) => null, err => console.log(err))

    let tiles = line.find('.tile-face')

}

function scrollLine(line, position) {
    if (position > 0) line.addClass('scrolling')
    else line.removeClass('scrolling')
    position = -(position)
    line.css('top', position + "px")
}

export function unsubscribeScrollEvent() {
    if (lineScroll$) lineScroll$.unsubscribe()
}

