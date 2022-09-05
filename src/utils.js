function debounce(callback, timeout = 100) {
  let _debounceTimerId = undefined
  return (...args) => {
    if (_debounceTimerId !== undefined) {
      clearTimeout(_debounceTimerId)
      _debounceTimerId = undefined
    }

    _debounceTimerId = setTimeout(() => {
      _debounceTimerId = undefined
      callback(...args)
    }, timeout)
  }
}

function randomNumber(from, to) {
  return from + Math.random() * (to - from)
}
