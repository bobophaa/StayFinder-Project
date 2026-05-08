<template>
  <div :lang="lang">
    <Navbar v-if="!$route.meta.hideNavbar" />
    
    <main :class="{ 'content-padding': !isHeroPage }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted,ref,watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/NavBar.vue'

const route     = useRoute()
const authStore = useAuthStore()

const isHeroPage = computed(() => route.path === '/')

const lang = ref('en')

watch(lang, (newLang) => {
  document.documentElement.lang = newLang
})


onMounted(async () => {
  await authStore.restoreSession()
})
</script>

<style>
.center-screen-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
</style> 