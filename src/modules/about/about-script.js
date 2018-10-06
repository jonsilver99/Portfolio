import './about-style.css'
import aboutText from './aboutText'
import { initializeParagraph, paragraphToLines, formatText } from './paragraphConfig'
import { applyScrollAnimations, revealPicAndText, unsubscribeScrollEvent, revealSkillsList, createFadingLines } from './animations'
import { hideItems, resetPositionAnimations, lockElementInteractions, unlockElementInteractions, revealContentLoader, removeContentLoader } from './utils'
import { createSkillsDiv } from './createSkillsList'


$(window).on('load', function () {
    const aboutSection = $('#about')[0];
    const contentLoader = $(aboutSection).find('.cnt-loader')[0]
    const pictureDiv = $('#picture')[0];
    const detailsDiv = $('#details')[0];
    const fadingParagraph = $('#fading-para')[0];
    hideItems([pictureDiv, detailsDiv, $('#my-skills')[0]])

    let introduction; // reveal page items animation

    // on camera facing front wall - initialize the page
    emitter.on('camera-facing-changed', function () {
        hideItems([pictureDiv, detailsDiv, $('#my-skills')[0]])
        if (cubeState.get('cameraFacing') == 'back-wall') {
            setTimeout(initializePage, 50);
        } else {
            revealContentLoader(contentLoader)
        }
    })

    // on cube resize - initialize the page
    emitter.on('cubeSetup', function () {
        hideItems([pictureDiv, detailsDiv, $('#my-skills')[0]])
        if (cubeState.get('cameraFacing') == 'back-wall') {
            setTimeout(initializePage, 0);
        }
    })


    function initializePage() {
        // lock paragraph so it cant scroll
        lockElementInteractions(detailsDiv)

        // unsubscribe scroll observable
        unsubscribeScrollEvent()

        // nullify introduction animation timeline
        if (introduction) introduction = null

        // reset all previously animated elements
        resetPositionAnimations([pictureDiv, detailsDiv])

        // config paragraph to lines
        initializeParagraph(fadingParagraph, aboutText)
        formatText(fadingParagraph)

        // create and append skills div, and setup the skill-list animation
        let skillsDiv = createSkillsDiv(aboutSection, detailsDiv)

        // create the fading lines and skills list animations
        let fadingLinesAnimation = createFadingLines([...fadingParagraph.querySelectorAll('span.line')])
        let skillsListAnimation = revealSkillsList(skillsDiv)

        // apply animations on scrolling events
        applyScrollAnimations(detailsDiv, [...fadingParagraph.querySelectorAll('span.line')], fadingLinesAnimation, skillsListAnimation)

        // reveal page elements
        introduction = revealPicAndText({ pic: pictureDiv, text: detailsDiv })
        introduction.play()

        // hide content loader
        removeContentLoader(contentLoader)

        // unlock paragraph 
        unlockElementInteractions(detailsDiv)
    }
})