import React from 'react';
import { render, screen } from '@testing-library/react';
import { Popup } from '../src/components/Popup';

jest.mock('../src/services/apiService');
jest.mock('../src/services/storageService');

describe('Popup Component', () => {
  it('should render loading state initially', () => {
    render(<Popup />);
    expect(screen.getByText(/loading recommendations/i)).toBeInTheDocument();
  });

  it('should render authentication form when not logged in', async () => {
    render(<Popup />);
    // This depends on your implementation
  });
});
