/* @flow */

var Entity = require('./Entity');
var Elastic = require('./Elastic');
var Spike = require('./Spike');

type Coordinates = {x: number; y: number};

class Player extends Entity {
  vec: Coordinates;

  init(settings: any) {
    this.size = { x:9, y:9 };
    this.center = settings.center;

    this.vec = {
      x: 0,
      y: this.getSpeed()
    };
  }

  getSpeed(): number {
    var bpm = this.game.config.bpm;
    var distance = 195;  // TODO: don't hardcode this
    var bps = bpm/60;
    var spb = 1/bps;  // seconds per beat - this is how much time you have to cross
    var spd = distance / spb / 1000;
    return spd;
  }

  draw(ctx: any) {
    ctx.fillStyle = '#f07';
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }

  update(dt: number) {
    var step = dt/100;

    this.center.y += this.vec.y * dt;

    if (this.game.c.inputter.isDown(this.game.c.inputter.LEFT_ARROW)) {
      this.vec.x -= this.game.config.horizAccel * step;
    }

    if (this.game.c.inputter.isDown(this.game.c.inputter.RIGHT_ARROW)) {
      this.vec.x += this.game.config.horizAccel * step;
    }

    // TODO: This can lead to the player "wobbling" when horizontally still,
    // since the drag is applied inconsistently between frames and you never end up
    // at exactly 0 x velocity
    if (this.vec.x > 0) {
      this.vec.x += this.game.config.dragAccel * step;
    } else if (this.vec.x < 0) {
      this.vec.x -= this.game.config.dragAccel * step;
    }

    if (this.vec.x > this.game.config.horizMaxSpeed) {
      this.vec.x = this.game.config.horizMaxSpeed;
    } else if (this.vec.x < -this.game.config.horizMaxSpeed) {
      this.vec.x = -this.game.config.horizMaxSpeed;
    }

    this.center.x += this.vec.x;

    if (this.center.x > this.game.width - this.size.x / 2) {
      this.center.x = this.game.width - this.size.x / 2;
      this.vec.x = 0;
    } else if (this.center.x < this.size.x / 2) {
      this.center.x = this.size.x / 2;
      this.vec.x = 0;
    }
  }

  collision(other: Entity) {
    if (other instanceof Elastic) {
      if (other.isTop) {
        this.vec.y = this.getSpeed();
      } else {
        this.vec.y = -this.getSpeed();
      }
    }

    if (other instanceof Spike) {
      this.game.died();
    }
  }
}

module.exports = Player;
