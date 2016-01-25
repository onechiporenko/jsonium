# JSONium

[![Build Status](https://travis-ci.org/onechiporenko/jsonium.svg)](https://travis-ci.org/onechiporenko/jsonium)
[![npm version](https://badge.fury.io/js/jsonium.png)](http://badge.fury.io/js/jsonium)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![Downloads](http://img.shields.io/npm/dm/jsonium.svg)](https://www.npmjs.com/package/jsonium)

## Install

```
npm i jsonium --save
```

## What?

Generator for creating all possible combinations of JSONs according to the provided templates and data sets.
Example:

```javascript
var Jsonium = require('jsonium');
var j = new Jsonium();
var templates = [
    {a: '{{sub}}', b: 1},
    {a: '{{sub}}', b: 2}
];
var keys = ['a'];
var datasets = [
    {sub: 'replace1'},
    {sub: 'replace2'}
];
var combos = j
    .setTemplates(templates)
    .createCombos(keys, datasets)
    .uniqueCombos()
    .getCombos();

console.log(combos); // [{a: 'replace1', b: 1}, {a: 'replace1', b: 2}, {a: 'replace2', b: 1}, {a: 'replace2', b: 2}]
```

## What've happened?

There are two templates. There is one key (`a`) where some replacing should be done. There are two datasets with values that will be placed in the templates. `setTemplates` just set templates to the generator. `createCombos` generate all possible combinations with replacing substrings from `datasets` in the template's `keys`. `uniqueCombos` remove duplicates from created combinations. `getCombos` just return created and filtered combinations.

`JSONium`-instance may be used in the another `JSONium`-instance. Example:

```javascript
var Jsonium = require('jsonium');

var templates = [
  {key1: '{{k1}}'}
];
var keys = ['key1'];
var datasets = [
  {k1: 'v1'},
  {k1: 'v2'}
];
var keys2 = ['key2'];
var templates2 = [
  {key2: '{{key1}} 1'},
  {key2: '{{key1}} 2'}
];
var J = new Jsonium();
J.setTemplates(templates).createCombos(keys, datasets);
var result = new Jsonium(templates2).createCombos(keys2, J).getCombos();
```

Here `J`'s created combinations will be used like datasets in the another `Jsonium`-instance.

`keys` may be nested (`a.b.c`) and indexed (`a.0`).

Each substring in the templates you want to be replaced should be wrapped with `{{`, `}}`.