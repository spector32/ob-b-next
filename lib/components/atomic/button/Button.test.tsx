import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders learn react link', () => {
  render(<Button type="button" label="Test button" />);
  const linkElement = screen.getByText(/Test button/i);
  expect(linkElement).toBeInTheDocument();
});
