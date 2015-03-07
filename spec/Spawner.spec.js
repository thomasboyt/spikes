var Spawner = require('../src/Spawner');
var expect = require('chai').expect;


var SPIKE_T = 'spike';
var EMPTY_T = 'empty';

describe('Spawner', () => {

  it('parses structures into arrays', () => {
    var spawner = new Spawner({
      config: {structures: []}
    });

    var verticalLine = `
      x
      x
      x
    `;

    var structure = spawner.parseStructure(verticalLine);

    expect(structure).to.deep.equal([[SPIKE_T], [SPIKE_T], [SPIKE_T]]);

    var circle = `
      .xx.
      x..x
      .xx.
    `;

    var circleStructure = spawner.parseStructure(circle);

    expect(circleStructure).to.deep.equal([
      [EMPTY_T, SPIKE_T, SPIKE_T, EMPTY_T],
      [SPIKE_T, EMPTY_T, EMPTY_T, SPIKE_T],
      [EMPTY_T, SPIKE_T, SPIKE_T, EMPTY_T]
    ]);
  });
});
