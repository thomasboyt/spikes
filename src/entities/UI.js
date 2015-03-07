/*
 * @flow
 * Displays the current UI for any given game state.
 */

var Entity = require('./Entity');

class UI extends Entity {
  init(settings: any) {
    // By default, this Entity draws *over* anything else.
    this.zindex = 1;
  }

  drawAttract(ctx: any) {
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'center';

    var center = this.game.width / 2;
    ctx.fillText('spikes', center, 80);
    ctx.fillText('use left/right arrows', center, 120);
    ctx.fillText('press space to start', center, 160);
  }

  drawPlaying(ctx: any) {
    ctx.font = '12px Helvetica';
    ctx.textAlign = 'right';
    var score = (this.game.sessionTime / 1000).toFixed(3);
    ctx.fillText(score, this.game.width - 10, this.game.height - 5);
  }

  drawEnd(ctx: any) {
    ctx.font = '32px Helvetica';
    ctx.textAlign = "center";

    var score = (this.game.sessionTime / 1000).toFixed(3);
    ctx.fillText('game over', this.game.width / 2, 120);
    ctx.fillText(`score: ${score}`, this.game.width / 2, 150);
  }

  drawLoading(ctx: any) {
    this._drawLoadingBar(ctx, 100, 250, 450, 20);
  }

  _drawLoadingBar(ctx: any, x: number, y: number, width: number, height: number) {
    var numTotal = this.game.preloader.numTotal;
    var numLoaded = this.game.preloader.numLoaded;

    var fillPercent = numLoaded / numTotal;
    var barWidth = width * fillPercent;

    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, barWidth, height);
  }

  draw(ctx: any) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    var fsm = this.game.fsm;

    if (fsm.is('playing')) {
      this.drawPlaying(ctx);
    } else if (fsm.is('ended')) {
      this.drawEnd(ctx);
    } else if (fsm.is('attract')) {
      this.drawAttract(ctx);
    } else if (fsm.is('loading')) {
      this.drawLoading(ctx);
    }

  }
}

module.exports = UI;
