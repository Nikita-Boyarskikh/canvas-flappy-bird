class DrawEngine {
  constructor({ width, height }) {
    this.width = width
    this.height = height
  }

  drawText({ text, x, y, color = '#000000', fontSize = 14, textAlign = 'center', fontName = 'monospace' }) {}
  drawSprite({ sprite, x, y, width, height }) {}
  drawPatternRect({ image, x, y, width, height, repetition = 'repeat' }) {}
  rotate({ x = 0, y = 0, angle = 0 }) {}
  reset() {}
  clear() {}
}

class CanvasDrawEngine extends DrawEngine {
  constructor({ canvas }) {
    super({ width: canvas.width, height: canvas.height })
    this._canvas = canvas
    this._context = canvas.getContext('2d')
  }

  resize(width, height) {
    this.width = width
    this.height = height
  }

  drawText({ text, x, y, color = '#000000', fontSize = 14, textAlign = 'center', fontName = 'monospace' }) {
    super.drawText({ text, x, y, color, fontSize, textAlign, fontName })
    this._context.beginPath()
    this._context.font = `normal normal ${fontSize}px ${fontName}`
    this._context.fillStyle = color
    this._context.textAlign = textAlign
    this._context.fillText(text, x, y)
    this._context.closePath()
  }

  drawSprite({ sprite, x, y, width, height }) {
    super.drawSprite({ sprite, x, y, width, height })
    this._context.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height, x, y, width, height)
  }

  drawPatternRect({ image, x, y, width, height, repetition = 'repeat' }) {
    this._context.save()
    this._context.translate(x, y)
    const prevFillStyle = this._context.fillStyle
    this._context.fillStyle = this._context.createPattern(image, repetition)
    this._context.fillRect(0, 0, width, height)
    this._context.fillStyle = prevFillStyle
    this._context.restore()
  }

  rotate({ x = 0, y = 0, angle = 0 }) {
    this._context.translate(x, y)
    this._context.rotate(angle)
  }
  reset() {
    this._context.resetTransform()
  }

  clear() {
    super.clear()
    this._context.clearRect(0, 0, this.width, this.height)
  }
}
