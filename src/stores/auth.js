import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') 
  }),

  getters: {
    
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
   
    setToken(newToken) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    },

  
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})