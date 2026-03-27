<template>
  <div class="fade-in">
    <div class="section-title-row d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="section-heading">Security Setting</h4>
        <p class="id-badge">Update your password to keep your account secure.</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="input-group-custom">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••" class="form-control-custom">
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group-custom">
          <label>New Password</label>
          <input type="password" placeholder="••••••••" class="form-control-custom">
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group-custom">
          <label>Confirm New Password</label>
          <input type="password" placeholder="••••••••" class="form-control-custom">
        </div>
      </div>
    </div>

    <div class="footer-actions mt-5">
      <button class="btn-save">Update Password</button>
    </div>
  </div>
</template>

<style scoped>
.form-control-custom {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: 0.3s;
}
.form-control-custom:focus {
  border-color: #FF5F00;
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 95, 0, 0.08);
}
</style>