import { defineStore } from 'pinia'
import api from '@/api/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      try {
        const data = localStorage.getItem('user')
        return data && data !== 'undefined' ? JSON.parse(data) : null
      } catch (e) {
        return null
      }
    })(),
    token: localStorage.getItem('token') || null,

    emailOrPhone: '',
    password: '',

    forgotEmail: localStorage.getItem('forgotEmail') || '',
    verificationCode: localStorage.getItem('forgotOtp') || '',
    newPassword: '',
    resetConfirmPassword: '',

    loading: false,
    error: '',
    successMessage: '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // LOGIN
    async login() {
      if (!this.emailOrPhone || !this.password) {
        this.error = 'Please enter your email/phone and password.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        const res = await api.post('/login', {
          email: this.emailOrPhone,
          password: this.password,
        })
        const responseData = res.data.data || res.data
        const token = responseData.token || responseData.access_token
        const user = responseData.user

        if (!token) {
          this.error = 'Authentication failed: Token not found.'
          return false
        }
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Invalid email or password.'
        return false
      } finally {
        this.loading = false
      }
    },

    // REGISTER
    // Accepts a form object: { name, current_job, email, password, password_confirmation }
    async register(form) {
      if (!form.name || !form.email || !form.password || !form.password_confirmation) {
        this.error = 'Please fill in all fields.'
        return false
      }
      if (form.password !== form.password_confirmation) {
        this.error = 'Passwords do not match.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        await api.post('/register', {
          name: form.name,
          current_job: form.current_job || '',
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        })
        this.successMessage = 'Account created successfully.'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed.'
        return false
      } finally {
        this.loading = false
      }
    },

    // FORGOT PASSWORD (send OTP)
    async forgotPassword(email) {
      if (!email) {
        this.error = 'Email is required.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      this.forgotEmail = email
      localStorage.setItem('forgotEmail', email)
      try {
        await api.post('/forgot/pass', { email })
        this.successMessage = 'Verification code sent to your email.'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Error sending reset email.'
        return false
      } finally {
        this.loading = false
      }
    },

    //  VERIFY OTP
    async verifyCode() {
      if (!this.forgotEmail) {
        this.error = 'Missing email. Please restart the process.'
        return false
      }
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.error = 'Please enter the full 6-character code.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        await api.post('/forgot/verify-otp', {
          email: this.forgotEmail,
          otp: this.verificationCode.toUpperCase(),
        })
        localStorage.setItem('forgotOtp', this.verificationCode.toUpperCase())
        this.successMessage = 'Code verified!'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Invalid or expired code.'
        return false
      } finally {
        this.loading = false
      }
    },

    // RESEND OTP (was missing in new repo)
    async resendCode() {
      if (!this.forgotEmail) {
        this.error = 'Missing email. Please restart the process.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        await api.post('/forgot/pass', { email: this.forgotEmail })
        this.successMessage = 'New code sent to your email.'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to resend code.'
        return false
      } finally {
        this.loading = false
      }
    },

    // RESET PASSWORD
    async resetPassword() {
      if (!this.forgotEmail || !this.verificationCode) {
        this.error = 'Missing email or verification code. Please restart.'
        return false
      }
      if (!this.newPassword || !this.resetConfirmPassword) {
        this.error = 'Please fill in all password fields.'
        return false
      }
      if (this.newPassword !== this.resetConfirmPassword) {
        this.error = 'Passwords do not match.'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        await api.post('/reset/pass', {
          email: this.forgotEmail,
          otp: this.verificationCode.toUpperCase(),
          new_pass: this.newPassword,
          new_pass_confirmation: this.resetConfirmPassword,
        })
        this.successMessage = 'Password reset successfully!'
        this.emailOrPhone = this.forgotEmail // pre-fill login

        // Cleanup
        this.forgotEmail = ''
        this.verificationCode = ''
        this.newPassword = ''
        this.resetConfirmPassword = ''
        localStorage.removeItem('forgotEmail')
        localStorage.removeItem('forgotOtp')
        return true
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          'Failed to reset password.'
        return false
      } finally {
        this.loading = false
      }
    },

    //LOGOUT
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
