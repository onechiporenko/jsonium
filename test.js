var Jsonium = require('./index.js');
var chai = require('chai');
var expect = chai.expect;

describe('Jsonium', function () {

  beforeEach(function () {
    this.J = new Jsonium();
  });

  describe('#createCombos', function () {

    describe('simple example', function () {

      beforeEach(function () {
        this.templates = [
          {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
          {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
        ];
        this.keys = ['key1', 'key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: 'v1 1', key2: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: 'v3 1', key2: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key1: 'v1 2', key2: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key1: 'v3 2', key2: '{{k2}} 2', key3: 'v4 2'});
      });

    });

    describe('multiple replace in one key', function () {

      beforeEach(function () {
        this.templates = [
          {key1: '{{k1}} {{k1}} 1'},
          {key1: '{{k1}} {{k1}} 2'}
        ];
        this.keys = 'key1';
        this.combos = [
          {k1: 'v1'},
          {k1: 'v3'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: 'v1 v1 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: 'v3 v3 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key1: 'v1 v1 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key1: 'v3 v3 2'});
      });

    });

    describe('nested keys', function () {

      beforeEach(function () {
        this.templates = [
          {s: {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'}},
          {s: {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}}
        ];
        this.keys = ['s.key1', 's.key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0].s).to.be.eql({key1: 'v1 1', key2: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1].s).to.be.eql({key1: 'v3 1', key2: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2].s).to.be.eql({key1: 'v1 2', key2: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3].s).to.be.eql({key1: 'v3 2', key2: '{{k2}} 2', key3: 'v4 2'});
      });

    });

    describe('indexed keys', function () {

      beforeEach(function () {
        this.templates = [
          {key1: ['1', '{{k1}} 1'], key2: '{{k2}} 1', key3: '{{k3}} 1'},
          {key1: ['1', '{{k1}} 2'], key2: '{{k2}} 2', key3: '{{k3}} 2'}
        ];
        this.keys = ['key1.1', 'key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: ['1', 'v1 1'], key2: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: ['1', 'v3 1'], key2: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key1: ['1', 'v1 2'], key2: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key1: ['1', 'v3 2'], key2: '{{k2}} 2', key3: 'v4 2'});
      });

    });

    describe('empty keys', function () {

      beforeEach(function () {
        this.templates = [
          {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
          {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
        ];
        this.keys = [];
        this.combos = [
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).uniqueCombos().getCombos();
      });

      it('2 combos created', function () {
        expect(this.result).to.have.property('length').equal(2);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'});
      });

    });

    describe('empty combos', function () {

      beforeEach(function () {
        this.templates = [
          {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
          {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
        ];
        this.keys = ['key1', 'key2', 'key3'];
        this.combos = [];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('no combos', function () {
        expect(this.result).to.be.empty;
      });

    });

    describe('combo-property does not exist in the templates', function () {

      beforeEach(function () {
        this.templates = [
          {s: {key1: '{{k1}} 1', key2: '{{k2}} 1'}},
          {s: {key1: '{{k1}} 2', key2: '{{k2}} 2'}}
        ];
        this.keys = ['s.key1', 's.key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2', 's.key3': 'custom'},
          {k1: 'v3', k3: 'v4', 's.key3': 'custom'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0].s).to.be.eql({key1: 'v1 1', key2: '{{k2}} 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1].s).to.be.eql({key1: 'v3 1', key2: '{{k2}} 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2].s).to.be.eql({key1: 'v1 2', key2: '{{k2}} 2'});
      });

      it('4th combo', function () {
        expect(this.result[3].s).to.be.eql({key1: 'v3 2', key2: '{{k2}} 2'});
      });

    });

    describe('combo-property is not a string in the templates', function () {

      beforeEach(function () {
        this.templates = [
          {s: {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: 1234}},
          {s: {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: 1234}}
        ];
        this.keys = ['s.key1', 's.key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2', 's.key3': 'custom'},
          {k1: 'v3', k3: 'v4', 's.key3': 'custom'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0].s).to.be.eql({key1: 'v1 1', key2: '{{k2}} 1', key3: 'custom'});
      });

      it('2nd combo', function () {
        expect(this.result[1].s).to.be.eql({key1: 'v3 1', key2: '{{k2}} 1', key3: 'custom'});
      });

      it('3rd combo', function () {
        expect(this.result[2].s).to.be.eql({key1: 'v1 2', key2: '{{k2}} 2', key3: 'custom'});
      });

      it('4th combo', function () {
        expect(this.result[3].s).to.be.eql({key1: 'v3 2', key2: '{{k2}} 2', key3: 'custom'});
      });

    });

    describe('Jsonium as combos', function () {

      beforeEach(function () {
        this.templates = [
          {key1: '{{k1}}'}
        ];
        this.keys = ['key1'];
        this.combos = [
          {k1: 'v1'},
          {k1: 'v2'}
        ];
        this.keys2 = ['key2'];
        this.templates2 = [
          {key2: '{{key1}} 1'},
          {key2: '{{key1}} 2'}
        ];
        this.J.setTemplates(this.templates).createCombos(this.keys, this.combos);
        this.result = new Jsonium(this.templates2).createCombos(this.keys2, this.J).getCombos();
      });

      it('4 combos are created', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key2: 'v1 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key2: 'v2 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key2: 'v1 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key2: 'v2 2'});
      });

    });

    describe('templates without {{ }}', function () {

      beforeEach(function () {
        this.templates = [
          {key1: 'k1 1', key2: 'k2 1', key3: 'k3 1'},
          {key1: 'k1 2', key2: 'k2 2', key3: 'k3 2'}
        ];
        this.keys = ['key1', 'key3'];
        this.combos = [
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).uniqueCombos().getCombos();
      });

      it('2 combos are created', function () {
        expect(this.result).to.have.property('length').equal(2);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: 'k1 1', key2: 'k2 1', key3: 'k3 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: 'k1 2', key2: 'k2 2', key3: 'k3 2'});
      });

    });

    describe('`keys` with `@each`', function() {

      beforeEach(function () {
        this.templates = [
          {
            key1:
              [
                {key2: '{{k2}} 1'},
                {key2: '{{k2}} 2'},
                {key2: '{{k2}} 3'}
              ]
          }
        ];
        this.keys = ['key1.@each.key2'];
        this.combos = [
          {k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).uniqueCombos().getCombos();
      });

      it('1 combo is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: [{key2: 'v2 1'}, {key2: 'v2 2'}, {key2: 'v2 3'}]});
      });

    });

    describe('`keys` with `@each` (2)', function() {

      beforeEach(function () {
        this.templates = [
          {
            key1:
              [
                '{{k2}} 1',
                '{{k2}} 2',
                '{{k2}} 3'
              ]
          }
        ];
        this.keys = ['key1.@each'];
        this.combos = [
          {k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).uniqueCombos().getCombos();
      });

      it('1 combo is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: ['v2 1', 'v2 2', 'v2 3']});
      });

    });

    describe('`keys` with nested `@each`', function() {

      beforeEach(function () {
        this.templates = [
          {
            key1:
              [
                {
                  key2:
                    [
                      {key3: '{{k3}} 1'},
                      {key3: '{{k3}} 2'}
                    ]
                },
                {
                  key2:
                    [
                      {key3: '{{k3}} 3'},
                      {key3: '{{k3}} 4'},
                      {key3: '{{k3}} 5'}
                    ]
                }
              ]
          }
        ];
        this.keys = ['key1.@each.key2.@each.key3'];
        this.combos = [
          {k3: 'v3'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).uniqueCombos().getCombos();
      });

      it('1 combo is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: [{key2: [{key3: 'v3 1'}, {key3: 'v3 2'}]}, {key2: [{key3: 'v3 3'}, {key3: 'v3 4'}, {key3: 'v3 5'}]}]});
      });

    });

    describe('`keys` with braces', function () {

      beforeEach(function () {
        this.templates = [
          {key1: {a: '{{k1}}', b: '{{k2}}'}}
        ];
        this.keys = ['key1.{a,b}'];
        this.combos = [
          {k1: 'v1', k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: {a: 'v1', b: 'v2'}});
      });

    });

    describe('`keys` with braces (2)', function () {

      beforeEach(function () {
        this.templates = [
          {key1: {a: {c: '{{k1}}'}, b: {c: '{{k2}}'}}}
        ];
        this.keys = ['key1.{a,b}.c'];
        this.combos = [
          {k1: 'v1', k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: {a: {c: 'v1'}, b: {c: 'v2'}}});
      });

    });

    describe('`keys` with braces (3)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {c: '{{k1}}'}, b: {c: '{{k2}}'}}
        ];
        this.keys = ['{a,b}.c'];
        this.combos = [
          {k1: 'v1', k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {c: 'v1'}, b: {c: 'v2'}});
      });

    });

    describe('`keys` with braces (4)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {c: '{{k1}}', d: '{{k1}}'}, b: {c: '{{k2}}', d: '{{k2}}'}}
        ];
        this.keys = ['{a,b}.{c,d}'];
        this.combos = [
          {k1: 'v1', k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {c: 'v1', d: 'v1'}, b: {c: 'v2', d: 'v2'}});
      });

    });

    describe('`keys` with braces (5)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {c: {e: '{{k1}}'}, d: {e: '{{k1}}'}}, b: {c: {e: '{{k2}}'}, d: {e: '{{k2}}'}}}
        ];
        this.keys = ['{a,b}.{c.e,d.e}'];
        this.combos = [
          {k1: 'v1', k2: 'v2'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {c: {e: 'v1'}, d: {e: 'v1'}}, b: {c: {e: 'v2'}, d: {e: 'v2'}}});
      });

    });

    describe('`keys` with braces (6)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {b: {d: '{{k1}}', e: '{{k1}}'}, c: {d: '{{k1}}', e: '{{k1}}'}}}
        ];
        this.keys = ['a.{b,c}.{d,e}'];
        this.combos = [
          {k1: 'v1'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {b: {d: 'v1', e: 'v1'}, c: {d: 'v1', e: 'v1'}}});
      });

    });

    describe('`keys` with @each and braces', function () {

      beforeEach(function () {
        this.templates = [
          {a: {b: [{d: '{{k1}}'}], c: [{d: '{{k1}}'}]}}
        ];
        this.keys = ['a.{b,c}.@each.d'];
        this.combos = [
          {k1: 'v1'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {b: [{d: 'v1'}], c: [{d: 'v1'}]}});
      });

    });

    describe('`keys` with @each and braces (2)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {b: [{d: '{{k1}}'}], c: [{d: '{{k1}}'}]}}
        ];
        this.keys = ['a.{b.@each.d,c.@each.d}'];
        this.combos = [
          {k1: 'v1'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {b: [{d: 'v1'}], c: [{d: 'v1'}]}});
      });

    });

    describe('`keys` with @each and braces (3)', function () {

      beforeEach(function () {
        this.templates = [
          {a: {b: [{d: '{{k1}}'}], c: [{d: '{{k1}}'}]}}
        ];
        this.keys = ['a.{b.@each,c.@each}.d'];
        this.combos = [
          {k1: 'v1'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: {b: [{d: 'v1'}], c: [{d: 'v1'}]}});
      });

    });

    describe('`keys` with @each and braces (4)', function () {

      beforeEach(function () {
        this.templates = [
          {a: [{c: '{{k1}}', d: '{{k1}}'}, {c: '{{k1}}', d: '{{k1}}'}]}
        ];
        this.keys = ['a.@each.{c,d}'];
        this.combos = [
          {k1: 'v1'}
        ];
        this.result = this.J.setTemplates(this.templates).createCombos(this.keys, this.combos).getCombos();
      });

      it('1 combos is created', function () {
        expect(this.result).to.have.property('length').equal(1);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({a: [{c: 'v1', d: 'v1'}, {c: 'v1', d: 'v1'}]});
      });

    });

  });

  describe('#concatCombos', function () {

    beforeEach(function () {
      this.J2 = new Jsonium();
      this.templates = [
        {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
        {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
      ];
      this.keys = ['key1', 'key3'];
      this.combos = [
        {k1: 'v1', k3: 'v2'},
        {k1: 'v3', k3: 'v4'}
      ];
      this.J.setTemplates(this.templates);
      this.J2.setTemplates(this.templates).createCombos(this.keys, this.combos);
      var j2Combos = this.J2.getCombos();
      this.result1 = this.J.createCombos(this.keys, this.combos).concatCombos(this.J2).getCombos();
      this.J.clearCombos();
      this.result2 = this.J.createCombos(this.keys, this.combos).concatCombos(j2Combos).getCombos();
    });

    it('combos with Jsonium', function () {
      expect(this.result1).to.have.property('length').equal(8);
    });

    it('combos with list of combos', function () {
      expect(this.result2).to.have.property('length').equal(8);
    });

  });

  describe('#switchKeys', function () {

    beforeEach(function () {
      this.templates = [
        {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
        {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
      ];
      this.keys = ['key1', 'key3'];
      this.combos = [
        {k1: 'v1', k3: 'v2'},
        {k1: 'v3', k3: 'v4'}
      ];
      this.J.setTemplates(this.templates).createCombos(this.keys, this.combos);
    });

    describe('2 arguments', function () {

      beforeEach(function () {
        this.result = this.J.switchKeys('key1', 'key4').getCombos();
      });

      it('4 combos exist', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key4: 'v1 1', key2: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key4: 'v3 1', key2: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key4: 'v1 2', key2: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key4: 'v3 2', key2: '{{k2}} 2', key3: 'v4 2'});
      });

    });

    describe('1 argument', function () {

      beforeEach(function () {
        this.result = this.J.switchKeys({key1: 'key4', key2: 'key5'}).getCombos();
      });

      it('4 combos exist', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key4: 'v1 1', key5: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key4: 'v3 1', key5: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key4: 'v1 2', key5: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key4: 'v3 2', key5: '{{k2}} 2', key3: 'v4 2'});
      });

    });

    describe('not existing key', function () {

      beforeEach(function () {
        this.result = this.J.switchKeys('key10', 'key1').getCombos();
      });

      it('4 combos exist', function () {
        expect(this.result).to.have.property('length').equal(4);
      });

      it('1st combo', function () {
        expect(this.result[0]).to.be.eql({key1: 'v1 1', key2: '{{k2}} 1', key3: 'v2 1'});
      });

      it('2nd combo', function () {
        expect(this.result[1]).to.be.eql({key1: 'v3 1', key2: '{{k2}} 1', key3: 'v4 1'});
      });

      it('3rd combo', function () {
        expect(this.result[2]).to.be.eql({key1: 'v1 2', key2: '{{k2}} 2', key3: 'v2 2'});
      });

      it('4th combo', function () {
        expect(this.result[3]).to.be.eql({key1: 'v3 2', key2: '{{k2}} 2', key3: 'v4 2'});
      });

    });

  });

  describe('#useCombosAsTemplates', function () {

    beforeEach(function () {
      this.templates = [
        {key1: '{{k1}} 1', key2: '{{k2}} 1', key3: '{{k3}} 1'},
        {key1: '{{k1}} 2', key2: '{{k2}} 2', key3: '{{k3}} 2'}
      ];
      this.keys = ['key1', 'key3'];
      this.combos = [
        {k1: '{{v1}}', k3: 'v2'},
        {k1: '{{v1}}', k3: 'v4'}
      ];
      this.combos2 = [
        {v1: 'b1'}
      ];
      this.result = this.J
        .setTemplates(this.templates)
        .createCombos(this.keys, this.combos)
        .useCombosAsTemplates()
        .createCombos('key1', this.combos2)
        .getCombos();
    });

    it('4 combos are created', function () {
      expect(this.result).to.have.property('length').equal(4);
    });

    it('1st combo', function () {
      expect(this.result[0]).to.be.eql({key1: 'b1 1', key2: '{{k2}} 1', key3: 'v2 1'});
    });

    it('2nd combo', function () {
      expect(this.result[1]).to.be.eql({key1: 'b1 1', key2: '{{k2}} 1', key3: 'v4 1'});
    });

    it('3rd combo', function () {
      expect(this.result[2]).to.be.eql({key1: 'b1 2', key2: '{{k2}} 2', key3: 'v2 2'});
    });

    it('4th combo', function () {
      expect(this.result[3]).to.be.eql({key1: 'b1 2', key2: '{{k2}} 2', key3: 'v4 2'});
    });

  });

});