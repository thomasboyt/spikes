/* @flow */

var Coquette = require('coquette');
var Entity = require('./Entity');

type Coordinates = {x: number; y: number};

class Spike extends Entity {
  vec: Coordinates;

  init(settings: any) {
    this.vec = settings.vec;
    this.center = settings.center;

    this.size = {x: 10, y: 10};
    this.boundingBox = Coquette.Collider.CIRCLE;

    this.angle = 0;
  }

  draw(ctx: any) {
    var hw = this.size.x / 2;
    var hh = this.size.y / 2;

    ctx.fillStyle = 'yellow';

    var numSpikes = 8;
    var degrees = 360 / numSpikes;
    for (var i = 0; i < numSpikes; i++) {
      ctx.fillRect(this.center.x - hw, this.center.y - 1, this.size.x, 2);
      ctx.translate(this.center.x, this.center.y);
      ctx.rotate(degrees * Math.PI / 180);
      ctx.translate(-this.center.x, -this.center.y);
    }

    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.translate(-this.center.x, -this.center.y);
  }

  update(dt: number) {
    var spd = dt / 10;
    this.angle = (this.angle + spd) % 360;

    this.center.x += this.vec.x * dt/100;
    this.center.y += this.vec.y * dt/100;

    if (this.center.x > this.game.width) {
      this.game.c.entities.destroy(this);
    }
  }
}

module.exports = Spike;
