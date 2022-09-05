class ImageCutter {
  constructor() {
    this._canvas = document.createElement('canvas')
    this._context = this._canvas.getContext('2d')
  }

  async getImagePartSrc({ spriteSheet, width, height, image }) {
    this._canvas.width = width
    this._canvas.height = height

    this._context.drawImage(spriteSheet, image.x, image.y, image.w, image.h, 0, 0, width, height)
    return this._canvas.toDataURL()
  }
}
