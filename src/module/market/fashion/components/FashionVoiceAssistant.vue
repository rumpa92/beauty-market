<template>
  <div class="fashion-voice-assistant">
    <div v-if="isListening" class="voice-indicator">
      <i class="fas fa-microphone"></i>
      <span>Listening for fashion commands...</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FashionVoiceAssistant',
  computed: {
    ...mapGetters('ui', ['isVoiceListening']),
    isListening() {
      return this.isVoiceListening || false;
    }
  }
};
</script>

<style scoped>
.voice-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--market-accent);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}
</style>
