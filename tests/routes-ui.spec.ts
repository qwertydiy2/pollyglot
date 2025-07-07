import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import AppRoutes from '../src/routes';
import { BrowserRouter } from 'react-router-dom';

describe('Routing UI', () => {
  it('shows landing page and navigates to Grader', () => {
    render(<BrowserRouter><AppRoutes /></BrowserRouter>);
    expect(screen.getByText(/PollyGlot/i)).to.exist;
    fireEvent.click(screen.getByText(/Grader/i));
    expect(screen.getByText(/Back to Landing/i)).to.exist;
  });
});
