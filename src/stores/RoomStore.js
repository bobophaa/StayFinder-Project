import { defineStore } from 'pinia'
import api from '@/api/http'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [],
    loading: false,
    error: null,
    paginate: null,
  }),
  actions: {

    async fetchRooms(queryString = '') {
      this.loading = true;
      this.error = null;
      try {
        const url = queryString ? `/rooms?${queryString}` : '/rooms?page=1&per_page=50&sort_col=id&sort_dir=desc';
        const response = await api.get(url);
        this.rooms = response.data.data;
        this.paginate = response.data.paginate || null;
      } catch (err) {
        this.error = "មិនអាចទាញយកបញ្ជីបន្ទប់បានទេ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក។";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchRoomById(id) {
      this.loading = true;
      this.error = null;
      this.room = null;
      try {
        const res = await api.get(`/rooms/${id}`);
        this.room = res.data.data;
      } catch (err) {
        this.error = "មិនអាចទាញយកព័ត៌មានបន្ទប់បានទេ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក។";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addRoom(formData) {
      this.loading = true;
      try {
        const res = await api.post('/rooms', formData);
        if (res.data.result === true) {
          return true;
        }
        console.error("API Error Details:", res.data);
        return false;
      } catch (err) {
        console.error("Submission failed:", err.response?.data);
        this.error = "មិនអាចបញ្ជូនព័ត៌មានបន្ទប់បានទេ។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក។";
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
})