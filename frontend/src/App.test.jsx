import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from './App'

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('App - Navegación y accesibilidad', () => {
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
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByText('BUSCADOR'))
    expect(screen.getByPlaceholderText(/escribe para filtrar/i)).toBeInTheDocument()
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
  async function irABuscador() {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'BUSCADOR' }))
    return user
  }

  it('el input de búsqueda recibe focus automáticamente', async () => {
    await irABuscador()
    const input = screen.getByPlaceholderText(/escribe para filtrar/i)
    expect(input).toBeInTheDocument()
  })

  it('filtra sugerencias al escribir', async () => {
    const user = await irABuscador()
    const input = screen.getByPlaceholderText(/escribe para filtrar/i)

    await user.type(input, 'React')
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('permite navegar sugerencias con flechas del teclado', async () => {
    const user = await irABuscador()
    const input = screen.getByPlaceholderText(/escribe para filtrar/i)

    await user.type(input, 'a')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(input.value).not.toBe('a')
  })
})

describe('Login - Formulario y accesibilidad', () => {
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
