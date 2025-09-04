<template>
  <div style="padding: 100px 20px; background: red; color: white; font-size: 24px;">
    <h1>TEST PAGE WORKS!</h1>
    <p>This is a test page.</p>
    <p>Parameter: {{ $route.params.orderId }}</p>
  </div>
</template>

<script>
export default {
  name: 'TestPage'
};
</script>
