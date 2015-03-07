/*
 * @flow
 * A central location for various constants in your game, such as movement speed, the number of
 * lives to start with, or the initial spawn rate of enemies.
 *
 * Placing your constants here, rather than as local variables, allows you to tweak your game while
 * it runs with coquette-inspect (https://github.com/thomasboyt/coquette-inspect)
 */

module.exports = {
  bpm: 120/2,

  horizAccel: 2,
  dragAccel: -1,
  horizMaxSpeed: 3,

  structures: [`
    .xx.
    x..x
    x..x
    .xx.
  `, `
    x
    .
    x
    .
    x
  `, `
    x..x..x
  `]
};
