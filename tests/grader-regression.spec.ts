import { expect } from 'chai';
import { gradeTranslation } from '../src/components/grader';

describe('Grader Regression', () => {
  it('should grade identical translations as perfect', () => {
    expect(gradeTranslation('hello', 'hello')).to.equal(1);
  });
  it('should grade different translations as not perfect', () => {
    expect(gradeTranslation('hello', 'bonjour')).to.not.equal(1);
  });
});
