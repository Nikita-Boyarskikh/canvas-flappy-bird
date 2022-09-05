class Bird extends AnimatedEntity {
  flying = true
  collidable = true

  constructor(params) {
    params.zIndex = 2
    super(params)
    this._physicsEngine = params.physicsEngine
    this.flapSpeed = params.flapSpeed
    this._flapSound = params.flapSound
    this._hitSound = params.hitSound
    this._dieSound = params.dieSound
    this.enableAnimation()
  }

  update(delta) {
    super.update(delta)
    this._physicsEngine.update(this, delta)

    if (this.y < 0) {
      this.y = 0
    }

    if (this.y + this.height >= this.scene.height) {
      this._dieSound.play()
      this._game.gameOver()
    }
  }

  collide(entity) {
    super.collide(entity)
    if (entity instanceof Tube) {
      this._hitSound.play()
      this._game.gameOver()
    }
  }

  flap() {
    this._fallingSpeed = -this.flapSpeed
    this._flapSound.play()
  }
}
