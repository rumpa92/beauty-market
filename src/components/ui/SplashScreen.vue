<template>
  <div class="splash-screen" :class="{ 'fade-out': isExiting }">
    <div class="splash-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="floating-particles">
        <div 
          v-for="n in 20" 
          :key="n" 
          class="particle"
          :style="{ 
            '--delay': Math.random() * 3 + 's',
            '--duration': (Math.random() * 4 + 3) + 's',
            '--x': Math.random() * 100 + '%',
            '--y': Math.random() * 100 + '%'
          }"
        ></div>
      </div>
    </div>
    
    <div class="splash-content">
      <!-- Logo Animation -->
      <div class="logo-container">
        <div class="logo-backdrop"></div>
        <div class="logo-icon" :class="{ 'animate': showLogo }">
          <i class="fas fa-gem"></i>
          <div class="logo-shine"></div>
        </div>
        <div class="logo-text" :class="{ 'animate': showText }">
          <span class="brand-name">Beauty Market</span>
          <div class="brand-tagline">Premium Beauty Destination</div>
        </div>
      </div>

      <!-- Welcome Message -->
      <div class="welcome-message" :class="{ 'animate': showMessage }">
        <h1 class="welcome-title">Welcome to your personalized beauty destination!</h1>
        <p class="welcome-subtitle">Discover premium products curated just for you</p>
      </div>

      <!-- Loading Section -->
      <div class="loading-section" :class="{ 'animate': showLoading }">
        <div class="loading-container">
          <div class="loading-bar">
            <div class="loading-progress" :style="{ width: loadingProgress + '%' }">
              <div class="loading-shimmer"></div>
            </div>
          </div>
          <div class="loading-text">
            <span class="loading-label">{{ loadingText }}</span>
            <span class="loading-percentage">{{ Math.round(loadingProgress) }}%</span>
          </div>
        </div>
        
        <div class="loading-icons">
          <div class="loading-icon" :class="{ active: loadingProgress > 20 }">
            <i class="fas fa-palette"></i>
            <span>Makeup</span>
          </div>
          <div class="loading-icon" :class="{ active: loadingProgress > 40 }">
            <i class="fas fa-leaf"></i>
            <span>Skincare</span>
          </div>
          <div class="loading-icon" :class="{ active: loadingProgress > 60 }">
            <i class="fas fa-cut"></i>
            <span>Hair Care</span>
          </div>
          <div class="loading-icon" :class="{ active: loadingProgress > 80 }">
            <i class="fas fa-spray-can"></i>
            <span>Fragrance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sparkle Effects -->
    <div class="sparkles">
      <div 
        v-for="n in 15" 
        :key="n" 
        class="sparkle"
        :style="{ 
          '--delay': Math.random() * 4 + 's',
          '--x': Math.random() * 100 + '%',
          '--y': Math.random() * 100 + '%'
        }"
      >✨</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
  data() {
    return {
      showLogo: false,
      showText: false,
      showMessage: false,
      showLoading: false,
      isExiting: false,
      loadingProgress: 0,
      loadingTexts: [
        'Preparing your beauty experience...',
        'Loading premium products...',
        'Personalizing recommendations...',
        'Setting up your beauty profile...',
        'Almost ready...',
        'Welcome to Beauty Market!'
      ],
      currentTextIndex: 0
    };
  },
  computed: {
    loadingText() {
      return this.loadingTexts[this.currentTextIndex] || this.loadingTexts[0];
    }
  },
  mounted() {
    this.startSplashSequence();
  },
  methods: {
    async startSplashSequence() {
      // Step 1: Show logo icon (300ms delay)
      await this.delay(300);
      this.showLogo = true;
      
      // Step 2: Show logo text (600ms after icon)
      await this.delay(600);
      this.showText = true;
      
      // Step 3: Show welcome message (800ms after text)
      await this.delay(800);
      this.showMessage = true;
      
      // Step 4: Show loading section (1000ms after message)
      await this.delay(1000);
      this.showLoading = true;
      
      // Step 5: Start loading animation
      await this.delay(500);
      this.animateLoading();
    },
    
    async animateLoading() {
      const totalDuration = 3000; // 3 seconds
      const steps = 100;
      const stepDuration = totalDuration / steps;
      
      for (let i = 0; i <= steps; i++) {
        this.loadingProgress = i;
        
        // Update loading text at different progress points
        if (i === 20) this.currentTextIndex = 1;
        else if (i === 40) this.currentTextIndex = 2;
        else if (i === 60) this.currentTextIndex = 3;
        else if (i === 80) this.currentTextIndex = 4;
        else if (i === 95) this.currentTextIndex = 5;
        
        await this.delay(stepDuration);
      }
      
      // Hold for a moment then exit
      await this.delay(800);
      this.exitSplash();
    },
    
    exitSplash() {
      this.isExiting = true;
      
      // Emit event to parent to hide splash screen
      setTimeout(() => {
        this.$emit('splash-complete');
      }, 800); // Match the fade out duration
    },
    
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
};
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, 
    var(--primary-500) 0%,
    var(--primary-600) 25%,
    var(--purple-600) 50%,
    var(--pink-500) 75%,
    var(--primary-500) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.splash-screen.fade-out {
  opacity: 0;
  transform: scale(1.1);
}

.splash-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 2s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatParticle var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: var(--y);
}

.splash-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 20px;
}

.logo-container {
  position: relative;
  margin-bottom: 60px;
}

.logo-backdrop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-icon.animate {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.logo-icon i {
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  position: relative;
  z-index: 2;
}

.logo-shine {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: shine 2s ease-in-out infinite;
  border-radius: 50%;
}

.logo-text {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
  transition-delay: 0.2s;
}

.logo-text.animate {
  opacity: 1;
  transform: translateY(0);
}

.brand-name {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.brand-tagline {
  font-size: 14px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 300;
}

.welcome-message {
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s ease;
}

.welcome-message.animate {
  opacity: 1;
  transform: translateY(0);
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #f8f8f8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 18px;
  opacity: 0.9;
  font-weight: 300;
  margin: 0;
}

.loading-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.loading-section.animate {
  opacity: 1;
  transform: translateY(0);
}

.loading-container {
  margin-bottom: 40px;
}

.loading-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, #f0f0f0 50%, #fff 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.loading-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  animation: shimmer 1.5s ease-in-out infinite;
}

.loading-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.loading-label {
  opacity: 0.9;
}

.loading-percentage {
  font-weight: 600;
  font-size: 16px;
}

.loading-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
}

.loading-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.3;
  transform: scale(0.9);
  transition: all 0.5s ease;
}

.loading-icon.active {
  opacity: 1;
  transform: scale(1);
}

.loading-icon i {
  font-size: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-icon.active i {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.loading-icon span {
  font-size: 12px;
  opacity: 0.8;
}

.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 12px;
  animation: sparkle 3s ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: var(--y);
  opacity: 0;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes floatParticle {
  0%, 100% { 
    transform: translateY(0px);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-30px);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.2;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.4;
  }
}

@keyframes shine {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes sparkle {
  0%, 100% { 
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% { 
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 24px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
  }
  
  .logo-icon {
    font-size: 48px;
  }
  
  .brand-name {
    font-size: 24px;
  }
  
  .loading-icons {
    gap: 20px;
  }
  
  .loading-icon i {
    font-size: 16px;
    width: 36px;
    height: 36px;
  }
  
  .orb-1 {
    width: 200px;
    height: 200px;
  }
  
  .orb-2 {
    width: 150px;
    height: 150px;
  }
  
  .orb-3 {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .splash-content {
    padding: 0 16px;
  }
  
  .welcome-title {
    font-size: 20px;
    line-height: 1.4;
  }
  
  .welcome-subtitle {
    font-size: 14px;
  }
  
  .loading-icons {
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .brand-tagline {
    font-size: 12px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .splash-screen,
  .logo-icon,
  .logo-text,
  .welcome-message,
  .loading-section,
  .loading-icon {
    transition: none;
  }
  
  .gradient-orb,
  .particle,
  .logo-shine,
  .loading-shimmer,
  .sparkle {
    animation: none;
  }
  
  .logo-backdrop {
    animation: none;
  }
}
</style>
