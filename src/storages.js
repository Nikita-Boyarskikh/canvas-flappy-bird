class Storage {
  constructor() {
    this._data = {}
  }

  load(name) {
    return this._data[name]
  }

  save(name, value) {
    this._data[name] = value
  }
}

class LocalStorage extends Storage {
  load(name) {
    let value = super.load(name)
    if (value) {
      return value
    }

    value = localStorage.getItem(name)
    super.save(name, value)
    return value
  }

  save(name, value) {
    super.save(name, value)
    localStorage.setItem(name, value)
  }
}
