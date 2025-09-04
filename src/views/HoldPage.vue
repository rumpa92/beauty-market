<template>
  <div class="hold-page">
    <div class="hold-container">
      <div class="hold-card">
        <h1>Coming Soon</h1>
        <p>The authentication experience is being updated. We'll be back shortly.</p>
        <router-link to="/" class="hold-cta">Return to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HoldPage'
};
</script>

<style scoped>
.hold-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 16px;
  background: linear-gradient(180deg, #fff 0%, #fff6fb 100%);
}
.hold-container {
  max-width: 720px;
  width: 100%;
}
.hold-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 48px 36px;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.06);
  text-align: center;
}
.hold-card h1 {
  margin: 0 0 12px 0;
  color: #d63384;
  font-size: 28px;
}
.hold-card p {
  color: #555; 
  margin-bottom: 20px;
}
.hold-cta {
  display: inline-block;
  background: linear-gradient(90deg,#ff5fa2,#ff3b7a);
  color: #fff;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
</style>
