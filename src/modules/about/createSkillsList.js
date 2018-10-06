
export function createSkillsDiv(mainContainer, positionRefElement) {
    // if already appended - remove
    if ($('#my-skills')) $('#my-skills').remove()

    // create
    let skillsDiv = $(getSkillHTML())

    // determine position
    let leftOffset = positionRefElement.offsetLeft
    let width = positionRefElement.clientWidth

    skillsDiv.offset({ top: 0, left: leftOffset })
    skillsDiv.width(width)

    // determine height
    let height = $(mainContainer).height() / 2;
    $(skillsDiv).height(height)

    // append
    $(mainContainer).append(skillsDiv)

    return skillsDiv[0]
}



function getSkillHTML() {
    return `<div id="my-skills">
                <span id="head">Skills</span>
                <ul>
                    <li>Javascript</li>
                    <li>jQuery</li>
                    <li>Typescript</li>
                    <li>Angular</li>
                    <li>EJS</li>
                    <li>Node.js</li>
                    <li>PHP</li>
                    <li>MongoDB</li>
                    <li>MySQL</li>
                    <li>AJAX</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Bootstrap</li>
                    <li>Webpack</li>
                    <li>Inkscape</li>
                    <li>Photoshop</li>
                    <li>Premiere</li>
                    <li>After effects</li>
                </ul>
            </div>`
}