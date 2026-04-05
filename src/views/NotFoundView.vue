<template>
  <div class="notfound-wrapper">

    <div class="notfound-card text-center">
      
      
      <div class="icon-box mb-4">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>

     
      <h1 class="error-code">404</h1>
      <h2 class="title mb-3">Page Not Found</h2>


      <p class="desc mb-4">
        Sorry, the page or room you are looking for doesn’t exist or has been moved.
      </p>

  
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink to="/" class="btn-main">
          <i class="bi bi-house-door-fill me-2"></i>Home
        </RouterLink>

        <RouterLink to="/rooms" class="btn-outline">
          <i class="bi bi-search me-2"></i>Explore Rooms
        </RouterLink>
      </div>

    </div>

  </div>
</template>

<style scoped>
.notfound-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #031c36, #0d3a6e, #1a5fa8);
  padding: 20px;
}


.notfound-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  border-radius: 25px;
  padding: 50px 40px;
  max-width: 450px;
  width: 100%;
  color: white;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.icon-box {
  font-size: 50px;
  color: #ff5f00;
}


.error-code {
  font-size: 80px;
  font-weight: 900;
  color: #ff5f00;
  margin-bottom: 10px;
}

.title {
  font-weight: 700;
}

.desc {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.8);
}

/* Buttons */
.btn-main {
  background: #ff5f00;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
}
.btn-main:hover {
  background: #e65600;
}

.btn-outline {
  border: 1.5px solid #fff;
  color: #fff;
  padding: 10px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: 0.2s;
}
.btn-outline:hover {
  background: #fff;
  color: #031c36;
}
</style>
