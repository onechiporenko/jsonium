var cp = require('utils-copy');
var objectPath = require("object-path");
var type = require('typecheckjs');
var deepEqual = require('deep-equal');

function _find(collection, combo) {
  for (var i = 0; i < collection.length; i++) {
    var item = collection[i];
    if (deepEqual(item, combo)) {
      return true;
    }
  }
  return false;
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
    this._templates = templates;
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
  var _keysWhereReplace = type(Array).is(keysWhereReplace) ? keysWhereReplace : [keysWhereReplace];
  var _data = type(Jsonium).is(data) ? data.getCombos() : (type(Array).is(data) ? data : [data]);
  var self = this;
  this._templates.forEach(function(template) {
    _data.forEach(function (combo) {
      var t = cp(template);
      Object.keys(combo).forEach(function (key) {
        var comboKey = '{{' + key + '}}';
        _keysWhereReplace.forEach(function (keyWhereReplace) {
          if (objectPath.has(t, keyWhereReplace)) {
            var v = objectPath.get(t, keyWhereReplace);
            objectPath.set(t, keyWhereReplace, v.replace(new RegExp(comboKey), combo[key]));
          }
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
  this._results.concat(type(Jsonium).is(combos) ? combos.getCombos() : combos);
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
  this._results.forEach(function (combo) {
    if (!_find(ret, combo)) {
      ret.push(combo);
    }
  });
  this._results = ret;
  return this;
};

module.exports = Jsonium;