class Bird extends AnimatedEntity {
  flying = true
  collidable = true

  constructor(params) {
    params.zIndex = 2
    super(params)
    this._physicsEngine = params.physicsEngine
    this._flapSpeed = params.flapSpeed
    this._rotationSpeed = params.rotationSpeed
    this._flapSound = params.flapSound
    this._hitSound = params.hitSound
    this._dieSound = params.dieSound
    this.enableAnimation()
  }

  update(delta) {
    super.update(delta)
    this._physicsEngine.update(this, delta)
    this._angle = this._rotationSpeed * this._fallingSpeed / this.scene.height * delta

    if (this.y < 0) {
      this.y = 0
    }

    if (this.y + this.height >= this.scene.height) {
      this._dieSound.play()
      this._game.gameOver()
    }
  }

  draw() {
    this._drawEngine.rotate({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      angle: this._angle,
    })

    this._drawEngine.drawSprite({
      sprite: {
        image: this._spriteSheet,
        x: this.image.x,
        y: this.image.y,
        width: this.image.w,
        height: this.image.h,
      },
      x: -this.width / 2,
      y: -this.height / 2,
      width: this.width,
      height: this.height,
    })

    this._drawEngine.reset()
  }

  collide(entity) {
    super.collide(entity)
    if (entity instanceof Tube) {
      this._hitSound.play()
      this._game.gameOver()
    }
  }

  flap() {
    this._fallingSpeed = -this._flapSpeed
    this._flapSound.play()
  }
}
