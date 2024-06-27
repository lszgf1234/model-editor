import enumerate from '~/js/enum'

export function getIndexType (val) {
  let it = enumerate.indextype.find(it => it.value === val)

  return it ? it.name : '--'
}

export function getQuoteType (val) {
  let it = enumerate.quoteType.find(it => it.value === val)

  return it ? it.name : '--'
}

export function getDatabase (val) {
  let it = enumerate.databases.find(it => it.value === val)

  return it ? it.name : '--'
}

