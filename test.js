var Jsonium = require('./index.js');
var chai = require('chai');
chai.use(require('chai-string'));
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
          {k1: 'v1', k3: 'v2'},
          {k1: 'v3', k3: 'v4'}
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
      this.J2.setTemplates(this.templates).createCombos(this.keys, this.combos);
      this.J.setTemplates(this.templates);
      this.result1 = this.J.createCombos(this.keys, this.combos).concatCombos(this.J2).getCombos();
      this.result2 = this.J.createCombos(this.keys, this.combos).concatCombos(this.J2.getCombos()).getCombos();
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

});