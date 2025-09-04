<template>
  <div class="test-home">
    <h1>Test Home Page - Vue is Working!</h1>
    <p>This is a test to verify that Vue components are rendering correctly.</p>
    <div class="test-card">
      <h2>Beautiful Design Card</h2>
      <p>If you can see this styled card, the CSS is working too!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestHome',
  mounted() {
    console.log('TestHome component mounted successfully');
  }
};
</script>

<style scoped>
.test-home {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #fdf2f8 0%, #f0f9ff 100%);
  min-height: 100vh;
}

h1 {
  color: #ec4899;
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #64748b;
  font-size: 16px;
  margin-bottom: 30px;
}

.test-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.1);
  text-align: center;
  border: 1px solid #f0e6e6;
}

.test-card h2 {
  color: #2d1b3d;
  margin-bottom: 15px;
}

.test-card p {
  color: #374151;
  margin: 0;
}
</style>
