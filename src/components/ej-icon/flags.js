const flags = {
  installed: false,
}

export function getFlag (flag) {
  return flags[flag]
}

export function setFlag (flag, value) {
  flags[flag] = value
}

export default getFlag
