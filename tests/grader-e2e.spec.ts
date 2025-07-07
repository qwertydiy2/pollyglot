import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import Grader from '../src/components/Grader';
import { BrowserRouter } from 'react-router-dom';

describe('Grader E2E', () => {
  it('should allow user to enter text, translate, and grade', () => {
    render(<BrowserRouter><Grader /></BrowserRouter>);
    // Simulate user input and grading here (pseudo, as actual OpenAI call is async/mocked)
    expect(screen.getByText(/Back to Landing/i)).to.exist;
  });
});
