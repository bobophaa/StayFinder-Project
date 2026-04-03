<template>
  <div class="auth-page-wrapper text-center">
    <div class="glass-card p-5">
      <h1 class="display-1 fw-bold text-navy">404</h1>
      <h2 class="text-orange mb-4">Page Not Found</h2>
      <p class="text-muted mb-4">
        Oops! The room or page you are looking for doesn't exist.
      </p>
      <RouterLink to="/" class="btn btn-main px-4 py-2">
        Back to Home
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Re-use your auth background and glass styles here */
.auth-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(120deg, #6a7cff, #8fd3f4, #fbc2eb);
  display: flex;
  align-items: center;
  justify-content: center;
}
.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.text-navy { color: #031c36; }
.text-orange { color: #ff5f00; }
.btn-main { background: #5f6fff; color: white; border-radius: 12px; border: none; }
</style>