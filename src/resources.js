const RESOURCE_TYPE = {
  IMAGE: 'image',
  AUDIO: 'audio',
}

class ResourceLoader {
  _resourceTypeLoaderMap = {
    image: ({ src, width, height }) => {
      return new Promise((resolve, reject) => {
        const image = new Image(width, height)
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.src = src
      })
    },

    audio: ({ src, }) => {
      return new Promise((resolve, reject) => {
        const audio = new Audio()
        audio.addEventListener('canplaythrough', () => resolve(audio))
        audio.addEventListener('error', (error) => reject(error))
        audio.src = src
      })
    }
  }

  constructor(resources = {}) {
    this._cache = resources
  }

  async load(resource) {
    const cachedItem = this._cache[resource.src]
    if (cachedItem) {
      return cachedItem
    }

    const loader = this._resourceTypeLoaderMap[resource.type]
    if (!loader) {
      throw new Error(`Unsupported resource type: ${resource.type}`)
    }

    const result = await loader(resource)
    this._cache[resource.src] = result
    return result
  }
}

class ResourceStorage {
  constructor({ loader }) {
    this._storage = new Storage()
    this._loader = loader
  }

  async load(resources) {
    const promises = Object.entries(resources).map(async ([name, value]) => {
      const data = await this._loader.load(value)
      this._storage.save(name, data)
    })
    await Promise.all(promises)
    return this._storage
  }

  get(name) {
    return this._storage.load(name)
  }

  set(name, value) {
    this._storage.save(name, value)
  }
}
