class Config {
  actionKey = 'Space'
  actionButton = 0  // X or A

  scoreLabel = {
    x: 10,
    y: 25,
  }

  fps = 60
  gravitation = 1000
  levelUpAcceleration = 50

  background = {
    width: 275,
    height: 226,
    speed: 100,
  }

  bird = {
    startX: 50,
    flapSpeed: 300,
    width: 34,
    height: 26,
    animationSpeed: 0.5,
  }

  tubes = {
    speed: 100,
    borderOffset: 30,
    spaceMin: 90,
    spaceMax: 500,
    minDistance: 100,
    maxDistance: 200,
    width: 53,
  }

  texts = {
    gameOver: 'Game Over! Press space/X or click to restart',
    idle: 'Press space/X or click to start!',
    loading: 'Loading...',
  }

  resources = {
    spriteSheet: {
      src: 'assets/spritesheet.png',
      width: 606,
      height: 428,
    },

    tubePattern: {
      x: 553,
      y: 0,
      w: 53,
      h: 1,
    },

    entries: {
      background: {
        x: 0,
        y: 0,
        w: 275,
        h: 226,
      },

      bird: [
        {
          x: 276,
          y: 112,
          w: 34,
          h: 26,
        },
        {
          x: 276,
          y : 139,
          w: 34,
          h: 26,
        },
        {
          x: 276,
          y : 164,
          w: 34,
          h: 26,
        },
        {
          x: 276,
          y: 139,
          w: 34,
          h: 26,
        },
      ],

      tube: [
        {
          x: 553,
          y: 375,
          w: 53,
          h: 25,
        },
        {
          x: 502,
          y: 0,
          w: 53,
          h: 25,
        },
      ],
    },

    audio: {
      die: {
        src: 'assets/audio/die.wav',
      },
      flap: {
        src: 'assets/audio/flap.wav',
      },
      hit: {
        src: 'assets/audio/hit.wav',
      },
      point: {
        src: 'assets/audio/point.wav',
      },
      swooshing: {
        src: 'assets/audio/swooshing.wav',
      },
    }
  }

  canvas = {
    id: 'game',
  }
}
