import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import Grader from '../src/components/Grader';
import { BrowserRouter } from 'react-router-dom';

describe('Grader UI', () => {
  it('renders grader and back button', () => {
    render(<BrowserRouter><Grader /></BrowserRouter>);
    expect(screen.getByText(/Back to Landing/i)).to.exist;
  });
});
