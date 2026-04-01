<template>

 <Navbar v-if="!$route.meta.hideNavbar" />
  <main :class="{ 'content-padding': !isHeroPage }">
    <RouterView />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/NavBar.vue'

const route = useRoute()
const isHeroPage = computed(() => route.path === '/')
</script>

<style>
/* .content-padding {
  padding-top: 90px; 
} */.center-screen-layout {
  display: flex;
  justify-content: center;
  align-items: center;
 height: 100vh;
  width: 100%;
}
</style>
