class Background extends AnimatedEntity {
  constructor(params) {
    super(params)
    this.speed = params.speed
    this.initialX = params.x
  }

  update(delta) {
    super.update(delta)
    this.x -= this.speed * delta

    if (this.x <= this.initialX - this.width) {
      this.x = this.initialX
    }
  }
}
