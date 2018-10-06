import { TweenMax, TimelineMax } from 'gsap/all'

export function spread(animShapes, simpleShapes) {
    return function () {
        const boxes = animShapes
        const particles = simpleShapes
        
        // get spread trajectories
        const boxesTrajectory1 = trajectoryConfig('boxes', boxes)[0]
        const boxesTrajectory2 = trajectoryConfig('boxes', boxes)[1]
        const particlesTrajectory1 = trajectoryConfig('particles', particles)[0]
        const particlesTrajectory2 = trajectoryConfig('particles', particles)[1]

        let t = new TimelineMax();
        t.add('spreadAll')
        t.add(animateSpread(boxes.map(b => b.group), boxesTrajectory1, boxesTrajectory2), 'spreadAll')
        t.add(animateSpread(particles.map(p => p.group), particlesTrajectory1, particlesTrajectory2), 'spreadAll')
        t.add(TweenMax.to(particles.map(p => p.group), 6, { opacity: 0 }), 'spreadAll')
        return t

        function animateSpread(shapeGroups, trajectory1, trajectory2) {
            // reveal elements
            shapeGroups.forEach(bg => TweenMax.set(bg, { opacity: 1 }))
            // create spread timeline
            let t = new TimelineMax();
            // 1st bounce sequence timing
            t.add('1stBounce-upward')
                .add('1stBounce-downward', '1stBounce-upward+=1')
                // 2nd bounce sequence timing
                .add('2ndBounce-upward', '1stBounce-downward+=1')
                .add('2ndBounce-downward', '2ndBounce-upward+=0.75')

                // 1st bounce funcs - upward
                .add(projectile(shapeGroups, trajectory1, 'upward', 'y', 1, 'Power1.easeOut'), '1stBounce-upward')
                .add(projectile(shapeGroups, trajectory1, 'upward', 'x', 1, 'Linear.easeNone'), '1stBounce-upward')
                .add(rotate(shapeGroups, trajectory1, 3, 'Power2.easeOut'), '1stBounce-upward')
                // 1st bounce funcs - downward
                .add(projectile(shapeGroups, trajectory1, 'downward', 'y', 1, 'Power1.easeIn'), '1stBounce-downward')
                .add(projectile(shapeGroups, trajectory1, 'downward', 'x', 1, 'Linear.easeNone'), '1stBounce-downward')

                // 2nd bounce funcs - upward
                .add(projectile(shapeGroups, trajectory2, 'upward', 'y', 0.75, 'Power1.easeOut'), '2ndBounce-upward')
                .add(projectile(shapeGroups, trajectory2, 'upward', 'x', 0.75, 'Linear.easeNone'), '2ndBounce-upward')
                .add(rotate(shapeGroups, trajectory2, 2, 'Power2.easeOut'), '2ndBounce-upward')
                // 2nd bounce funcs - downward
                .add(projectile(shapeGroups, trajectory2, 'downward', 'y', 0.75, 'Power1.easeIn'), '2ndBounce-downward')
                .add(projectile(shapeGroups, trajectory2, 'downward', 'x', 0.75, 'Linear.easeNone'), '2ndBounce-downward')
            return t

            function projectile(shapes, trajectory, direction, axis, duration, ease) {
                return TweenMax.to(shapes, duration, {
                    [axis]: (i, targetElem) => trajectory[direction][targetElem.id][axis],
                    ease: ease || Linear.easeNone,
                })
            }

            function rotate(shapes, trajectory, duration, ease) {
                return TweenMax.to(shapes, duration, {
                    rotation: (i, targetElem) => trajectory.upward[targetElem.id].rotation,
                    ease: ease || Linear.easeNone
                })
            }
        }

        function trajectoryConfig(type, elements) {
            // type : 'boxes' | 'particles'
            // configure spread trajectories
            if (type == 'boxes') {
                return [
                    // first bounce
                    {
                        upward: {
                            [elements[0].group.id]: { x: '-=140', y: elements[0].initialY - 200, rotation: '-=1800' },
                            [elements[1].group.id]: { x: '-=190', y: elements[1].initialY - 190, rotation: '-=1440' },
                            [elements[2].group.id]: { x: '-=50', y: elements[2].initialY - 240, rotation: '-=1080' },
                            [elements[3].group.id]: { x: '-=90', y: elements[3].initialY - 210, rotation: '-=1080' },
                        },
                        downward: {
                            [elements[0].group.id]: { x: '-=140', y: elements[0].initialY },
                            [elements[1].group.id]: { x: '-=190', y: elements[1].initialY },
                            [elements[2].group.id]: { x: '-=50', y: elements[2].initialY },
                            [elements[3].group.id]: { x: '-=90', y: elements[3].initialY },
                        },
                    },
                    // second bounce
                    {
                        upward: {
                            [elements[0].group.id]: { x: '-=50', y: elements[0].initialY - 165, rotation: '+=360' },
                            [elements[1].group.id]: { x: '-=60', y: elements[1].initialY - 145, rotation: '-=720' },
                            [elements[2].group.id]: { x: '-=30', y: elements[2].initialY - 140, rotation: '-=360' },
                            [elements[3].group.id]: { x: '-=50', y: elements[3].initialY - 150, rotation: '+=360' },
                        },
                        downward: {
                            [elements[0].group.id]: { x: '-=50', y: elements[0].initialY },
                            [elements[1].group.id]: { x: '-=60', y: elements[1].initialY },
                            [elements[2].group.id]: { x: '-=30', y: elements[2].initialY },
                            [elements[3].group.id]: { x: '-=50', y: elements[3].initialY },
                        },
                    }
                ]
            }
            if (type == 'particles') {
                return [
                    // first bounce
                    {
                        upward: {
                            [elements[0].group.id]: { x: '-=35', y: elements[0].initialY - 170, rotation: '-=1800' },
                            [elements[1].group.id]: { x: '+=10', y: elements[1].initialY - 220, rotation: '-=1440' },
                            [elements[2].group.id]: { x: '+=35', y: elements[2].initialY - 280, rotation: '-=1080' },
                            [elements[3].group.id]: { x: '+=50', y: elements[3].initialY - 140, rotation: '-=1080' },
                            [elements[4].group.id]: { x: '+=65', y: elements[3].initialY - 175, rotation: '-=1080' },
                            [elements[5].group.id]: { x: '+=95', y: elements[3].initialY - 140, rotation: '-=1080' },
                        },
                        downward: {
                            [elements[0].group.id]: { x: '-=35', y: elements[0].initialY },
                            [elements[1].group.id]: { x: '+=10', y: elements[1].initialY },
                            [elements[2].group.id]: { x: '+=35', y: elements[2].initialY },
                            [elements[3].group.id]: { x: '+=50', y: elements[3].initialY },
                            [elements[4].group.id]: { x: '+=65', y: elements[3].initialY },
                            [elements[5].group.id]: { x: '+=95', y: elements[3].initialY },
                        },
                    },
                    // second bounce
                    {
                        upward: {
                            [elements[0].group.id]: { x: '-=10', y: elements[0].initialY - 125, rotation: '+=360' },
                            [elements[1].group.id]: { x: '+=5', y: elements[1].initialY - 175, rotation: '-=720' },
                            [elements[2].group.id]: { x: '+=15', y: elements[2].initialY - 190, rotation: '-=360' },
                            [elements[3].group.id]: { x: '+=30', y: elements[3].initialY - 110, rotation: '+=360' },
                            [elements[4].group.id]: { x: '+=35', y: elements[3].initialY - 125, rotation: '+=360' },
                            [elements[5].group.id]: { x: '+=45', y: elements[3].initialY - 110, rotation: '+=360' },
                        },
                        downward: {
                            [elements[0].group.id]: { x: '-=10', y: elements[0].initialY },
                            [elements[1].group.id]: { x: '+=5', y: elements[1].initialY },
                            [elements[2].group.id]: { x: '+=15', y: elements[2].initialY },
                            [elements[3].group.id]: { x: '+=30', y: elements[3].initialY },
                            [elements[4].group.id]: { x: '+=35', y: elements[3].initialY },
                            [elements[5].group.id]: { x: '+=45', y: elements[3].initialY },
                        },
                    }
                ]
            }
        }
    }
}