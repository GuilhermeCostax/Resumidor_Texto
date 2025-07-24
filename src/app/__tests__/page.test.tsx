import { render, screen } from '@testing-library/react';
import Page from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock dos componentes que podem causar problemas nos testes
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    // Verifica se elementos chave da página estão presentes
    expect(screen.getByText(/Transforme textos longos/i)).toBeInTheDocument();
  });

  it('has a call-to-action button', () => {
    render(<Page />);
    const ctaButton = screen.getByRole('button', { name: /Começar agora/i });
    expect(ctaButton).toBeInTheDocument();
  });
});