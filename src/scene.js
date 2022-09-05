class Scene {
  constructor({ drawEngine, collisionEngine, width, height }) {
    this._drawEngine = drawEngine
    this._collisionEngine = collisionEngine
    this._entities = new Map()
    this.width = width
    this.height = height
  }

  add(entity, zIndex) {
    if (entity.scene) {
      entity.scene.delete(entity)
    }

    entity.scene = this
    this._entities.set(entity, zIndex)
  }

  delete(entity) {
    this._entities.delete(entity)
    entity.scene = null
  }

  update(delta) {
    this._entities.forEach((zIndex, entity) => entity.update(delta))
    this._handleCollisions()
  }

  resize(width, height) {
    this.width = width
    this.height = height
  }

  getEntities() {
    return Array.from(this._entities.keys())
  }

  _handleCollisions() {
    for (const entity1 of this._entities.keys()) {
      for (const entity2 of this._entities.keys()) {
        if (entity1 === entity2) {
          continue
        }

        if (this._collisionEngine.checkCollision(entity1, entity2)) {
          entity1.collide(entity2)
          entity2.collide(entity1)
        }
      }
    }
  }

  draw() {
    this.getEntities()
      .sort((a, b) => this._entities.get(a) - this._entities.get(b))
      .forEach((entity) => entity.draw(this._drawEngine))
  }
}
