const {expect} = require('chai')
const lib = require('../')

describe('splitSelector', () => {
  it('should work with empty str', () => {
    expect(lib.splitSelector('')).deep.equal([''])
  })
  it('should work with basic str', () => {
    expect(lib.splitSelector('body')).deep.equal(['body'])
  })
  it('should work with basic string', () => {
    expect(lib.splitSelector('abc,def, cc  ,, sdf', ','))
      .deep.equal([ 'abc', 'def', ' cc  ', '', ' sdf' ])
  })
  it('should work with syntax pair string', () => {
    expect(lib.splitSelector('d[,di()fj&[ijf,fji],fij,]ef, cc [(dif),(sd,if)]', ','))
      .deep.equal([ 'd[,di()fj&[ijf,fji],fij,]ef', ' cc [(dif),(sd,if)]'])
  })
  it('should work with complex string', () => {
    expect(lib.splitSelector('sdf,ioj[difj="ioj,f o\'ij]i,dj"],fijd(iojfd&idf,fidj)idjf', ','))
      .deep.equal([ 'sdf',
                    'ioj[difj="ioj,f o\'ij]i,dj"]',
                    'fijd(iojfd&idf,fidj)idjf' ])
  })
})

describe('syntaxSplit', () => {
  it('should work with empty str', () => {
    expect(lib.syntaxSplit('')).deep.equal([''])
  })
  it('should work with basic string', () => {
    expect(lib.syntaxSplit('abc,def, cc  ,, sdf', ',')).deep.equal([ 'abc', 'def', ' cc  ', '', ' sdf' ])
  })
  it('should work with syntax pair string', () => {
    expect(lib.syntaxSplit('d[,di()fj&[ijf,fji],fij,]ef, cc [(dif),(sd,if)]', ',')).deep.equal([ 'd[,di()fj&[ijf,fji],fij,]ef', ' cc [(dif),(sd,if)]'])
  })
  it('should work with test & replace 1', () => {
    expect(lib.syntaxSplit(
      'as&fdf,&&df[d&s"oi&sd,jf"f,i[&df,fij]jo]&, oij&',
      ',',
      false,
      c => '&'.indexOf(c) > -1,
      f => '----'
    )).deep.equal(
      [ 'as----fdf',
        '----df[d&s"oi&sd,jf"f,i[&df,fij]jo]----',
        ' oij----' ]
    )
  })
  it('should work with test & replace 2', () => {
    expect(lib.syntaxSplit(
      'd[,di(fd,d&f)fj"d=[i&&j(d,d)f,fji]",fij,]e&#f#&,sdf(&)',
      ',',
      false,
      c => '&#'.indexOf(c) > -1,
      f => f+'----'
    )).deep.equal(
      [ 'd[,di(fd,d&f)fj"d=[i&&j(d,d)f,fji]",fij,]e&#----f#&----',
        'sdf(&)' ]
    )
  })
})
