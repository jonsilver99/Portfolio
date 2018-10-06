import { ProjectTile } from './models/projectTile'
import { projectsData } from './currentProjects'


export function addProjectsToLine(line) {
    line = $(line)
    line.find('*').not('#arrow-sign').remove();
    let projectTiles = projectsData.map(p => {
        return new ProjectTile(p.name, p.siteLink, p.gitLink, p.picture)
    })
    projectTiles.forEach(function (tile) {
        line.append(tile.node)
    });
}



export function configLineAndScroller(scrollContent, line, pseudoScroller) {
    scrollContent = $(scrollContent)
    line = $(line)
    let arrow = line.find('#arrow-sign')
    pseudoScroller = $(pseudoScroller)


    // set scroll content Y transformation
    const containerWall = document.getElementById('right-wall')
    const wallW = containerWall.clientWidth
    const wallH = containerWall.clientHeight
    scrollContent.css('transform', `translateX(40%) translateY(${wallH * 0.756}px) rotateX(45deg) rotateZ(45deg)`)

    // set tiles height
    let tiles = line.find('.proj-tile')
    let tileHeight = wallH * 0.5
    tiles.css('height', `${tileHeight}`)

    // set psuedo scroller height
    let windowHeight = window.innerHeight
    let lineHeight = line.height()
    let scrollHeight = windowHeight + lineHeight + tileHeight / 3;
    pseudoScroller.height(scrollHeight)

    // set the arrow sign psuedo elements dimension
    let heightRatio = 0.0565
    let widthRatio = 0.162
    let arrowWidth = scrollContent.width() * widthRatio
    let arrowHeight = lineHeight * heightRatio
    arrow.height(arrowHeight).width(arrowWidth)

}