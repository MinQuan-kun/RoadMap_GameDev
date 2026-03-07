import { createContext } from 'react'

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {}
})

export default AuthContext