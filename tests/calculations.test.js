import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateSGPA, calculateCGPA, division, withCredits } from '../src/calculations.js';
const configs = JSON.parse(readFileSync(new URL('../subjects.json', import.meta.url)));
test('all semester formulas preserve supported grades and reject unverified REM results', () => {
  for (const config of Object.values(configs)) {
    assert.throws(() => calculateSGPA(config, config.subjects.map(() => 'REM')), /no verified grade-point mapping/);
    for (const [grade, rank] of [['EX', 0], ['A', 1], ['E', 5]]) {
      const grades = config.subjects.map(() => grade);
      const expected = (config.maxPoints - config.subjects.reduce((sum, s) => sum + s.credits * rank, 0)) / config.divisor;
      assert.equal(calculateSGPA(config, grades), expected);
    }
  }
});
test('mixed grades retain weighted subject credits', () => {
  const config = configs.cse_e1s1;
  assert.equal(calculateSGPA(config, ['A', 'B', 'EX', 'EX', 'EX', 'EX', 'EX']), 9.4);
});
test('CGPA averages only entered semesters and rejects invalid values', () => {
  assert.equal(calculateCGPA(['8', '', '9']), 8.5);
  for (const values of [[], [''], ['11'], ['-1'], ['hello']]) assert.throws(() => calculateCGPA(values));
});
test('division boundaries stay consistent', () => {
  assert.equal(division(8), 'Distinction'); assert.equal(division(7), 'First class'); assert.equal(division(6), 'Second class');
});

test('credit edits recalculate weighting and exports without changing source data', () => {
  const config = configs.cse_e1s1;
  const values = config.subjects.map(subject => String(subject.credits));
  const updated = withCredits(config, values.map((value, index) => index === 0 ? '2.5' : value));
  assert.equal(updated.divisor, 18.5);
  assert.equal(updated.maxPoints, 185);
  assert.equal(updated.subjects[0].credits, 2.5);
  assert.equal(config.subjects[0].credits, 4);
  assert.equal(calculateSGPA(updated, ['A', 'EX', 'EX', 'EX', 'EX', 'EX', 'EX']), 182.5 / 18.5);
});

test('unchanged credits preserve every existing semester formula', () => {
  for (const config of Object.values(configs)) {
    assert.equal(withCredits(config, config.subjects.map(subject => String(subject.credits))), config);
  }
});

test('credit validation permits zero-credit subjects and rejects invalid totals', () => {
  const config = configs.cse_e1s1;
  const values = config.subjects.map(subject => subject.credits);
  assert.equal(withCredits(config, values.map((value, index) => index === 0 ? 0 : value)).subjects[0].credits, 0);
  for (const value of ['', '-1', 'hello', 'Infinity']) {
    assert.throws(() => withCredits(config, values.map((v, index) => index === 0 ? value : v)));
  }
  assert.throws(() => withCredits(config, values.map(() => 0)));
  assert.throws(() => withCredits(config, []));
});
