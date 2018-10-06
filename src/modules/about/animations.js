import { Observable } from 'rxjs'
import { TweenMax, TimelineMax } from 'gsap/all'

let paragraphScroll$ = null; // scroll observable used in paragraph fade animation

export function applyScrollAnimations(container, lines, fadingLinesAnimation, skillsListAnimation) {

    // observe paragraph container div scroll events and fading lines according to scroll position
    let containerHeight = container.scrollHeight - container.clientHeight
    // get the position of the first line in paragraph - each of other lines that scrolls within this position
    // will start to fade
    let fadingposition = lines[0].getBoundingClientRect()

    if (paragraphScroll$) paragraphScroll$ = null
    paragraphScroll$ = new Observable.fromEvent(container, 'scroll')
        .do(scrollEvent => {
            lines.forEach((line, i) => {
                let pos = line.getBoundingClientRect();
                if (pos.y <= fadingposition.y) {
                    let fadeAmount = (fadingposition.y - pos.y) / fadingposition.height
                    fadingLinesAnimation[i].progress(fadeAmount * 0.3)
                }
                if (pos.y > fadingposition.y) {
                    fadingLinesAnimation[i].progress(0)
                }

                if (container.scrollTop == 0) {
                    fadingLinesAnimation[i].progress(0)
                }

                if (Math.ceil(container.scrollTop) >= containerHeight) {
                    fadingLinesAnimation[i].progress(1)
                    skillsListAnimation.timeScale(1).play()
                }

                if (Math.ceil(container.scrollTop) < containerHeight) {
                    skillsListAnimation.timeScale(8).reverse()
                }
            })
        })
        .subscribe((scrollEvent) => null, err => console.log(err))
}


export function unsubscribeScrollEvent() {
    if (paragraphScroll$) paragraphScroll$.unsubscribe()
}


export function createFadingLines(lines) {
    // create fading tween for each line
    let fadingLines = lines.map((line, i) => {
        let fadeState = new TimelineMax({ paused: true })
        let lineLetters = [...line.querySelectorAll('span.letter')]

        return fadeState.staggerFromTo(lineLetters, 10,
            {
                transform: 'rotate(0deg) translateY(0px)',
                opacity: '1',
                filter: 'blur(0px)'
            },
            {
                transform: 'rotate(-45deg) translateY(-200px)',
                opacity: '0.1',
                filter: 'blur(10px)',
            },
            0.25
        )
    })
    return fadingLines
}


export function revealSkillsList(element) {

    // hide skill div
    TweenMax.set(element, { opacity: 0 })

    let t = new TimelineMax({ paused: true })
    let headline = element.querySelector('span#head')
    let skillTabs = [...element.querySelectorAll('li')]

    let revealSkillsDiv = TweenMax.set(element, { opacity: 1 })

    let headlineEntrance = TweenMax.fromTo(headline, 0.2,
        { opacity: 0, x: '-=300', filter: 'blur(5px)' },
        { opacity: 1, x: '+=300', filter: 'blur(0px)' }
    )

    let StaggeredSkillsList = TweenMax.staggerFromTo(skillTabs, 0.5,
        { opacity: 0, x: '+=300', filter: 'blur(5px)' },
        { opacity: 1, x: '-=300', filter: 'blur(0px)' },
        0.075
    )

    return t.add(revealSkillsDiv)
        .add('headlineEntrance')
        .add(headlineEntrance, 'headlineEntrance')
        .add(StaggeredSkillsList, 'headlineEntrance+=0')
}


export function revealPicAndText(elements) {
    let t = new TimelineMax({ paused: true })
    let pictureEntrance = TweenMax.fromTo(elements.pic, 1,
        {
            opacity: 0,
            rotation: '-=260',
            x: '-=300',
        },
        {
            opacity: 1,
            rotation: '+=260',
            x: '+=300',
        }
    )

    let detailsEntrance = TweenMax.fromTo(elements.text, 5, { opacity: 0, }, { opacity: 1, })

    let linesStagger = TweenMax.staggerFromTo([...elements.text.querySelectorAll('.line')], 1,
        {
            opacity: 0,
            x: '+=300'
        },
        {
            opacity: 1,
            x: '-=300'
        },
        0.15
    )

    return t.add('allAtOnce')
        .add(pictureEntrance, 'allAtOnce')
        .add(detailsEntrance, 'allAtOnce')
        .add(linesStagger, 'allAtOnce')
}