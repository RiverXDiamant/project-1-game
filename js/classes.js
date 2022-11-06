// const gravity = 0.2
// class Sprite {
//   constructor({ position, velocity }) {
//     this.position = position
//     this.velocity = velocity
//     this.height = 150
//   }
//   image() {
//     context.fillStyle = 'red'
//     context.fillRect(this.position.x, this.position.y, 50, this.height) //< - ref x, y values in player object
//   }
//   //* call image to begin animation
//   startAnimate() {
//     this.image()

//     //* over time, each frame will have 10 pixels added for each frame loop
//     //* call startAnimate within the animation loop to initiate
//     this.position.y += this.velocity.y

//     //* (this.position) + (this.height) equal to the bottom of a sprite
//     //* plus the sprites velocity
//     //! - So if the bottom of the sprite + sprite velocity is greater than or equal to
//     //!   the bottom of the canvas, set velocity to 0 to prevent it from falling down past the canvas
//     if (this.position.y + this.height + this.velocity.y >= canvasEl.height) {
//       this.velocity.y = 0
//     } else {
//       //* only adding gravity to y velocity if player/opponent are above the value of canvas height
//       this.velocity.y += gravity
//     }
//   }
// }

// //* storing this.position in an object - can now reference with other objects in Sprite class
// const player = new Sprite({
//   position: {
//     //* use {} to make it an object
//     x: 0,
//     y: 0
//   },
//   velocity: {
//     x: 0,
//     y: 0
//   }
// })

class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  spriteImage() {
    context.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  // context.fillStyle = 'red'
  // context.fillRect(this.position.x, this.position.y, 50, this.height) //< - ref x, y values in player object

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  // call image to begin animation

  startAnimate() {
    this.spriteImage()
    this.animateFrames()
  }
}

// call image to begin animation
//   startAnimate() {
//     this.image()

// call startAnimate within the animation loop to initiate
//     this.position.x += this.velocity.x
//     this.position.y += this.velocity.y

// (this.position) + (this.height) equal to the bottom of a sprite
// plus the sprites velocity
//     //! - So if the bottom of the sprite + sprite velocity is greater than or equal to
//     //!   the bottom of the canvas, set velocity to 0 to prevent it from falling down past the canvas
//     if (this.position.y + this.height + this.velocity.y >= canvasEl.height) {
//       this.velocity.y = 0
//     } else {
// only adding gravity to y velocity if player/opponent are above the value of canvas height
//       this.velocity.y += gravity
//     }
//   }

// =========== Fighter Class ==========

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    hitbox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: hitbox.offset,
      width: hitbox.width,
      height: hitbox.height
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  startAnimate() {
    this.spriteImage()
    if (!this.dead) this.animateFrames()

    // hit boxes
    this.hitbox.position.x = this.position.x + this.hitbox.offset.x
    this.hitbox.position.y = this.position.y + this.hitbox.offset.y

    // spriteImage the attack box
    // context.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // )

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
      this.position.y = 330
    } else this.velocity.y += gravity
  }

  attack() {
    this.switchSprite('attack1')
    this.isAttacking = true
  }

  takeHit() {
    this.health -= 20

    if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
        }
        break

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
        }
        break
    }
  }
}
