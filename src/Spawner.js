/* @flow */

var Game = require('./Game');
var Timer = require('coquette-common/lib/Timer');
var _ = require('lodash');

var randInt = require('coquette-common/lib/math').randInt;
var Spike = require('./entities/Spike');


var SPIKE_T = 'spike';
var EMPTY_T = 'empty';

class Spawner {
  game: Game;
  totalTimer: Timer;
  nextSpawnTimer: Timer;

  constructor(game: Game) {
    this.game = game;

    this.totalTimer = new Timer();
    this.nextSpawnTimer = new Timer(this.getSpawnDelay());

    this.structures = this.game.config.structures.map((structure) => {
      return this.parseStructure(structure);
    });
  }

  update(dt: number) {
    this.totalTimer.update(dt);
    this.nextSpawnTimer.update(dt);

    if (this.nextSpawnTimer.expired()) {
      this.spawnNext();
      this.nextSpawnTimer = new Timer(this.getSpawnDelay());
    }
  }

  parseStructure(structure: string): Array<Array<any>> {
    var lines = structure.split('\n');

    // Chomp the whitespace off of each line
    lines = lines.map((line) => line.trim());

    // Chomp first and last lines if they are empty
    if (lines[0] === '') {
      lines = lines.slice(1);
    }
    if (lines[lines.length - 1] === '') {
      lines = lines.slice(0, -1);
    }

    // Ensure the structure rectangular (has no gaps on sides)
    var firstLineLength = lines[0].length;

    lines.forEach((line) => {
      if (line.length !== firstLineLength) {
        console.error(structure);
        throw new Error('Structure is not rectangular in form');
      }
    });

    // Parse the thing
    return lines.map((line) => {
      return _.map((line), (chr) => {
        if (chr === 'x') {
          return SPIKE_T;
        } else if (chr === '.') {
          return EMPTY_T;
        } else {
          throw new Error('Unrecognized character in structure ' + chr);
        }
      });
    });
  }

  createSpike(structX: number, structY: number, offsetX: number, offsetY: number) {
    this.game.createEntity(Spike, {
      vec: {
        x: 10,
        y: 0
      },
      center: {
        x: structX + offsetX,
        y: structY + offsetY
      }
    });
  }

  spawnNext() {
    var structure = _.sample(this.structures);

    var structW = structure[0].length * Spike.getWidth();
    var structH = structure.length * Spike.getHeight();

    var structX = 0 - structW;
    var structY = randInt(20, this.game.height - 20 - structH);

    structure.forEach((row, rowIdx) => {
      row.forEach((item, colIdx) => {
        if (item === SPIKE_T) {
          this.createSpike(structX, structY,
                           colIdx * Spike.getWidth(), rowIdx * Spike.getHeight());
        }
      });
    });

  }

  getSpawnDelay(): number {
    return 2000;
  }
}

module.exports = Spawner;
