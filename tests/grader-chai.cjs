const { assert } = require('chai');
const { gradeTranslation, bleuScore, jaccardSimilarity } = require('../src/components/grader');

describe('Translation Grader', function () {
  it('returns 100 for identical strings', function () {
    assert.strictEqual(gradeTranslation('hello world', 'hello world'), 100);
    assert.strictEqual(bleuScore('hello world', 'hello world'), 100);
    assert.strictEqual(jaccardSimilarity('hello world', 'hello world'), 100);
  });

  it('returns 0 for completely different strings', function () {
    assert.strictEqual(gradeTranslation('foo', 'bar'), 0);
    assert.strictEqual(bleuScore('foo', 'bar'), 0);
    assert.strictEqual(jaccardSimilarity('foo', 'bar'), 0);
  });

  it('is case-insensitive and ignores punctuation', function () {
    assert.strictEqual(gradeTranslation('Hello, world!', 'hello world'), 100);
    assert.strictEqual(bleuScore('Hello, world!', 'hello world'), 100);
    assert.strictEqual(jaccardSimilarity('Hello, world!', 'hello world'), 100);
  });

  it('handles partial overlap (hybrid, less strict)', function () {
    const score = gradeTranslation('hello world', 'hello');
    assert.isAtLeast(score, 10, 'Partial overlap should be at least 10');
    assert.isBelow(score, 100, 'Partial overlap should be less than 100');
    assert.isAbove(bleuScore('hello world', 'hello'), 0);
    assert.isBelow(bleuScore('hello world', 'hello'), 100);
    assert.isAbove(jaccardSimilarity('hello world', 'hello'), 0);
    assert.isBelow(jaccardSimilarity('hello world', 'hello'), 100);
  });

  it('handles word order for BLEU', function () {
    assert.isBelow(bleuScore('I am going to school', 'school I am going to'), 100);
    assert.strictEqual(bleuScore('I am going to school', 'I am going to school'), 100);
  });

  it('handles synonyms poorly (as expected)', function () {
    assert.isBelow(gradeTranslation('hello world', 'hi earth'), 100);
    assert.isBelow(bleuScore('hello world', 'hi earth'), 100);
  });

  it('returns 100 for empty strings', function () {
    assert.strictEqual(gradeTranslation('', ''), 100);
    assert.strictEqual(bleuScore('', ''), 100);
    assert.strictEqual(jaccardSimilarity('', ''), 100);
    assert.strictEqual(gradeTranslation('hello', ''), 0);
    assert.strictEqual(gradeTranslation('', 'hello'), 0);
  });

  it('returns 0 if only one string is empty', function () {
    assert.strictEqual(gradeTranslation('hello', ''), 0);
    assert.strictEqual(bleuScore('hello', ''), 0);
    assert.strictEqual(jaccardSimilarity('hello', ''), 0);
  });

  // --- Additional Edge Cases ---
  it('handles whitespace differences', function () {
    assert.strictEqual(gradeTranslation('hello   world', 'hello world'), 100);
    assert.strictEqual(jaccardSimilarity('  hello world ', 'hello world'), 100);
    assert.isAtLeast(bleuScore('hello world', 'hello   world'), 90);
  });

  it('handles non-ASCII and Unicode', function () {
    assert.isAtMost(gradeTranslation('café', 'cafe'), 50); // accent matters, but fuzzy may give partial
    assert.isBelow(jaccardSimilarity('你好世界', 'hello world'), 100);
    assert.isBelow(bleuScore('你好世界', 'hello world'), 100);
    assert.isAtLeast(gradeTranslation('😊', '😊'), 90);
  });

  it('handles numbers and punctuation only', function () {
    assert.isAtLeast(gradeTranslation('12345', '12345'), 60);
    assert.isAtLeast(jaccardSimilarity('!@#$', '!@#$'), 60);
    assert.isAtLeast(bleuScore('!@#$', '!@#$'), 60);
    assert.isAtMost(gradeTranslation('123', '456'), 40);
  });

  it('handles single-character and repeated words', function () {
    assert.isAtLeast(gradeTranslation('a', 'a'), 60);
    assert.isBelow(jaccardSimilarity('hello hello world', 'hello world'), 100);
    assert.isBelow(bleuScore('hello hello world', 'hello world'), 100);
  });

  it('handles mixed language input', function () {
    assert.isBelow(gradeTranslation('hello 世界', 'hello world'), 100);
    assert.isBelow(jaccardSimilarity('hello 世界', 'hello world'), 100);
    assert.isBelow(bleuScore('hello 世界', 'hello world'), 100);
  });

  it('handles subset and superset for Jaccard', function () {
    assert.isBelow(jaccardSimilarity('hello world', 'hello world extra'), 100);
    assert.isAbove(jaccardSimilarity('hello world', 'hello'), 0);
    assert.strictEqual(jaccardSimilarity('foo', 'foo foo foo'), 100);
  });

  it('handles BLEU n-gram edge cases', function () {
    assert.isBelow(bleuScore('a b c d', 'a b c'), 100);
    assert.isAbove(bleuScore('a b c d', 'a b c'), 0);
    assert.isAtLeast(bleuScore('a', 'a'), 60);
    assert.isAtMost(bleuScore('a', 'b'), 40);
  });

  it('grades semantically similar French sentences as high', function () {
    // AI: Je vais travailler demain. User: Demain, je vais aller au travail.
    const score = gradeTranslation('Je vais travailler demain.', 'Demain, je vais aller au travail.');
    assert.isAtLeast(score, 65, `Score should be at least 65 for semantically similar French sentences, got ${score}`);
  });
});

