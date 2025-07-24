import { render, screen } from '@testing-library/react';
import Page from '../page';

// Mock components that might cause issues in tests
jest.mock('@/components/ui/button', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('Home Page', () => {
  it('renders the home page correctly', () => {
    render(<Page />);

    // Verifica se o título principal está presente
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Verifica se há um botão de call-to-action
    const ctaButton = screen.getByRole('button');
    expect(ctaButton).toBeInTheDocument();
  });
});
