import './style.css'
import { Observable } from 'rxjs'

export default function kissMyAss1() {
    // contentRoot.append(img);
}

let tx = 0;
let ty = -50;
let tz = 0;

$(document).ready(function () {

    const tile = $('#projects-tile');
    let lastScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    window.onresize = function(){
        resetTile(tile);
    }

    const scroll$ = Observable.fromEvent(window, 'scroll')
    scroll$
        .do(scrollEvent => {
            let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollPos > lastScrollPos) {
                console.log('scrolling down')
                scrollTile(tile, 'down')
            } else {
                console.log('scrolling up')
                scrollTile(tile, 'up')
            }
            lastScrollPos = currentScrollPos;
        })
        .subscribe((scrollEvent) => null, err => console.log(err))
});

function scrollTile(tile, direction) {
    if (direction == 'down') ty = ty - 10;
    else if (direction == 'up') ty = ty + 10;
    tile.css('transform', `translate3d(${tx}px, ${ty}px, ${tz}px)`)
}

function resetTile(tile) {
    $(document).scrollTop(0);
    ty = -50;
    tile.css('transform', `translate3d(${tx}px, ${ty}px, ${tz}px)`)    
}

function dragElement(cursorPosition) {
    // let currentPositionX = pos.x - this.StartPosition.x
    // let currentPositiony = pos.y - this.StartPosition.y
    // this.Renderer.setStyle(this.ElRef.nativeElement, 'transform', `translateX(${currentPositionX}px) translateY(${currentPositiony}px)`)
    $(img).css('transform', `translateX(${cursorPosition.x}px) translateY(${cursorPosition.y}px)`)
}
