"use strict";

class Resize {
    constructor(node, direction=VERTICAL, margin=4) {
        this.node = node;
        this.element = this.node.element;
        this.direction = direction;
        this.minWidth = node.element.style.minWidth || 1;
        this.minHeight = node.element.style.minHeight || 1;
        this.margin = margin;

        this.clicked = null;

        this.onTopEdge = null;
        this.onRightEdge = null;
        this.onBottomEdge = null;
        this.onLeftEdge = null;

        this.refresh = false;

        this.rect = null;
        this.width = null;
        this.height = null;
        this.x = null;
        this.y = null;

        this.event = null;

        this.init();
    }

    init() {
        this.element.classList.add("resizable");
        this.setupEventListeners();
        this.animate();
    }

    getDirection() {
        if(this.onTopEdge) return TOP;
        if(this.onBottomEdge) return BOTTOM;
        if(this.onRightEdge) return RIGHT;
        if(this.onLeftEdge) return LEFT;

    }
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
        const direction = this.getDirection();
        this.node.updateSize(width, true, false, direction);
        this.node.updateSize(height, false, false, direction);
        // this.element.style.width = width + 'px';
        // this.element.style.height = height + 'px';

    }

    hideHint() {
        this.setDimensions(this.rect.width, this.rect.height);
        // this.element.style.opacity = 0;
    }

    setupEventListeners() {
        // Mouse events
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Touch events
        this.element.addEventListener('touchstart', this.onTouchDown.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onTouchDown(e) {
        this.doResize(e.touches[0]);
        e.preventDefault();
    }

    onTouchMove(e) {
        this.onMouseMove(e.touches[0]);
    }

    onTouchEnd(e) {
        if (e.touches.length === 0)
            this.onMouseUp(e.changedTouches[0]);
    }

    onMouseDown(e) {
        console.log("MOUSE DOWN");
        this.doResize(e);
        e.preventDefault();
    }

    doResize(e) {
        this.doSetup(e);
        this.isResizing = this.onRightEdge || this.onBottomEdge || this.onTopEdge || this.onLeftEdge;

        this.clicked = {
            x: this.x,
            y: this.y,
            cx: e.clientX,
            cy: e.clientY,
            w: this.width,
            h: this.height,
            isResizing: this.isResizing,
            onTopEdge: this.onTopEdge,
            onLeftEdge: this.onLeftEdge,
            onRightEdge: this.onRightEdge,
            onBottomEdge: this.onBottomEdge
        };
        console.log(this.clicked);
    }

    onMouseMove(e) {
        this.doSetup(e);
        this.event = e;
        this.refresh = true;
    }

    doSetup(e) {
        this.rect = this.element.getBoundingClientRect();
        this.x = e.clientX - this.rect.left;
        this.y = e.clientY - this.rect.top;

        this.onTopEdge = this.y < this.margin;
        this.onLeftEdge = this.x < this.margin;
        this.onRightEdge = this.x >= this.rect.width - this.margin;
        this.onBottomEdge = this.y >= this.rect.height - this.margin;
    }



    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (!this.refresh) return;
        this.refresh = false;

        if (this.clicked && this.clicked.isResizing) {
            // if (this.clicked.onRightEdge) this.element.style.width = Math.max(this.x, this.minWidth) + 'px';
            // if (this.clicked.onBottomEdge) this.element.style.height = Math.max(this.y, this.minHeight) + 'px';
            if (this.clicked.onRightEdge) this.node.updateSize(Math.max(this.x, this.minWidth), true,
                                                                false, RIGHT);
            if (this.clicked.onBottomEdge) this.node.updateSize(Math.max(this.y, this.minHeight), false,
                                                                false, BOTTOM);

            if (this.clicked.onLeftEdge) {
                const currentWidth = Math.max(this.clicked.cx - this.event.clientX + this.clicked.w, this.minWidth);
                if (currentWidth > this.minWidth) {
                    this.element.style.width = currentWidth + 'px';
                    this.element.style.left = this.event.clientX + 'px';
                }
            }

            if (this.clicked.onTopEdge) {
                const currentHeight = Math.max(this.clicked.cy - this.event.clientY + this.clicked.h, this.minHeight);
                if (currentHeight > this.minHeight) {
                    this.element.style.height = currentHeight + 'px';
                    this.element.style.top = this.event.clientY + 'px';
                }
            }

            // this.rect = this.element.getBoundingClientRect();
            // this.hideHint();

            return;
        }

        // style cursor
        if (this.onRightEdge && this.onBottomEdge || this.onLeftEdge && this.onTopEdge) {
            this.element.style.cursor = 'nwse-resize';
        } else if (this.onRightEdge && this.onTopEdge || this.onBottomEdge && this.onLeftEdge) {
            this.element.style.cursor = 'nesw-resize';
        } else if (this.onRightEdge || this.onLeftEdge) {
            this.element.style.cursor = 'ew-resize';
        } else if (this.onBottomEdge || this.onTopEdge) {
            this.element.style.cursor = 'ns-resize';
        } else {
            this.element.style.cursor = 'default';
        }
    }

    onMouseUp(e) {
        this.doSetup(e);
        this.clicked = null;
    }
}

module.exports = Resize;