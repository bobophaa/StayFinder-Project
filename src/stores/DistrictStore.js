import { defineStore } from 'pinia'; 
import api from '@/api/http';

export const useDistrictStore = defineStore('district', {
  state: () => ({
    districts: [],
    loading: false
  }),
  actions: {
    async fetchDistricts() {
      this.loading = true;
      try {
        const response = await api.get('/districts');
        if (response.data.result) {
          this.districts = response.data.data;
        }
      } catch (error) {
        console.error("មិនអាចទាញយកព័ត៌មានស្រុកបានទេ:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});