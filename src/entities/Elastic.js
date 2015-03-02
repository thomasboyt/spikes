/* @flow */

var Entity = require('./Entity');

class Elastic extends Entity {
  isTop: boolean;

  init(settings: any) {
    this.center = settings.center;

    this.size = {
      x: this.game.width,
      y: 5
    };

    this.isTop = settings.isTop;
  }

  draw(ctx: any) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.size.x, this.size.y);
  }
}

module.exports = Elastic;
