(function (exports) {
  'use strict';

  // helper functions for cssobj

  // set default option (not deeply)
  function defaults(options, defaultOption) {
    options = options || {}
    for (var i in defaultOption) {
      if (!(i in options)) options[i] = defaultOption[i]
    }
    return options
  }

  // convert js prop into css prop (dashified)
  function dashify(str) {
    return str.replace(/[A-Z]/g, function(m) {
      return '-' + m.toLowerCase()
    })
  }

  // don't use String.prototype.trim in cssobj, using below instead
  function trim(str) {
    return str.replace(/(^\s+|\s+$)/g, '')
  }

  // random string, should used across all cssobj plugins
  var random = (function () {
    var count = 0
    return function () {
      count++
      return '_' + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
    }
  })()

  // extend obj from source, if it's no key in obj, create one
  function extendObj (obj, key, source) {
    obj[key] = obj[key] || {}
    for (var k in source) obj[key][k] = source[k]
    return obj[key]
  }

  // ensure obj[k] as array, then push v into it
  function arrayKV (obj, k, v, reverse, unique) {
    obj[k] = obj[k] || []
    if(unique && obj[k].indexOf(v)>-1) return
    reverse ? obj[k].unshift(v) : obj[k].push(v)
  }

  // replace find in str, with rep function result
  function strSugar (str, find, rep) {
    return str.replace(
      new RegExp('\\\\?(' + find + ')', 'g'),
      function (m, z) {
        return m == z ? rep(z) : z
      }
    )
  }

  // get parents array from node (when it's passed the test)
  function getParents (node, test, key, childrenKey) {
    var p = node, path = []
    while(p) {
      if (test(p)) {
        if(childrenKey) path.forEach(function(v) {
          arrayKV(p, childrenKey, v, false, true)
        })
        path.unshift(p)
      }
      p = p.parent
    }
    return path.map(function(p){return key?p[key]:p })
  }


  // split selector etc. aware of css attributes
  function splitComma (str) {
    for (var c, i = 0, n = 0, prev = 0, d = []; c = str.charAt(i); i++) {
      if (c == '(' || c == '[') n++
      if (c == ')' || c == ']') n--
      if (!n && c == ',') d.push(str.substring(prev, i)), prev = i + 1
    }
    return d.concat(str.substring(prev))
  }

  // checking for valid css value
  function isValidCSSValue (val) {
    return val || val === 0
  }

  exports.defaults = defaults;
  exports.dashify = dashify;
  exports.trim = trim;
  exports.random = random;
  exports.extendObj = extendObj;
  exports.arrayKV = arrayKV;
  exports.strSugar = strSugar;
  exports.getParents = getParents;
  exports.splitComma = splitComma;
  exports.isValidCSSValue = isValidCSSValue;

}((this.cssobj_helper = this.cssobj_helper || {})));