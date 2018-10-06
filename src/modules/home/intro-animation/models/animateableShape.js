import { TweenMax, ModifiersPlugin, TimelineMax } from 'gsap/all'
import * as flubber from 'flubber'

export class AnimatableShape {

    constructor(type, id, paths, classes, nestediGroups) {
        this.type = type;
        this.paths = this.clonePaths(paths)
        this.subGroups = {};
        this.group = (nestediGroups) ? this.createNestedShapeGroup(nestediGroups, id) : this.createShapeGroup(type, id, this.paths, classes)
        this.originalPaths = paths
        this.initialPosition = {
            matrix: undefined,
            offsetX: undefined,
            offsetY: undefined
        }
        this.interpolations = {};
    }

    clonePaths(paths) {
        if (!Array.isArray(paths)) paths = [paths]
        return paths.map((p, i) => {
            let newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
            newPath.id = i.toString()
            newPath.setAttribute('d', p.getAttribute('d'))
            // newPath.setAttribute('style', p.getAttribute('style'))
            newPath.setAttribute('fill', p.getAttribute('fill') || p.style['fill'])
            newPath.setAttribute('stroke', p.getAttribute('stroke') || p.style['stroke'])
            newPath.setAttribute('stroke-width', p.getAttribute('stroke-width') || p.style['stroke-width'])
            return newPath
        })
    }

    createShapeGroup(type, id, paths, classes) {
        let group = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        group.setAttribute('type', type)
        group.id = id

        if (!Array.isArray(paths)) paths = [paths]
        paths.forEach(p => group.appendChild(p))

        if (classes) {
            classes = (Array.isArray(classes)) ? classes : [classes]
            classes.forEach(c => group.classList.add(c))
        }
        return group
    }

    createNestedShapeGroup(groupConfigs, mainId) {
        let mainGroup = this.createShapeGroup('groupsContainer', mainId, [])
        // let mainGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g')
        // if (mainId) mainGroup.id = mainId
        for (let i = 0; i < groupConfigs.length; i++) {
            let config = groupConfigs[i]
            let pathsInGroup = (config.paths.length > 1) ? this.paths.slice(config.paths[0], config.paths[config.paths.length - 1]) : this.paths.slice(config.paths[0])
            let subGroup = this.createShapeGroup(config.type, config.id, pathsInGroup, config.classes)
            mainGroup.appendChild(subGroup)
            this.subGroups[config.id] = subGroup
        }
        return mainGroup
        /* [
            {type:'text', id:'myname', paths:path[], classes:''},
            {type:'text', id:'myname', paths:path[], classes:''
           ] 
        */
    }

    addInterpolation(type, name, fromPaths, toPaths, specificPaths) {
        const availableTypes = ['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany']

        if (!type || !availableTypes.includes(type)) {
            throw `invalid interpolation type. Available types are: ${availableTypes.toString()}`
        }

        if (specificPaths && Array.isArray(specificPaths) && specificPaths.length) {
            toPaths = toPaths.filter((path, i) => {
                return specificPaths.includes(i)
            })
        }

        // extract paths data
        let fromPathData = getPathsData(fromPaths)
        let toPathData = getPathsData(toPaths)

        switch (type) {
            case 'manyToMany': {
                // array of interpolators, each one morphs a different box path to a different letter path
                this.interpolations[name] = fromPathData.map((pathData, i) => {
                    // if (!toPathData[i]) toPathData[i] = 'M 0,0'
                    return flubber.interpolate(pathData, toPathData[i] || 'M 0,0', { maxSegmentLength: 1 })
                })
                break;
            }

            case 'manyToOne': {
                // interpolator that morphs a whole box to the first letter
                this.interpolations[name] = flubber.combine(fromPathData, toPathData, { maxSegmentLength: 1, single: true })
                break;
            }

            case 'oneToOne': {
                // interpolates one path to another path
                this.interpolations[name] = flubber.interpolate(fromPathData, toPathData, { maxSegmentLength: 1 })
                break;
            }

            case 'oneToMany': {
                // interpolates one path to multiple paths
                this.interpolations[name] = flubber.separate(fromPathData, toPathData, { maxSegmentLength: 1, single: true })
                break;
            }

            default: {
                break;
            }
        }

        function getPathsData(paths) {
            // if paths is array of paths return an array of all the paths's data, otherwise return the single path data
            return (Array.isArray(paths)) ? paths.map(p => p.getAttribute('d')) : paths.getAttribute('d')
        }
    }

    centerPosition() {
        let bounds = this.group.getBBox()
        this.initialPosition.offsetX = -bounds.x - bounds.width / 2
        this.initialPosition.offsetY = -bounds.y - bounds.height / 2

        TweenMax.set(this.group, {
            transformOrigin: "center center",
            x: this.initialPosition.offsetX,
            y: this.initialPosition.offsetY
        })

        this.initialPosition.matrix = window.getComputedStyle(this.group)['transform'] // ADJUST THIS TO SUPPORT MORE BROWSERS
    }

    get initialX() {
        return this.initialPosition.offsetX
    }

    get initialY() {
        return this.initialPosition.offsetY
    }

    reset(group, paths, morph) {

        if (group) {
            revertTransformations(this.group)
        }

        if (paths) {
            for (let i = 0; i < this.paths.length; i++) {
                revertTransformations(this.paths[i])
            }
        }

        if (morph) {
            revertMorph(this, this.originalPaths)
        }

        function revertTransformations(element) {
            element.style.transform = ''
            element.style.opacity = ''
            TweenMax.set(element, { transform: 'matrix(1, 0, 0, 1, 0, 0)', opacity: 1 })
            // element.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
        }

        function revertMorph(shape, originalPaths) {
            shape.paths.forEach((p, i) => {
                let original = originalPaths[i];
                p.setAttribute('d', original.getAttribute('d'))
                p.setAttribute('fill', original.getAttribute('fill') || original.style['fill'])
                p.setAttribute('stroke', original.getAttribute('stroke') || original.style['stroke'])
                // p.setAttribute('style', original.getAttribute('style'))
            })
        }

    }
}