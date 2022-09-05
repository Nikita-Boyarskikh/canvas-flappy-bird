class PhysicsEngine {
  constructor({ gravitation }) {
    this._gravitation = gravitation
  }

  update(entity, delta) {
    if (!entity.flying || !entity._fallingSpeed) {
      entity._fallingSpeed = 0
    }

    if (entity.flying) {
      entity._fallingSpeed += delta * this._gravitation
    }

    entity.y += delta * entity._fallingSpeed
  }
}
