// helper functions for cssobj

// check n is numeric, or string of numeric
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function own(o, k) {
  return {}.hasOwnProperty.call(o, k)
}

// set default option (not deeply)
export function defaults(options, defaultOption) {
  options = options || {}
  for (var i in defaultOption) {
    if (own(defaultOption, i) && !(i in options)) options[i] = defaultOption[i]
  }
  return options
}

// convert js prop into css prop (dashified)
export function dashify(str) {
  return str.replace(/[A-Z]/g, function(m) {
    return '-' + m.toLowerCase()
  })
}

// capitalize str
export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

// repeat str for num times
export function repeat(str, num) {
  return new Array(num+1).join(str)
}

// don't use String.prototype.trim in cssobj, using below instead
export function trim(str) {
  return str.replace(/(^\s+|\s+$)/g, '')
}

// random string, should used across all cssobj plugins
export var random = (function () {
  var count = 0
  return function () {
    count++
    return '_' + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
  }
})()

// extend obj from source, if it's no key in obj, create one
export function extendObj (obj, key, source) {
  obj[key] = obj[key] || {}
  for (var k in source)
    if (own(source, k)) obj[key][k] = source[k]
  return obj[key]
}

// ensure obj[k] as array, then push v into it
export function arrayKV (obj, k, v, reverse, unique) {
  obj[k] = k in obj ? [].concat(obj[k]) : []
  if(unique && obj[k].indexOf(v)>-1) return
  reverse ? obj[k].unshift(v) : obj[k].push(v)
}

// replace find in str, with rep function result
export function strSugar (str, find, rep) {
  return str.replace(
    new RegExp('\\\\?(' + find + ')', 'g'),
    function (m, z) {
      return m == z ? rep(z) : z
    }
  )
}

// get parents array from node (when it's passed the test)
export function getParents (node, test, key, childrenKey, parentKey) {
  var p = node, path = []
  while(p) {
    if (test(p)) {
      if(childrenKey) path.forEach(function(v) {
        arrayKV(p, childrenKey, v, false, true)
      })
      if(path[0] && parentKey){
        path[0][parentKey] = p
      }
      path.unshift(p)
    }
    p = p.parent
  }
  return path.map(function(p){return key?p[key]:p })
}

// check if str offset position in inside '' or ""
function insideStr (str, offset) {
  for (var i = 0, curPair = '', char; char = str[i], i < offset; i++) {
    if (curPair && curPair === char) curPair = ''
    else if (char == '"' || char == "'") {
      if (!curPair) curPair = char
    }
  }
  return curPair
}

// split selector etc. aware of css attributes
export function splitComma (str) {
  for (var c, i = 0, n = 0, prev = 0, d = []; c = str.charAt(i); i++) {
    if (c == '(' || c == '[') n++
    if (c == ')' || c == ']') n--
    if (!n && c == ',') d.push(str.substring(prev, i)), prev = i + 1
  }
  return d.concat(str.substring(prev))
}

// checking for valid css value
export function isValidCSSValue (val) {
  // falsy: '', NaN, Infinity, [], {}
  return typeof val=='string' && val || typeof val=='number' && isFinite(val)
}


