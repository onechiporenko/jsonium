var Jsonium = require('jsonium');
var j = new Jsonium();

var templates = [
  {a: [{c: '{{k2}}', d: '{{k1}}'}, {c: '{{k2}}', d: '{{k1}}'}]},
  {a: [{c: '{{k1}}', d: '{{k2}}'}, {c: '{{k1}}', d: '{{k2}}'}]}
];

var keys = ['a.@each.{c,d}'];

var combos = [
  {k1: 'v11', k2: '21'},
  {k1: 'v12', k2: '22'},
  {k1: 'v13', k2: '23'},
  {k1: 'v14', k2: '24'}
];

var result = j
  .setTemplates(templates)
  .createCombos(keys, combos)
  .uniqueCombos()
  .getCombos();

console.log(result);
console.log(JSON.stringify(result, null, 2));