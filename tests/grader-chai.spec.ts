
import { expect } from 'chai';
import { gradeTranslation, bleuScore, jaccardSimilarity } from '../src/components/grader';

describe('Translation Grader', () => {
  it('returns 100 for identical strings', () => {
    expect(gradeTranslation('hello world', 'hello world')).to.equal(100);
    expect(bleuScore('hello world', 'hello world')).to.equal(100);
    expect(jaccardSimilarity('hello world', 'hello world')).to.equal(100);
  });

  it('returns 0 for completely different strings', () => {
    expect(gradeTranslation('foo', 'bar')).to.equal(0);
    expect(bleuScore('foo', 'bar')).to.equal(0);
    expect(jaccardSimilarity('foo', 'bar')).to.equal(0);
  });

  it('is case-insensitive and ignores punctuation', () => {
    expect(gradeTranslation('Hello, world!', 'hello world')).to.equal(100);
    expect(bleuScore('Hello, world!', 'hello world')).to.equal(100);
    expect(jaccardSimilarity('Hello, world!', 'hello world')).to.equal(100);
  });

  it('handles partial overlap', () => {
    expect(gradeTranslation('hello world', 'hello')).to.be.greaterThan(0).and.lessThan(100);
    expect(bleuScore('hello world', 'hello')).to.be.greaterThan(0).and.lessThan(100);
    expect(jaccardSimilarity('hello world', 'hello')).to.be.greaterThan(0).and.lessThan(100);
  });

  it('handles word order for BLEU', () => {
    expect(bleuScore('I am going to school', 'school I am going to')).to.be.lessThan(100);
    expect(bleuScore('I am going to school', 'I am going to school')).to.equal(100);
  });

  it('handles synonyms poorly (as expected)', () => {
    expect(gradeTranslation('hello world', 'hi earth')).to.be.lessThan(100);
    expect(bleuScore('hello world', 'hi earth')).to.be.lessThan(100);
  });

  it('returns 100 for empty strings', () => {
    expect(gradeTranslation('', '')).to.equal(100);
    expect(bleuScore('', '')).to.equal(100);
    expect(jaccardSimilarity('', '')).to.equal(100);
  });

  it('returns 0 if only one string is empty', () => {
    expect(gradeTranslation('hello', '')).to.equal(0);
    expect(bleuScore('hello', '')).to.equal(0);
    expect(jaccardSimilarity('hello', '')).to.equal(0);
  });
});
