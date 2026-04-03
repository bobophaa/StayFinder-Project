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

</style>