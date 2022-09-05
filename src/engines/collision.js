class CollisionEngine {
  checkCollision(entity1, entity2) {
    return false
  }
}

class RectCollisionEngine extends CollisionEngine {
  checkCollision(entity1, entity2) {
    return super.checkCollision(entity1, entity2) || (
      entity1.y <= entity2.y + entity2.height
      && entity1.y + entity1.height >= entity2.y
      && entity1.x <= entity2.x + entity2.width
      && entity1.x + entity1.width >= entity2.x
    )
  }
}
