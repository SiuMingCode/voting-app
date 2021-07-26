function isHKID (str) {
  const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (str.length < 8) {
    return false
  }
  str = str.toUpperCase()
  const hkidPat = /^([A-Z]{1,2})([0-9]{6})\(([A0-9])\)$/
  const matchArray = str.match(hkidPat)
  if (matchArray === null) {
    return false
  }
  const charPart = matchArray[1]
  const numPart = matchArray[2]
  const checkDigit = matchArray[3]
  let checkSum = 0
  if (charPart.length === 2) {
    checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)))
    checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)))
  } else {
    checkSum += 9 * 36
    checkSum += 8 * (10 + strValidChars.indexOf(charPart))
  }

  for (let i = 0, j = 7; i < numPart.length; i++, j--) {
    checkSum += j * numPart.charAt(i)
  }
  const remaining = checkSum % 11
  const verify = (remaining === 0 ? 0 : 11 - remaining).toString()
  return verify === checkDigit || (verify === '10' && checkDigit === 'A')
}

module.exports = {
  isHKID
}
