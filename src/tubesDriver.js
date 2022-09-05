const TUBE_TYPE = {
  BOTTOM: 'bottom',
  TOP: 'top',
}

class TubesDriver {
  constructor({
    game,
    scene,
    drawEngine,
    spriteSheet,
    tubePattern,
    frames,
    speed,
    width,
    borderOffset,
    spaceMin,
    spaceMax,
    minDistance,
    maxDistance,
  }) {
    this._game = game
    this._scene = scene
    this._drawEngine = drawEngine
    this._spriteSheet = spriteSheet
    this._tubePattern = tubePattern
    this._frames = frames
    this._speed = speed
    this._width = width
    this._borderOffset = borderOffset
    this._spaceMin = spaceMin
    this._spaceMax = spaceMax
    this._minDistance = minDistance
    this._maxDistance = maxDistance

    this._tubes = []
    this._generateTube()
  }

  _createTube({ x, y, height, frames, type }) {
    const TubeClassByTypeMap = {
      [TUBE_TYPE.TOP]: TopTube,
      [TUBE_TYPE.BOTTOM]: BottomTube,
    }
    const TubeClass = TubeClassByTypeMap[type]
    return new TubeClass({
      x,
      y,
      width: this._width,
      height,
      speed: this._speed,
      frames,
      spriteSheet: this._spriteSheet,
      pattern: this._tubePattern,
      drawEngine: this._drawEngine,
      scene: this._scene,
      game: this._game,
    })
  }

  _generateTube(lastTube) {
    let fromX = this._scene.width
    if (lastTube) {
      fromX = lastTube.x + lastTube.width
    }
    const x = fromX + randomNumber(this._minDistance, this._maxDistance)

    const bottomYFrom = this._spaceMin + this._borderOffset
    const bottomYTo = this._scene.height - this._borderOffset
    const bottomY = randomNumber(bottomYFrom, bottomYTo)

    const bottomTube = this._createTube({
      x,
      y: bottomY,
      height: this._scene.height - bottomY,
      frames: this._frames[1],
      type: TUBE_TYPE.BOTTOM,
    })
    this._tubes.push(bottomTube)  // to track score

    const topHeight = bottomY - randomNumber(this._spaceMin, this._spaceMax)
    this._createTube({
      x,
      y: 0,
      height: Math.max(topHeight, this._borderOffset),
      frames: this._frames[0],
      type: TUBE_TYPE.TOP,
    })

    return bottomTube
  }

  update() {
    let lastTube = this._tubes[this._tubes.length - 1]
    while (!lastTube || lastTube.x + lastTube.width + this._minDistance <= this._scene.width) {
      lastTube = this._generateTube(lastTube)
    }

    this._tubes = this._tubes.filter(tube => tube.x + tube.width > 0)
  }

  getTubes({ from = null, to = null }) {
    return this._tubes.filter(tube => (
      (from === null || (tube.x + tube.width >= from))
      && (to === null || tube.x <= to)
    ))
  }

  increaseSpeed(acceleration) {
    this._speed += acceleration
  }
}
