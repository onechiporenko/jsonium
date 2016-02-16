var cp = require('utils-copy');
var o = require('object-path');
var type = require('typecheckjs');

/**
 * If `data` is an array, return it without any changes
 * Wrap `data` to the array otherwise
 *
 * @param {*} data
 * @returns {array}
 * @private
 */
function _makeArray(data) {
  return Array.isArray(data) ? data : [data];
}

/**
 * Generate list of the "simple" keys from the one "composite" key with "@each" and braces-blocks
 *
 * @param {object} template
 * @param {string} key
 * @returns {string[]}
 * @private
 */
function _prepareKeys(template, key) {
  return [].concat.apply([], _checkBraces(key).map(function (k) {
    return _checkEach(template, k);
  }));
}

/**
 * Generate list of keys
 * Example1:
 * <pre>
 *   var key = 'a.{b,c}';
 *   var mappedKeys = _checkBraces(key);
 *   console.log(mappedKeys); // ['a.b', 'a.c']
 * </pre>
 * Example2:
 * <pre>
 *   var key = '{a,b}.{c,d}';
 *   var mappedKeys = _checkBraces(key);
 *   console.log(mappedKeys); // ['a.c', 'a.d', 'b.c', 'b.d']
 * </pre>
 * Example3:
 * <pre>
 *   var key = 'a.{b.c,d.e}';
 *   var mappedKeys = _checkBraces(key);
 *   console.log(mappedKeys); // ['a.b.c', 'a.d.e']
 * </pre>
 *
 * @param {string} key
 * @returns {string[]}
 * @private
 */
function _checkBraces(key) {
  if (key.indexOf('{') !== -1 && key.indexOf('}') !== -1) {
    var ret = [];
    var tpl = '';
    var _keys = _splitKey(key);
    _keys.forEach(function (_k, index) {
      if (_k.indexOf('{') === 0 && _k.indexOf('}') === _k.length - 1) {
        var _subKeys = _keys.slice(index + 1).join('.');
        _k.slice(1, -1).split(',').forEach(function (__k) {
          ret = ret.concat(_checkBraces(tpl + __k.trim() + (_subKeys ? '.' + _subKeys : '')));
        });
      }
      else {
        tpl += _k + '.';
      }
    });
    return ret;
  }
  return [key];
}

/**
 * Split string by '.' ignoring dots inside braces '{...}'
 * Example1:
 * <pre>
 *   var key = 'a.b.c';
 *   var keys = _splitKey(key);
 *   console.log(keys); // ['a', 'b', 'c']
 * </pre>
 * Example2:
 * <pre>
 *   var key = 'a.{b.c}.d';
 *   var keys = _splitKey(key);
 *   console.log(keys); // ['a', '{b.c}', 'd']
 * </pre>
 *
 * @param {string} key
 * @returns {string[]}
 * @private
 */
function _splitKey(key) {
  var insideBraces = false;
  var currentWord = '';
  var keys = [];
  for (var i = 0; i < key.length; i++) {
    currentWord += key[i];
    if (key[i] === '{') {
      insideBraces = true;
      continue;
    }
    if (key[i] === '}') {
      insideBraces = false;
      continue;
    }
    if (key[i] === '.' && !insideBraces) {
      keys.push(currentWord.slice(0, -1));
      currentWord = '';
    }
  }
  keys.push(currentWord);
  return keys;
}

/**
 * Generate list of keys to be replaced according to the template
 * Example1:
 * <pre>
 *   var template = {a: [{b: ''}, {b: ''}]};
 *   var key = 'a.@each.b';
 *   var mappedKeys = _checkEach(template, key);
 *   console.log(mappedKeys); // ['a.0.b', 'a.1.b']
 * </pre>
 * Example2:
 * <pre>
 *   var template = {a: {b: {c: ''}};
 *   var key = 'a.b.c';
 *   var mappedKeys = _checkEach(template, key);
 *   console.log(mappedKeys); // ['a.b.c']
 * </pre>
 *
 * @param {object} template
 * @param {string} key
 * @returns {string[]}
 * @private
 */
function _checkEach(template, key) {
  if (key.indexOf('@each') !== -1) {
    var subKeys = key.split('@each');
    var listKey = subKeys[0].slice(0, -1); // remove last '.'
    var d = o.get(template, listKey);
    return [].concat.apply([], d.map(function (item, index) {
      return _checkEach(template, listKey + '.' + index + subKeys.slice(1).join('@each'));
    }));
  }
  return [key];
}

/**
 * @param {object[]} templates
 * @constructor
 */
var Jsonium = function (templates) {
  this.setTemplates(templates);
  this._results = [];
};

Jsonium.prototype.constructor = Jsonium;

/**
 * Set templates for further create combos
 *
 * @param {object[]} templates
 * @returns {Jsonium}
 */
Jsonium.prototype.setTemplates = function (templates) {
  if (type(Array).of(Object).is(templates)) {
    this._templates = cp(templates);
  }
  return this;
};

/**
 * Create combinations from templates with replacing in the needed keys substrings with combo-data
 * Replaced keys in the templates should be wrapped with '{{', '}}'
 * Example:
 * <pre>
 *  var j = new Jsonium();
 *  var combos = j
 *    .setTemplates([{a: '{{f1}} 1'}, {a: '{{f1}} 2'}])
 *    .createCombos(['a'], [{f1: 'd1'}, {f1: 'd2'}])
 *    .getCombos();
 *  console.log(combos); // [{a: 'd1 1'}, {a: 'd2 1'}, {a: 'd1 2'}, {a: 'd2 2'}]
 * </pre>
 *
 * @param {string|string[]} keysWhereReplace list of keys in the templates where substrings will be replaced
 * @param {object|object[]|Jsonium} data map with replacing. keys - substrings to replace, values - new substrings
 * @returns {Jsonium}
 */
Jsonium.prototype.createCombos = function (keysWhereReplace, data) {
  var _keysWhereReplace = _makeArray(keysWhereReplace);
  var _data = type(Jsonium).is(data) ? data.getCombos() : _makeArray(data);
  var self = this;
  this.clearCombos();
  this._templates.forEach(function (template) {
    _data.forEach(function (combo) {
      var t = cp(template);
      Object.keys(combo).forEach(function (key) {
        var comboKey = '{{' + key + '}}';
        _keysWhereReplace.forEach(function (keyWhereReplace) {
          _prepareKeys(t, keyWhereReplace).forEach(function (_k) {
            if (o.has(t, _k)) {
              var v = o.get(t, _k);
              if (type(String).is(v)) {
                o.set(t, _k, v.replace(new RegExp(comboKey, 'g'), combo[key]));
              }
              else {
                o.set(t, _k, combo[_k]);
              }
            }
          });
        });
      });
      self._results.push(t);
    });
  });
  return this;
};

/**
 * Concat current combos with other combos
 *
 * @param {Jsonium|object[]} combos may be list of js-objects or another Jsonium-instance with combos
 * @return {Jsonium}
 */
Jsonium.prototype.concatCombos = function (combos) {
  this._results = this._results.concat(type(Jsonium).is(combos) ? combos.getCombos() : (type(Array).of(Object).is(combos) ? combos : []));
  return this;
};

/**
 * Replace keys in the created combos. Set value from old key to the new one
 * Old key is deleted
 *
 * @param {string|object} keyBefore
 * @param {string} [keyAfter]
 * @returns {Jsonium}
 */
Jsonium.prototype.switchKeys = function (keyBefore, keyAfter) {
  var map = {};
  if (arguments.length === 2) {
    map[keyBefore] = keyAfter;
  }
  else {
    map = keyBefore;
  }
  this._results.forEach(function (item) {
    Object.keys(map).forEach(function (kB) {
      if (item.hasOwnProperty(kB)) {
        var kA = map[kB];
        item[kA] = cp(item[kB]);
        delete item[kB];
      }
    });
  });
  return this;
};

/**
 * Get created combinations
 *
 * @returns {object[]}
 */
Jsonium.prototype.getCombos = function () {
  return this._results;
};

/**
 * Clear combinations
 *
 * @returns {Jsonium}
 */
Jsonium.prototype.clearCombos = function () {
  this._results = [];
  return this;
};

/**
 * Clear templates
 *
 * @returns {Jsonium}
 */
Jsonium.prototype.clearTemplates = function () {
  this._templates = [];
  return this;
};

/**
 * Remove duplicates from combinations
 *
 * @returns {Jsonium}
 */
Jsonium.prototype.uniqueCombos = function () {
  var ret = [];
  var map = {};
  this._results.forEach(function (combo) {
    var str = JSON.stringify(combo);
    if (!map[str]) {
      ret.push(combo);
      map[str] = true;
    }
  });
  this._results = ret;
  return this;
};

/**
 * Move created combos to the templates
 *
 * @returns {Jsonium}
 */
Jsonium.prototype.useCombosAsTemplates = function () {
  this._templates = cp(this._results);
  return this;
};

module.exports = Jsonium;