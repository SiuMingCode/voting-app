const { isHKID } = require('../src/utils')

test('Two letter valid HKID', () => {
  expect(isHKID('XA123456(8)')).toBeTruthy()
})

test('One letter valid HKID', () => {
  expect(isHKID('Y123456(9)')).toBeTruthy()
})

test('Check digit is A valid HKID', () => {
  expect(isHKID('Y555553(A)')).toBeTruthy()
})

test('Invalid HKID, wrong check digit', () => {
  expect(isHKID('Y123456(1)')).toBeFalsy()
})

test('Invalid HKID', () => {
  expect(isHKID('foo')).toBeFalsy()
})
