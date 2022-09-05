class Entity {
  collidable = false
  flying = false

  constructor({ x, y, width, height, image, spriteSheet, drawEngine, game, scene = null, zIndex = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.image = image
    this._spriteSheet = spriteSheet
    this._fallingSpeed = 0
    this._drawEngine = drawEngine
    this._game = game
    this.scene = scene
    if (scene) {
      scene.add(this, zIndex)
    }
  }

  update(delta) {}

  collide(entity) {}

  draw() {
    this._drawEngine.drawSprite({
      sprite: {
        image: this._spriteSheet,
        x: this.image.x,
        y: this.image.y,
        width: this.image.w,
        height: this.image.h,
      },
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    })
  }

  delete() {
    if (this.scene) {
      this.scene.delete(this)
    }
  }
}

class AnimatedEntity extends Entity {
  constructor(params) {
    super(params)

    this._frameIdx = 0
    this._animationEnabled = false
    this._animationSpeed = params.animationSpeed || 0

    this._frames = params.frames
    if (!this._frames) {
      this._frames = [this.image]
    }

    if (!Array.isArray(this._frames)) {
      this._frames = [this._frames]
    }
  }

  update(delta) {
    if (this._animationEnabled) {
      this._frameIdx = (this._frameIdx + Math.ceil(this._animationSpeed * delta)) % this._frames.length
    }
    this.image = this._frames[this._frameIdx]

    super.update(delta)
  }

  enableAnimation() {
    this._frameIdx = 0
    this._animationEnabled = true
  }

  disableAnimation() {
    this._animationEnabled = false
  }
}
