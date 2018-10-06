$(document).ready(function () {

    const viewport = document.getElementById('viewport')
    const room = document.getElementById('room')
    const walls = document.querySelectorAll('.wall')
    let debounceCubeSetup;

    // global event callbacks
    emitter.on('window-resized', function () {
        if (debounceCubeSetup) clearTimeout(debounceCubeSetup);
        debounceCubeSetup = setTimeout(function () {
            setupCube();
        }, 250)
    })

    emitter.on('cubeSetup', function () {
        console.log('Cube has been set up!')
    })

    function setupCube() {
        // set viewport
        const perspective = `${window.innerWidth * 0.65}px`
        viewport.style.height = window.innerHeight
        viewport.style.width = window.innerWidth
        viewport.style.perspective = perspective

        // set room size
        const roomH = window.innerHeight * 0.8
        const roomW = window.innerWidth * 0.8
        const marginH = window.innerHeight * 0.1
        const marginW = window.innerWidth * 0.1

        // apply to room
        room.style.height = `${roomH}px`
        room.style.width = `${roomW}px`
        room.style.margin = `${marginH}px ${marginW}px`

        // apply to walls 
        walls.forEach(wall => {
            // set wall dimensions
            wall.style.width = `${roomW}px`
            wall.style.height = (wall.id == 'bottom-wall' || wall.id == 'top-wall') ? `${roomW}px` : `${roomH}px`

            // set wall translations
            switch (wall.id) {
                case 'top-wall': {
                    let transY = roomW * 0.49918 // desired - 1 px less than the wall length
                    transY = `${-transY}px`
                    wall.style.transform = `translateY(${transY}) translateZ(0px) rotateX(90deg)`
                    break;
                }
                case 'back-wall': {
                    let transZ = roomW * 0.49918 // desired - 1 px less than the wall length
                    transZ = `${-transZ}px`
                    wall.style.transform = `translateZ(${transZ}) translateX(0) rotateY(0deg)`
                    break;
                }
                case 'left-wall': {
                    let transX = roomW * 0.49918 // desired - 1 px less than the wall length
                    transX = `${-transX}px`
                    wall.style.transform = `translateX(${transX}) rotateY(90deg)`
                    break;
                }
                case 'right-wall': {
                    let transX = roomW * 0.49918 // desired - 1 px less than the wall length
                    transX = `${transX}px`
                    wall.style.transform = `translateX(${transX}) rotateY(-90deg)`
                    break;
                }
                case 'bottom-wall': {
                    let transY = roomH * 0.99836 // desired - 1 px less than the wall length
                    transY = `${transY}px`
                    let transZ = roomW * 0.5
                    transZ = `${-transZ}px`
                    wall.style.transform = `translateY(${transY}) translateZ(${transZ}) rotateX(90deg)`
                    break;
                }

                case 'front-wall': {
                    let transZ = roomW * 0.49918 // desired - 1 px less than the wall length
                    transZ = `${transZ}px`
                    wall.style.transform = `translateZ(${transZ}) translateX(0) rotateY(0deg)`
                    break;
                }

                default: {
                    alert('cube setup error - no such wall')
                }
            }
        })
        emitter.emit('cubeSetup')
    }
    setupCube();

})