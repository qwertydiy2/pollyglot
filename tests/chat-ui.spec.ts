import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../src/components/Chat';
import { BrowserRouter } from 'react-router-dom';

describe('Chat UI', () => {
  it('renders chat and back button', () => {
    render(<BrowserRouter><Chat /></BrowserRouter>);
    expect(screen.getByText(/Chat/i)).to.exist;
    fireEvent.click(screen.getByText(/Back to Landing/i));
  });
});
