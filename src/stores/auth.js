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
        this.error = 'សូមបញ្ចូលអ៊ីមែល និង ពាក្យសម្ងាត់។'
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
          this.error = 'Authentication failed: សូមពិនិត្យព័ត៌មានរបស់អ្នក។'
          return false
        }
        this.token = token
        localStorage.setItem('token', token)
        await this.fetchMe()
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'អុីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ។'
        return false
      } finally {
        this.loading = false
      }
    },

    // REGISTER
    // Accepts a form object: { name, current_job, email, password, password_confirmation }
    async register(form) {
      if (!form.name || !form.email || !form.password || !form.password_confirmation) {
        this.error = 'សូមបញ្ចូលព័ត៌មានទាំងអស់។'
        return false
      }
      if (form.password !== form.password_confirmation) {
        this.error = 'ពាក្យសម្ងាត់ និង ការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នា។'
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
        this.successMessage = 'ការចុះឈ្មោះបានជោគជ័យ! សូមចូលគណនីរបស់អ្នក។'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'ការចុះឈ្មោះបរាជ័យ។ សូមពិនិត្យព័ត៌មានរបស់អ្នក។'
        return false
      } finally {
        this.loading = false
      }
    },

    // FORGOT PASSWORD (send OTP)
    async forgotPassword(email) {
      if (!email) {
        this.error = 'សូមបញ្ចូលអ៊ីមែល។'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      this.forgotEmail = email
      localStorage.setItem('forgotEmail', email)
      try {
        await api.post('/forgot/pass', { email })
        this.successMessage = 'កូដ OTP ត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។ សូមពិនិត្យអ៊ីមែលរបស់អ្នក។'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'ការបញ្ជូន OTP បរាជ័យ។ សូមពិនិត្យអ៊ីមែលរបស់អ្នក។'
        return false
      } finally {
        this.loading = false
      }
    },

    //  VERIFY OTP
    async verifyCode() {
      if (!this.forgotEmail) {
        this.error = 'ភ្លេចអ៊ីមែល។ សូមចាប់ផ្តើមដំណើរការឡើងវិញ។'
        return false
      }
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.error = 'សូមបញ្ចូលកូដ 6 តួរបស់អ្នក។'
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
        this.successMessage = 'កូដត្រូវបានផ្ទៀងផ្ទាត់!'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'ការផ្ទៀងផ្ទាត់ OTP បរាជ័យ។ សូមពិនិត្យកូដរបស់អ្នក។'
        return false
      } finally {
        this.loading = false
      }
    },

    // RESEND OTP (was missing in new repo)
    async resendCode() {
      if (!this.forgotEmail) {
        this.error = 'ភ្លេចអ៊ីមែល។ សូមចាប់ផ្តើមដំណើរការឡើងវិញ។'
        return false
      }
      this.loading = true
      this.error = ''
      this.successMessage = ''
      try {
        await api.post('/forgot/pass', { email: this.forgotEmail })
        this.successMessage = 'កូដ OTP ត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។ សូមពិនិត្យអ៊ីមែលរបស់អ្នក។'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'ការបញ្ជូន OTP បរាជ័យ។ សូមពិនិត្យអ៊ីមែលរបស់អ្នក។'
        return false
      } finally {
        this.loading = false
      }
    },

    // RESET PASSWORD
    async resetPassword() {
      if (!this.forgotEmail || !this.verificationCode) {
        this.error = 'ភ្លេចអ៊ីមែល ឬ កូដផ្ទៀងផ្ទាត់។ សូមចាប់ផ្តើមដំណើរការឡើងវិញ។'
        return false
      }
      if (!this.newPassword || !this.resetConfirmPassword) {
        this.error = 'សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី និង ការបញ្ជាក់ពាក្យសម្ងាត់។'
        return false
      }
      if (this.newPassword !== this.resetConfirmPassword) {
        this.error = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា។'
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
        this.successMessage = 'ការកំណត់ពាក្យសម្ងាត់ថ្មីបានជោគជ័យ! សូមចូលគណនីរបស់អ្នក។'
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
          'ការកំណត់ពាក្យសម្ងាត់ថ្មីបរាជ័យ។ សូមពិនិត្យព័ត៌មានរបស់អ្នក។'
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

    async restoreSession() {
      const token = localStorage.getItem('token')
      if (token && !this.user) {
        this.token = token
        await this.fetchMe()
      }
    },
    async fetchMe() {
      try {
        const res = await api.get('/me')
        this.user = res.data?.data || res.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch {
        this.user = null
        this.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})
