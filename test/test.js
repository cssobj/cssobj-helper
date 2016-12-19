const {expect} = require('chai')
const lib = require('../')

describe('syntaxSplit', () => {
  it('should work with empty str', () => {
    expect(lib.syntaxSplit('')).deep.equal([''])
  })
  it('should work with basic string', () => {
    expect(lib.syntaxSplit('abc,def, cc  ,, sdf', ',')).deep.equal([ 'abc', 'def', ' cc  ', '', ' sdf' ])
  })
  it('should work with syntax pair string', () => {
    expect(lib.syntaxSplit('abc,d[,di()fj&[ijf,fji],fij,]ef, cc [(dif),(sd,if)] ,, sdf', ',')).deep.equal([ 'abc', 'def', ' cc  ', '', ' sdf' ])
  })
})
