class Component {
  draw(drawEngine) {}
}

class TextComponent extends Component {
  constructor({ text, x, y, textAlign = 'left' }) {
    super()
    this._text = text
    this._x = x
    this._y = y
    this._textAlign = textAlign
  }

  draw(drawEngine) {
    super.draw(drawEngine)
    drawEngine.drawText({
      x: this._x,
      y: this._y,
      text: this._text,
      textAlign: this._textAlign,
    })
  }
}

class CenteredTextComponent extends TextComponent {
  draw(drawEngine) {
    this._textAlign = 'center'
    this._x = drawEngine.width / 2
    this._y = drawEngine.height / 2
    super.draw(drawEngine)
  }
}

class WithScoresComponent extends CenteredTextComponent {
  constructor(params) {
    super(params)
    this._score = params.score
    this._highScore = params.highScore
  }

  draw(drawEngine) {
    super.draw(drawEngine)

    const fontSize = 14
    const scoreComponent = new TextComponent({
      text: `Score: ${this._score || 0}`,
      x: drawEngine.width * 0.1,
      y: drawEngine.height * 0.1,
      textAlign: 'left',
    })
    const highScoreComponent = new TextComponent({
      text: `High score: ${this._highScore || 0}`,
      x: drawEngine.width * 0.1,
      y: drawEngine.height * 0.1 + 1.5 * fontSize,
      textAlign: 'left',
    })

    scoreComponent.draw(drawEngine)
    highScoreComponent.draw(drawEngine)
  }
}
