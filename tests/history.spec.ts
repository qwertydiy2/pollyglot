import { expect } from 'chai';

describe('History localStorage', () => {
  it('should save and load history from localStorage', () => {
    const testHistory = [{ page: 'grader', data: { foo: 'bar' } }];
    localStorage.setItem('pollyglot_history', JSON.stringify(testHistory));
    const loaded = JSON.parse(localStorage.getItem('pollyglot_history')!);
    expect(loaded).to.deep.equal(testHistory);
  });
});
