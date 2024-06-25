import common from './common'
import attr from './attr'
import indexes from './idnexes'
import draw from './draw'
import quote from './quote'
import model from './model'

let obj = Object.assign(
  {},
  common,
  attr,
  indexes,
  draw,
  quote,
  model,
)

function enumerate () {
  let ENUM = []
  for (let k in obj) {
    ENUM[k] = obj[k]
    obj[k].forEach(item => {
      ENUM[k][item.key] = item
    })
  }
  return ENUM
}

export default enumerate()
