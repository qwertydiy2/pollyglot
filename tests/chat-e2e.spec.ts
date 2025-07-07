import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../src/components/Chat';
import { BrowserRouter } from 'react-router-dom';

describe('Chat E2E', () => {
  it('should allow user to see chat and back button', () => {
    render(<BrowserRouter><Chat /></BrowserRouter>);
    expect(screen.getByText(/Back to Landing/i)).to.exist;
  });
});
