const { isHKID } = require('../src/utils')

describe('Valid HKID', () => {
  test('Two letters', () => {
    expect(isHKID('XA123456(8)')).toBeTruthy()
  })

  test('One letter', () => {
    expect(isHKID('Y123456(9)')).toBeTruthy()
  })

  test('Check digit is A', () => {
    expect(isHKID('Y555553(A)')).toBeTruthy()
  })
})

describe('Invalid HKID', () => {
  test('Wrong check digit', () => {
    expect(isHKID('Y123456(1)')).toBeFalsy()
  })

  test('No brackets on check digit', () => {
    expect(isHKID('Y1234569')).toBeFalsy()
  })
})
