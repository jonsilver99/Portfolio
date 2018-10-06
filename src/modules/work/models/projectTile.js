export class ProjectTile {

    constructor(_name, _siteLink, _gitLink, _picture) {
        this.name = _name
        this.siteLink = _siteLink
        this.gitLink = _gitLink
        this.picture = _picture
        this.node = this.createDomNode(this.name, this.siteLink, this.gitLink, this.picture)
    }

    createDomNode(name, siteLink, gitLink, picture) {
        picture = picture || 'assets/BrowserFrame1.png'

        let node = $(`
            <div class="proj-tile" id="P-${name}">
                <div class="tile-face">
                    <div class="tile-label">
                        <span>${name}</span>
                        <span class="gitLogo">                            
                            <img src="assets/GitHub.png" alt="")>
                        </span>
                    </div>
                </div>
                <a class="siteLink" href=${siteLink} rel="noopener noreferrer" target="_blank"></a>
                <a class="gitLink" href=${gitLink} rel="noopener noreferrer" target="_blank"></a>
            </div>
            `)

        // site screenshot
        node.find('.tile-face')
            .css({ 'background': `url(${picture})`, 'background-size': '100% 100%' })

        if (picture == 'assets/BrowserFrame1.png') {
            node.find('.tile-face').css({ 'border': 'none' })
        }

        // events
        node.find('.tile-face').on('click', () => node.find('.siteLink')[0].click())
        node.find('.gitLogo > img')
            .hover(
            function () {
                $(this).attr('src', "assets/GitHub-lit.png")
            },
            function () { $(this).attr('src', "assets/GitHub.png") }
            )
            .on('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                node.find('a.gitLink')[0].click()
            })
        return node
    }
}