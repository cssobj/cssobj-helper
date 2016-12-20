(function (exports) {
'use strict';

// helper functions for cssobj

// check n is numeric, or string of numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function own(o, k) {
  return {}.hasOwnProperty.call(o, k)
}

// set default option (not deeply)
function defaults(options, defaultOption) {
  options = options || {};
  for (var i in defaultOption) {
    if (own(defaultOption, i) && !(i in options)) options[i] = defaultOption[i];
  }
  return options
}

// convert js prop into css prop (dashified)
function dashify(str) {
  return str.replace(/[A-Z]/g, function(m) {
    return '-' + m.toLowerCase()
  })
}

// capitalize str
function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

// repeat str for num times
function repeat(str, num) {
  return new Array(num+1).join(str)
}

// random string, should used across all cssobj plugins
var random = (function () {
  var count = 0;
  return function (prefix) {
    count++;
    return '_' + (prefix||'') + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
  }
})();

// extend obj from source, if it's no key in obj, create one
function extendObj (obj, key, source) {
  obj[key] = obj[key] || {};
  for(var args = arguments, i = 2; i < args.length; i++) {
    source = args[i];
    for (var k in source)
      if (own(source, k)) obj[key][k] = source[k];
  }
  return obj[key]
}

// ensure obj[k] as array, then push v into it
function arrayKV (obj, k, v, reverse, unique) {
  obj[k] = k in obj ? [].concat(obj[k]) : [];
  if(unique && obj[k].indexOf(v)>-1) return
  reverse ? obj[k].unshift(v) : obj[k].push(v);
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
function getParents (node, test, key, childrenKey, parentKey) {
  var p = node, path = [];
  while(p) {
    if (test(p)) {
      if(childrenKey) path.forEach(function(v) {
        arrayKV(p, childrenKey, v, false, true);
      });
      if(path[0] && parentKey){
        path[0][parentKey] = p;
      }
      path.unshift(p);
    }
    p = p.parent;
  }
  return path.map(function(p){return key?p[key]:p })
}

// split selector with comma, aware of css attributes
function splitComma (str) {
  for (var c, i = 0, n = 0, prev = 0, d = []; c = str.charAt(i); i++) {
    if (c == '(' || c == '[') n++;
    if (c == ')' || c == ']') n--;
    if (!n && c == ',') d.push(str.substring(prev, i)), prev = i + 1;
  }
  return d.concat(str.substring(prev))
}

// split selector with splitter, aware of css attributes
function splitSelector (sel, splitter) {
  for (var c, i = 0, n = 0, instr = '', prev = 0, d = []; c = sel.charAt(i); i++) {
    if (instr) {
      if (c == instr) instr = '';
      continue
    }
    if (c == '"' || c == '\'') instr = c;
    if (c == '(' || c == '[') n++;
    if (c == ')' || c == ']') n--;
    if (!n && c == splitter) d.push(sel.substring(prev, i)), prev = i + 1;
  }
  return d.concat(sel.substring(prev))
}

// split char aware of syntax
function syntaxSplit (str, splitter, keepSplitter, test, final) {
  var isString, isFeature, isSplitter, lastAst,
      feature = [], segment = [], result = [], ast = [], len = str.length;
  for (var c, i = 0; i <= len; i++) {
    c = str.charAt(i);
    lastAst = ast[0];
    isString = lastAst == '\'' || lastAst == '"';
    if (!isString) {
      if ('[(\'"'.indexOf(c) >= 0) ast.unshift(c);
      if ('])'.indexOf(c) >= 0) ast.shift();
    } else {
      if (c == lastAst) ast.shift();
    }
    if (lastAst) {
      segment.push(c);
    } else {
      isFeature = test && c && test(c, i, segment, result);
      isSplitter = c == splitter || !c;
      if (isSplitter && !keepSplitter) c = '';
      if (isFeature) feature.push(c);
      if (!isFeature || isSplitter) segment.push(feature.length ? final(feature.join('')) : '', c), feature = [];
      if (isSplitter) result.push(segment.join('')), segment = [];
    }
  }
  return result
}

// checking for valid css value
function isValidCSSValue (val) {
  // falsy: '', NaN, Infinity, [], {}
  return typeof val=='string' && val || typeof val=='number' && isFinite(val)
}

exports.isNumeric = isNumeric;
exports.own = own;
exports.defaults = defaults;
exports.dashify = dashify;
exports.capitalize = capitalize;
exports.repeat = repeat;
exports.random = random;
exports.extendObj = extendObj;
exports.arrayKV = arrayKV;
exports.strSugar = strSugar;
exports.getParents = getParents;
exports.splitComma = splitComma;
exports.splitSelector = splitSelector;
exports.syntaxSplit = syntaxSplit;
exports.isValidCSSValue = isValidCSSValue;

}((this.cssobj_helper = this.cssobj_helper || {})));
