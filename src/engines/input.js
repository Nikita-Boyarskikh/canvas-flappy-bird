class InputEngine {
  eventHandlers = {}

  constructor({ element }) {
    this._element = element
    this._eventCallbacksMap = {}
  }

  subscribe() {
    Object.entries(this.eventHandlers).forEach(([eventName, handler]) => {
      const callback = debounce(handler.bind(this), 10)
      this._eventCallbacksMap[eventName] = callback
      this._element.addEventListener(eventName, callback)
    })
  }

  unsubscribe() {
    Object.entries(this.eventHandlers).forEach(([eventName, handler]) => {
      const callback = this._eventCallbacksMap[eventName]
      this._element.removeEventListener(eventName, callback)
      delete this._eventCallbacksMap[eventName]
    })
  }
}

class KeyboardInputEngine extends InputEngine {
  eventHandlers = {
    keydown: ({ code }) => {
      let handlers = this._keyHandlersMap[code]
      if (!handlers) {
        return
      }

      if (!Array.isArray(handlers)) {
        handlers = [handlers]
      }

      handlers.forEach((handler) => handler())
    }
  }

  constructor(params) {
    super(params)
    this._keyHandlersMap = params.keyHandlersMap
  }
}

class MouseInputEngine extends InputEngine {
  _buttonNames = {
    0: 'left',
    1: 'middle',
    2: 'right',
  }

  eventHandlers = {
    click: ({ button, x, y }) => {
      const buttonName = this._buttonNames[button]
      const handler = this._clickHandlers[buttonName]
      handler(x, y)
    }
  }

  constructor(params) {
    super(params)
    this._clickHandlers = params.clickHandlers
  }
}

class GamepadInputEngine extends InputEngine {
  eventHandlers = {
    gamepadconnected: ({ gamepad: { index } }) => {
      this._intervals[index] = setInterval(() => {
        const gamepad = navigator.getGamepads()[index]
        Object.entries(this._buttonHandlersMap).forEach(([buttonKey, handler]) => {
          if (gamepad.buttons[buttonKey].pressed) {
            handler(gamepad.buttons[buttonKey].value)
          }
        })
      }, 10)
    },

    gamepaddisconnected: ({ gamepad: { index } }) => {
      const interval = this._intervals[index]
      clearInterval(interval)
      delete this._intervals[index]
    },
  }

  constructor(params) {
    super(params)
    this._intervals = {}
    this._buttonHandlersMap = params.buttonHandlersMap
  }
}
