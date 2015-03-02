/*
 * @flow
 */

var Coquette = require('coquette');

var StateMachine = require('javascript-state-machine');
var addRegister = require('./lib/addRegister');
var AudioManager = require('./lib/AudioManager');
var AssetPreloader = require('./lib/AssetPreloader');
var setupFullscreen = require('./lib/setupFullscreen');

var assets = require('./config/assets');
var config = require('./config/game');

var Entity = require('./entities/Entity');
var UI = require('./entities/UI');
var Player = require('./entities/Player');
var Elastic = require('./entities/Elastic');
var Spike = require('./entities/Spike');
var Spawner = require('./Spawner');

type AssetMap = {
  images: {
    [key: string]: Image;
  };
  audio: {
    [key:string]: ArrayBuffer;
  };
}

class Game {
  c: Coquette;
  assets: AssetMap;
  width: number;
  height: number;
  ui: UI;
  _spawner: Spawner;

  constructor() {
    this.audioManager = new AudioManager();

    this.assets = assets;
    this.config = config;

    this.width = 320;
    this.height = 240;

    this.c = window.__coquette__ = new Coquette(this, 'game-canvas', this.width, this.height, 'black');
    this.c.renderer.getCtx().imageSmoothingEnabled = false;

    setupFullscreen(this.c.inputter.F);
    addRegister(this.c);

    this.fsm = StateMachine.create({
      initial: 'loading',
      events: [
        { name: 'loaded', from: ['loading'], to: 'attract' },
        { name: 'start', from: ['attract', 'ended'], to: 'playing' },
        { name: 'end', from: 'playing', to: 'ended' }
      ]
    });

    this.preloader = new AssetPreloader(assets, this.audioManager.ctx);
    this.ui = this.createEntity(UI, {});

    this.preloader.load().done((assets) => {
      this.loaded(assets);
    });
  }

  // TODO: debustify type checking on the argument here :I
  createEntity(type, settings: Object): any {
    var entity = new type(this, settings);
    this.c.entities.register(entity);
    return entity;
  }


  // State changes

  loaded(assets: AssetMap) {
    this.fsm.loaded();

    this.assets = assets;
    this.audioManager.setAudioMap(assets.audio);

    setTimeout(() => {
      this.start();
    }, 0);
  }

  start() {
    this.fsm.start();

    this.createEntity(Elastic, {
      isTop: true,
      center: {
        x: this.width / 2,
        y: 20
      }
    });

    this.createEntity(Elastic, {
      isTop: false,
      center: {
        x: this.width / 2,
        y: this.height - 20
      }
    });

    this._spawner = new Spawner(this);

    this.createEntity(Player, {
      center: { x: this.width / 2, y: this.height / 2 },
      color: '#f07'
    });
  }

  clearWorld() {
    var entities = [Player, Elastic, Spike];

    entities.forEach((type) => {
      var items = this.c.entities.all(type);
      items.forEach((item) => {
        this.c.entities.destroy(item);
      });
    });
  }

  died() {
    this.clearWorld();
    this.fsm.end();
  }


  // Coquette hooks

  update(dt: number) {
    if (this.c.inputter.isPressed(this.c.inputter.M)) {
      this.audioManager.toggleMute();
    }

    if (this.fsm.is('attract') || this.fsm.is('ended')) {
      if (this.c.inputter.isPressed(this.c.inputter.SPACE)) {
        setTimeout(() => {
          this.start(this.fsm);
        }, 0);
      }
    }

    if (this.fsm.is('playing')) {
      this._spawner.update(dt);
    }
  }
}

module.exports = Game;
