class Tube extends AnimatedEntity {
  collidable = true

  constructor(params) {
    params.zIndex = 1
    super(params)
    this.speed = params.speed
    this._pattern = params.pattern
  }

  update(delta) {
    super.update(delta)
    this.x -= this.speed * delta

    if (this.x + this.width <= 0) {
      this.delete()
    }
  }
}

class BottomTube extends Tube {
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
      width: this.image.w,
      height: this.image.h,
    })

    this._drawEngine.drawPatternRect({
      image: this._pattern,
      x: this.x,
      y: this.y + this.image.h,
      width: this.width,
      height: this.height - this.image.h,
      repetition: 'repeat-y',
    })
  }
}

class TopTube extends Tube {
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
      y: this.height - this.image.h,
      width: this.image.w,
      height: this.image.h,
    })

    this._drawEngine.drawPatternRect({
      image: this._pattern,
      x: this.x,
      y: 0,
      width: this.width,
      height: this.height - this.image.h,
      repetition: 'repeat-y',
    })
  }
}
