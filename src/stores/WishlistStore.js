import { defineStore } from 'pinia'
import { alertSuccess, alertError, showToast } from '@/Utils/alert'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  }),

  actions: {

   addToWishlist(room) {
  const exists = this.items.find(item => item.id === room.id);

  if (!exists) {
    this.items.push(room);
    this.saveToStorage();

    showToast('success', 'Added to wishlist!')
  } else {
    showToast('info', 'Already in wishlist')
  }
}
,
    removeFromWishlist(id) {
      this.items = this.items.filter((item) => item.id !== id)
      this.saveToStorage()
    },

    toggleWishlist(room) {
      const exists = this.items.find((item) => item.id === room.id)

      if (exists) {
        this.removeFromWishlist(room.id)
      } else {
        this.addToWishlist(room)
      }
    },

    saveToStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    },

    clearWishlist() {
      this.items = []
      localStorage.removeItem('wishlist')
    },

    isWishlisted(roomId) {
      return this.items.some((item) => item.id === roomId)
    },
  },
})
