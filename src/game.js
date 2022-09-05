class Game {
  STATES = {
    LOADING: 'LOADING',
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER',
  }

  constructor() {
    this._config = new Config()
    this._storage = new LocalStorage()

    this._lastUpdate = null
    this._currentState = this.STATES.LOADING
    this._backgrounds = []

    this._configureResources()
    this._configureCanvas()
    this._configureDrawEngine()
    this._configureInputEngines()
    this._addEventListeners()
  }

  _addEventListeners() {
    window.addEventListener('resize', debounce(this._resize.bind(this)))

    this._inputEngines.forEach(handler => handler.subscribe())
  }

  _resize() {
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight

    this._canvas.width = width
    this._canvas.height = height

    this._scene.resize(width, height)
    this._drawEngine.resize(width, height)
    this._generateBackgrounds()
    this._changeState(this._currentState)
  }

  _configureResources() {
    const resourceLoader = new ResourceLoader()
    this._resources = new ResourceStorage({ loader: resourceLoader })
  }

  _configureCollisionEngine() {
    this._collisionEngine = new RectCollisionEngine()
  }

  _configurePhysicsEngine() {
    this._physicsEngine = new PhysicsEngine({ gravitation: this._config.gravitation })
  }

  _configureCanvas() {
    this._canvas = document.getElementById(this._config.canvas.id)
  }

  _configureDrawEngine() {
    this._drawEngine = new CanvasDrawEngine({ canvas: this._canvas })
  }

  _configureScene() {
    this._scene = new Scene({
      game: this,
      drawEngine: this._drawEngine,
      collisionEngine: this._collisionEngine,
      width: this._config.canvas.width,
      height: this._config.canvas.height,
    })
  }

  _createEntities() {
    this._backgrounds = []
    this._generateBackgrounds()

    this._tubesDriver = new TubesDriver({
      game: this,
      scene: this._scene,
      drawEngine: this._drawEngine,
      spriteSheet: this._resources.get('spriteSheet'),
      tubePattern: this._resources.get('tubePattern'),
      frames: this._config.resources.entries.tube,
      speed: this._config.tubes.speed,
      width: this._config.tubes.width,
      borderOffset: this._config.tubes.borderOffset,
      spaceMin: this._config.tubes.spaceMin,
      spaceMax: this._config.tubes.spaceMax,
      minDistance: this._config.tubes.minDistance,
      maxDistance: this._config.tubes.maxDistance,
    })

    this._bird = new Bird({
      x: this._config.bird.startX,
      y: this._scene.height / 2 - this._config.bird.height / 2,
      width: this._config.bird.width,
      height: this._config.bird.height,
      flapSpeed: this._config.bird.flapSpeed,
      rotationSpeed: this._config.bird.rotationSpeed,
      animationSpeed: this._config.bird.animationSpeed,
      frames: this._config.resources.entries.bird,
      spriteSheet: this._resources.get('spriteSheet'),
      flapSound: this._resources.get('flapSound'),
      hitSound: this._resources.get('hitSound'),
      dieSound: this._resources.get('dieSound'),
      drawEngine: this._drawEngine,
      scene: this._scene,
      physicsEngine: this._physicsEngine,
      game: this,
    })
  }

  _generateBackgrounds() {
    this._backgrounds.forEach(background => background.delete())

    const backgroundAspectRatio = this._config.background.width / this._config.background.height
    let lastBackground = null
    while (!lastBackground || lastBackground.initialX < this._scene.width) {
      let x = 0
      if (lastBackground) {
        x = lastBackground.x + lastBackground.width
      }

      const background = new Background({
        x,
        y: 0,
        width: this._scene.height * backgroundAspectRatio,
        height: this._scene.height,
        speed: this._config.background.speed,
        frames: this._config.resources.entries.background,
        spriteSheet: this._resources.get('spriteSheet'),
        drawEngine: this._drawEngine,
        scene: this._scene,
        game: this,
      })
      this._backgrounds.push(background)

      lastBackground = this._backgrounds[this._backgrounds.length - 1]
    }
  }

  _configureInputEngines() {
    const keyHandlersMap = {
      [this._config.actionKey]: () => {
        this._handleAction()
      },
    }
    const keyboard = new KeyboardInputEngine({
      element: this._canvas,
      keyHandlersMap,
    })

    const clickHandlers = {
      left: () => {
        this._handleAction()
      }
    }
    const mouse = new MouseInputEngine({
      element: document,
      clickHandlers,
    })

    const buttonHandlersMap = {
      [this._config.actionButton]: () => {
        this._handleAction()
      },
    }
    const gamepad = new GamepadInputEngine({
      element: document,
      buttonHandlersMap
    })

    this._inputEngines = [keyboard, mouse, gamepad]
  }

  _handleAction() {
    const actionByStateMap = {
      [this.STATES.LOADING]: () => {},

      [this.STATES.IDLE]: () => {
        this.start()
      },

      [this.STATES.PLAYING]: () => {
        this._bird.flap()
      },

      [this.STATES.GAME_OVER]: () => {
        this.start()
      },
    }

    const action = actionByStateMap[this._currentState]
    return action()
  }

  _changeState(state) {
    this._drawEngine.clear()
    this._currentState = state

    const stateChangeHandlersMap = {
      [this.STATES.PLAYING]: () => {
        this._loop()
      },

      [this.STATES.LOADING]: () => {
        new CenteredTextComponent({ text: this._config.texts.loading }).draw(this._drawEngine)
      },

      [this.STATES.IDLE]: () => {
        new WithScoresComponent({
          text: this._config.texts.idle,
          score: this._score,
          highScore: this._highScore,
        }).draw(this._drawEngine)
      },

      [this.STATES.GAME_OVER]: () => {
        new WithScoresComponent({
          text: this._config.texts.gameOver,
          score: this._score,
          highScore: this._highScore,
        }).draw(this._drawEngine)
      }
    }

    const handler = stateChangeHandlersMap[state]
    handler()
  }

  reset() {
    this._changeState(this.STATES.IDLE)
    this._score = 0
    this._level = 0
    this._configurePhysicsEngine()
    this._configureCollisionEngine()
    this._configureScene()
    this._resize()
    this._createEntities()
  }

  gameOver() {
    this._changeState(this.STATES.GAME_OVER)
  }

  async prepare() {
    this._highScore = parseInt(this._storage.load('highScore'), 10) || 0

    this._changeState(this.STATES.LOADING)

    const imageCutter = new ImageCutter()
    await this._resources.load({
      spriteSheet: {
        type: RESOURCE_TYPE.IMAGE,
        src: this._config.resources.spriteSheet.src,
        width: this._config.resources.spriteSheet.width,
        height: this._config.resources.spriteSheet.height,
      },

      dieSound: {
        type: RESOURCE_TYPE.AUDIO,
        src: 'assets/audio/die.wav',
      },
      flapSound: {
        type: RESOURCE_TYPE.AUDIO,
        src: 'assets/audio/flap.wav',
      },
      hitSound: {
        type: RESOURCE_TYPE.AUDIO,
        src: 'assets/audio/hit.wav',
      },
      pointSound: {
        type: RESOURCE_TYPE.AUDIO,
        src: 'assets/audio/point.wav',
      },
      swooshingSound: {
        type: RESOURCE_TYPE.AUDIO,
        src: 'assets/audio/swooshing.wav',
      },
    })
    const spriteSheet = this._resources.get('spriteSheet')
    await this._resources.load({
      tubePattern: {
        type: RESOURCE_TYPE.IMAGE,
        src: await imageCutter.getImagePartSrc({
          spriteSheet,
          width: this._config.resources.tubePattern.w,
          height: this._config.resources.tubePattern.h,
          image: {
            x: this._config.resources.tubePattern.x,
            y: this._config.resources.tubePattern.y,
            w: this._config.resources.tubePattern.w,
            h: this._config.resources.tubePattern.h,
          },
        }),
      },
    })

    this.reset()
  }

  _updateScore(delta) {
    const birdCenter = this._bird.x + this._bird.width / 2
    const crossingTube = this._tubesDriver.getTubes({ from: birdCenter, to: birdCenter })[0]
    if (!crossingTube) {
      return
    }

    const tubeCenter = crossingTube.x + crossingTube.width / 2
    const threshold = (this._config.tubes.speed + this._config.levelUpAcceleration * this._level) * delta
    if (tubeCenter + threshold / 2 >= birdCenter && tubeCenter - threshold / 2 <= birdCenter) {
      this._score++

      const pointSound = this._resources.get('pointSound')
      pointSound.play()

      if (this._score >= 10 * (this._level + 1)) {
        this._increaseLevel()
      }
    }
  }

  _update(delta) {
    this._tubesDriver.update()
    this._scene.update(delta)

    this._updateScore(delta)

    if (this._score > this._highScore) {
      this._highScore = this._score
      this._storage.save('highScore', this._highScore)
    }
  }

  _increaseLevel() {
    this._level += 1
    this._scene.getEntities().filter((entity) => {
      return entity instanceof Tube || entity instanceof Background
    }).forEach((entity) => {
      entity.speed += this._config.levelUpAcceleration
    })
    this._tubesDriver.increaseSpeed(this._config.levelUpAcceleration)
  }

  _draw() {
    this._drawEngine.clear()
    this._scene.draw()
    new TextComponent({
      text: `Score: ${this._score}`,
      x: this._config.scoreLabel.x,
      y: this._config.scoreLabel.y,
      textAlign: 'left',
    }).draw(this._drawEngine)
  }

  _loop() {
    const now = Date.now()
    const delta = (now - this._lastUpdate) / 1000.0

    this._update(delta)

    if (this._currentState === this.STATES.PLAYING) {
      this._draw()
      this._lastUpdate = now

      requestAnimationFrame(debounce(this._loop.bind(this), 1000 / this._config.fps))
    }
  }

  start() {
    this.reset()

    const swooshingSound = this._resources.get('swooshingSound')
    swooshingSound.play()

    this._lastUpdate = Date.now()
    this._changeState(this.STATES.PLAYING)
  }
}
