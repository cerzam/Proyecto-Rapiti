import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App'

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('Sesión - Multipestaña, logout y reconexión', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('muestra LOGOUT en el navbar cuando hay token en localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('LOGOUT')).toBeInTheDocument();
    expect(screen.queryByText('LOGIN')).not.toBeInTheDocument();
  });

  it('muestra LOGIN en el navbar cuando no hay token', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.queryByText('LOGOUT')).not.toBeInTheDocument();
  });

  it('al hacer logout desaparece el botón LOGOUT y aparece LOGIN', async () => {
    localStorage.setItem('token', 'fake-token');
    const user = userEvent.setup();
    render(<BrowserRouter><App /></BrowserRouter>);

    await user.click(screen.getByText('LOGOUT'));

    expect(screen.queryByText('LOGOUT')).not.toBeInTheDocument();
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('muestra el modal de sesión terminada cuando otra pestaña cierra sesión', async () => {
    localStorage.setItem('token', 'fake-token');
    render(<BrowserRouter><App /></BrowserRouter>);

    await act(async () => {
      window.dispatchEvent(Object.assign(new Event('storage'), {
        key: 'token',
        newValue: null,
      }));
    });

    expect(screen.getByText('SESIÓN TERMINADA')).toBeInTheDocument();
  });

  it('el modal de sesión terminada se cierra al hacer click en ENTENDIDO', async () => {
    localStorage.setItem('token', 'fake-token');
    const user = userEvent.setup();
    render(<BrowserRouter><App /></BrowserRouter>);

    await act(async () => {
      window.dispatchEvent(Object.assign(new Event('storage'), {
        key: 'token',
        newValue: null,
      }));
    });

    await user.click(screen.getByText('ENTENDIDO'));
    expect(screen.queryByText('SESIÓN TERMINADA')).not.toBeInTheDocument();
  });

  it('al reconectar online con sesión inválida limpia el token y muestra el modal', async () => {
    localStorage.setItem('token', 'expired-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    render(<BrowserRouter><App /></BrowserRouter>);

    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(screen.getByText('SESIÓN TERMINADA')).toBeInTheDocument();
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('al reconectar online con sesión válida no muestra el modal', async () => {
    localStorage.setItem('token', 'valid-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    render(<BrowserRouter><App /></BrowserRouter>);

    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.queryByText('SESIÓN TERMINADA')).not.toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('valid-token');
  });

  it('al reconectar online sin token no llama a fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<BrowserRouter><App /></BrowserRouter>);

    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('App - Navegación y accesibilidad', () => {
  beforeEach(() => { localStorage.clear() })

  it('renderiza el navbar con los enlaces de navegación', () => {
    renderApp()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.getByText('BUSCADOR')).toBeInTheDocument()
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
  })

  it('los enlaces del navbar son navegables con TAB', async () => {
    const user = userEvent.setup()
    renderApp()

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(3)

    await user.tab()
    expect(links[0]).toHaveFocus()

    await user.tab()
    expect(links[1]).toHaveFocus()

    await user.tab()
    expect(links[2]).toHaveFocus()
  })

  it('navega a Buscador al hacer click en el enlace', async () => {
    localStorage.setItem('token', 'fake-token')
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByText('BUSCADOR'))
    expect(
      screen.getByLabelText(/buscador de productos/i)
    ).toBeInTheDocument()
  })

  it('navega a Login al hacer click en el enlace', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByText('LOGIN'))
    expect(screen.getByText(/INICIAR/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument()
  })
})

describe('Buscador - Teclado y accesibilidad', () => {
  beforeEach(() => { localStorage.clear() })

  async function irABuscador() {
    localStorage.setItem('token', 'fake-token')
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'BUSCADOR' }))
    return user
  }

  it('el input de búsqueda recibe focus automáticamente', async () => {
    await irABuscador()
    const input = screen.getByLabelText(/buscador de productos/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()
  })

  it('permite navegar con teclado', async () => {
    const user = await irABuscador()
    const input = screen.getByLabelText(/buscador de productos/i)

    await user.type(input, 'a')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(input.value).not.toBe('')
  })
})

describe('Login - Formulario y accesibilidad', () => {
  beforeEach(() => { localStorage.clear() })

  async function irALogin() {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByText('LOGIN'))
    return user
  }

  it('los inputs tienen labels asociados', async () => {
    await irALogin()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Contraseña')).toBeInTheDocument()
  })

  it('el botón de submit es accesible', async () => {
    await irALogin()
    const button = screen.getByRole('button', { name: /entrar/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('los campos del formulario son navegables con TAB', async () => {
    const user = await irALogin()

    const emailInput = screen.getByPlaceholderText('tu@correo.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    emailInput.focus()
    expect(emailInput).toHaveFocus()

    await user.tab()
    expect(passwordInput).toHaveFocus()

    await user.tab()
    expect(submitButton).toHaveFocus()
  })
})