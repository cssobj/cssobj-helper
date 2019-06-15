// helper functions for cssobj
// check n is numeric, or string of numeric
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
export function isPrimitive(val) {
    return val == null || (typeof val !== 'function' && typeof val !== 'object');
}
export function own(o, k) {
    return {}.hasOwnProperty.call(o, k);
}
// set default option (not deeply)
export function defaults(options, defaultOption) {
    var i;
    options = options || {};
    for (i in defaultOption) {
        if (own(defaultOption, i) && !(i in options))
            options[i] = defaultOption[i];
    }
    return options;
}
// Object.assgin polyfill
export function _assign(target, source) {
    var s, from, key;
    var to = Object(target);
    for (s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (key in from) {
            if (own(from, key)) {
                to[key] = from[key];
            }
        }
    }
    return to;
}
export var assign = Object.assign || _assign;
// console.log(assign({}, {a:1}, {a:2}, {b:3}))
// convert js prop into css prop (dashified)
export function dashify(str) {
    return str.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase();
    });
}
// capitalize str
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
// repeat str for num times
export function repeat(str, num) {
    return new Array(num + 1).join(str);
}
// random string, should used across all cssobj plugins
export var random = (function () {
    var count = 0;
    return function (prefix) {
        count++;
        return '_' + (prefix || '') + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_';
    };
})();
export function isString(value) {
    return typeof value === 'string';
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isEmpty(value) {
    var k;
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    else if (typeof value === 'object') {
        if (value) {
            for (k in value)
                return false;
        }
        return true;
    }
    else {
        return !value;
    }
}
// console.log(isEmpty([]), isEmpty(), isEmpty(null), isEmpty(''), isEmpty({}), isEmpty(23))
// set object path value, any Primitive/Non-exists will be set to {}
export function objSet(obj, _key, value) {
    var key = Array.isArray(_key) ? _key : String(_key).split('.');
    var p, n;
    for (p = 0; p < key.length - 1; p++) {
        n = key[p];
        if (!obj.hasOwnProperty(n) || isPrimitive(obj[n]))
            obj[n] = {};
        obj = obj[n];
    }
    return obj[key[p]] = value;
}
// var obj={a:{b:{c:1}}};
// objSet(obj, {} ,{x:1});
// objSet(obj,'a.b.c.d.e',{x:1});
// objSet(obj,'a.f.d.s'.split('.'), {y:1});
// console.log(JSON.stringify(obj))
// return object path with only object type
export function objGetObj(obj, _key) {
    var key = Array.isArray(_key) ? _key : String(_key).split('.');
    var p, n, ok = 1;
    var ret = { ok: ok, path: key, obj: obj };
    for (p = 0; p < key.length; p++) {
        n = key[p];
        if (!obj.hasOwnProperty(n) || isPrimitive(obj[n])) {
            ok = 0;
            break;
        }
        obj = obj[n];
    }
    ret.ok = ok;
    ret.path = key.slice(0, p);
    ret.obj = obj;
    return ret;
}
// var obj={a:{b:{c:1}}};
// console.log(objGetObj(obj))
// console.log(objGetObj(obj, []))
// console.log(objGetObj(obj, 'a'))
// console.log(objGetObj(obj, 'a.b'))
// console.log(objGetObj(obj, 'a.b.c.e'))
// extend obj from source, if it's no key in obj, create one
export function extendObj(obj, key, source) {
    var k;
    obj[key] = obj[key] || {};
    for (var args = arguments, i = 2; i < args.length; i++) {
        source = args[i];
        for (k in source)
            if (own(source, k))
                obj[key][k] = source[k];
    }
    return obj[key];
}
// ensure obj[k] as array, then push v into it
export function arrayKV(obj, k, v, reverse, unique) {
    var d = obj[k];
    d = obj[k] = k in obj ? (Array.isArray(d) ? d : [d]) : [];
    if (unique && d.indexOf(v) > -1)
        return;
    reverse ? d.unshift(v) : d.push(v);
}
// var d={}; arrayKV(d,'a',1)
// console.log(d)
// var d={a:2}; arrayKV(d,'a',1)
// console.log(d)
// var d={a:[2]}; arrayKV(d,'a',1)
// console.log(d)
// replace find in str, with rep function result
export function strSugar(str, find, rep) {
    return str.replace(new RegExp('\\\\?(' + find + ')', 'g'), function (m, z) {
        return m == z ? rep(z) : z;
    });
}
// get parents array from node (when it's passed the test)
export function getParents(node, test, key, childrenKey, parentKey) {
    var i, v, p = node, path = [];
    while (p) {
        if (test(p)) {
            if (childrenKey) {
                for (i = 0; i < path.length; i++) {
                    arrayKV(p, childrenKey, path[i], false, true);
                }
            }
            if (path[0] && parentKey) {
                path[0][parentKey] = p;
            }
            path.unshift(p);
        }
        p = p.parent;
    }
    for (i = 0; i < path.length; i++) {
        v = path[i];
        path[i] = key ? v[key] : v;
    }
    return path;
}
// check if str offset position in inside '' or ""
function insideStr(str, offset) {
    for (var i = 0, curPair = '', char; char = str[i], i < offset; i++) {
        if (curPair && curPair === char)
            curPair = '';
        else if (char == '"' || char == "'") {
            if (!curPair)
                curPair = char;
        }
    }
    return curPair;
}
// split selector with comma, aware of css attributes
export function splitComma(str) {
    for (var c, i = 0, n = 0, prev = 0, d = []; c = str.charAt(i); i++) {
        if (c == '(' || c == '[')
            n++;
        if (c == ')' || c == ']')
            n--;
        if (!n && c == ',')
            d.push(str.substring(prev, i)), prev = i + 1;
    }
    return d.concat(str.substring(prev));
}
// split selector with splitter, aware of css attributes
export function splitSelector(sel, splitter, inBracket) {
    if (sel.indexOf(splitter) < 0)
        return [sel];
    for (var c, i = 0, n = 0, instr = '', prev = 0, d = []; c = sel.charAt(i); i++) {
        if (instr) {
            if (c == instr && sel.charAt(i - 1) != '\\')
                instr = '';
            continue;
        }
        if (c == '"' || c == '\'')
            instr = c;
        /* istanbul ignore if  */
        if (!inBracket) {
            if (c == '(' || c == '[')
                n++;
            if (c == ')' || c == ']')
                n--;
        }
        if (!n && c == splitter)
            d.push(sel.substring(prev, i)), prev = i + 1;
    }
    return d.concat(sel.substring(prev));
}
// console.log(splitSelector(`.a:not(.b,.c),div[x="a,a'b,b"],p`, ','))
// console.log(splitSelector(`.a:not(.b,.c),div[x="a,a\\"b,b"],p`, ','))
// console.log(splitSelector(`.a:not(.b,.c),div[x="a,a\\"b,b"],p`, ',', true))
// console.log(splitSelector(`#SomeDropdown >option[value='a\\'b]<p>a']`, '>'))
// console.log(splitSelector('.item[.!xyz.abc.def]', '.', true))
// split char aware of syntax
export function syntaxSplit(str, splitter, keepSplitter, test, final) {
    var isString, isFeature, isSplitter, lastAst, feature = [], segment = [], result = [], ast = [], len = str.length;
    for (var c, i = 0; i <= len; i++) {
        c = str.charAt(i);
        lastAst = ast[0];
        isString = lastAst == '\'' || lastAst == '"';
        if (!isString) {
            if ('[(\'"'.indexOf(c) >= 0)
                ast.unshift(c);
            if ('])'.indexOf(c) >= 0)
                ast.shift();
        }
        else {
            if (c == lastAst)
                ast.shift();
        }
        if (lastAst) {
            segment.push(c);
        }
        else {
            isFeature = test && c && test(c, i, segment, result);
            isSplitter = c == splitter || !c;
            if (isSplitter && !keepSplitter)
                c = '';
            if (isFeature)
                feature.push(c);
            if (!isFeature || isSplitter)
                segment.push(feature.length ? final(feature.join('')) : '', c), feature = [];
            if (isSplitter)
                result.push(segment.join('')), segment = [];
        }
    }
    return result;
}
// checking for valid css value
export function isValidCSSValue(val) {
    // falsy: '', NaN, Infinity, [], {}
    return typeof val == 'string' && val || typeof val == 'number' && isFinite(val);
}
