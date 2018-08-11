import regionData from './region'

const mixNumber = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const tailMap = ['1', '0' , 'X', '9', '8', '7', '6', '5', '4', '3', '2']

/**
 * @param  {Object} options options.amount must less than 200
 * @returns {Array<string>}
 */
function generate ({ regionCode = 110100, gender = 0, 
  birthdate = '1980-01-01', amount = 5}) {
  if (amount > 200) {
    throw new Error('Exceeded the maximum amount limit')
  }
  const padCodes = new Set()
  while (padCodes.size < amount) {
    const padCode = Math.ceil(900 * Math.random())
    if (padCode % 2 === gender) {
      // gender: 0 - famale 1 - male
      padCodes.add(String(padCode).padStart(3, '0'))
    } else {
      padCodes.add(String(padCode + 1).padStart(3, '0'))
    }
  }
  const idCodeArr = [...padCodes].map(code => {
    const part = regionCode + birthdate.replace(/-/g, '') + code
    let tail = [...part].reduce(
      (pre, cur, cIndex) => Number(pre) + Number(cur) * mixNumber[cIndex], 0) % 11
    tail = tailMap[tail]
    return part + tail
  })
  return idCodeArr
}

/**
 * @param  {String} idCard_code
 * @returns {Object | null}
 */
function parse (idCode) {
  try {
    const [raw, regionCode, birthdate, gender] = idCode.match(/(\d{6})(\d{8})(\d{3})([0-9x])/i)
    const provCode = regionCode.slice(0, 2) + '0000'
    const cityCode = regionCode.slice(0, 4) + '00'
    return {
      code: raw,
      prov: regionData.prov[provCode],
      city: regionData[provCode][cityCode],
      district: regionData[cityCode][regionCode],
      address: regionData.prov[provCode] + regionData[provCode][cityCode] + regionData[cityCode][regionCode],
      birthdate: `${birthdate.slice(0,4)}-${birthdate.slice(4,6)}-${birthdate.slice(6,8)}`,
      gender: gender % 2 ? '男' : '女',
      genderCode: gender % 2
    }
  } catch (error) {
    return null
  }
}

export default {
  generate,
  parse
}