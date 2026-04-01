<template>
  <NavBar />
  <main :class="{ 'content-padding': !isHeroPage }">
    <RouterView />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/layout/NavBar.vue'

const route = useRoute()
const isHeroPage = computed(() => route.path === '/')
</script>

<style>
.content-padding {
  padding-top: 90px;
}
</style>