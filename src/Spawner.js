/* @flow */

var Game = require('./Game');
var Timer = require('coquette-common/lib/Timer');

var randInt = require('coquette-common/lib/math').randInt;
var Spike = require('./entities/Spike');

class Spawner {
  game: Game;
  totalTimer: Timer;
  nextSpawnTimer: Timer;

  constructor(game: Game) {
    this.game = game;

    this.totalTimer = new Timer();
    this.spawnNext();
    this.nextSpawnTimer = new Timer(this.getSpawnDelay());
  }

  update(dt: number) {
    this.totalTimer.update(dt);
    this.nextSpawnTimer.update(dt);

    if (this.nextSpawnTimer.expired()) {
      this.spawnNext();
      this.nextSpawnTimer = new Timer(this.getSpawnDelay());
    }
  }

  spawnNext() {
    var cy = randInt(25, this.game.height - 25);

    this.game.createEntity(Spike, {
      vec: {
        x: 10,
        y: 0
      },
      center: {
        x: -5,
        y: cy
      }
    });
  }

  getSpawnDelay(): number {
    return 500;
  }
}

module.exports = Spawner;
