import { TweenMax, ModifiersPlugin, TimelineMax } from 'gsap/all'

export class SimpleShape {
    
        constructor(shapeType, id, classes, attr) {
            /* 
                attributes type def
                possible params are : {x, y, width, height, cx, cy, r, points fill, stroke, strokeWidth}
            */
            if (!['rect', 'circle', 'polygon'].includes(shapeType)) throw 'invalid particle shape type, either rect, circle or polygon available';
            if (!attr.constructor === Object) throw 'invalid attributes variable, only js object allowed'
            if (Object.keys(attr).length === 0) throw 'attributes parameter got an empty object'
    
            this.shapeType = shapeType;
            this.id = id;
            this.attr = attr
            this.group = this.createGroup(this.id)
            this.svgEl = this[shapeType]()
            this.group.appendChild(this.svgEl)
            this.initialPosition = {
                matrix: undefined,
                offsetX: undefined,
                offsetY: undefined
            }
        }
    
        createGroup(id) {
            const group = document.createElementNS("http://www.w3.org/2000/svg", 'g')
            group.id = id
            return group
        }
    
        rect() {
            if (this.svgEl) return
            this.checkRequiredattr(this.attr, ['x', 'y', 'width', 'height'])
            const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
            this.applyAttributes(this.attr, rect)
            return rect
        }
    
        circle() {
            if (this.svgEl) return
            this.checkRequiredattr(this.attr, ['cx', 'cy', 'r'])
            const circ = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
            this.applyAttributes(this.attr, circ)
            return circ
        }
    
        polygon() {
            if (this.svgEl) return
            this.checkRequiredattr(this.attr, ['points'])
            const poly = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
            this.applyAttributes(this.attr, poly)
            return poly
        }
    
        checkRequiredattr(attrObj, required) {
            let missing = [];
            for (let i = 0; i < required.length; i++) {
                if (!(required[i] in attrObj)) missing.push(required[i])
            }
            if (missing.length) throw `missing shape propeties: ${missing.toString()}`
        }
    
        applyAttributes(attr, element) {
            element.id = this.id
            for (let key in attr) {
                if (attr.hasOwnProperty(key)) {
                    element.setAttribute(key, attr[key])
                }
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
    
        reset() {
            this.group.style.transform = ''
            this.group.style.opacity = ''
            TweenMax.set(this.group, { transform: 'matrix(1, 0, 0, 1, 0, 0)', opacity: 1 })
            // element.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
        }
    }