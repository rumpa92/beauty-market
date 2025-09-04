<template>
  <div class="how-to-use-section">
    <div class="section-header">
      <h3 class="section-title">How to Use</h3>
      <p class="section-subtitle">Follow these simple steps for best results</p>
    </div>

    <!-- Usage Steps Accordion -->
    <div class="usage-accordion">
      <div 
        v-for="(step, index) in usageSteps" 
        :key="index"
        class="accordion-item"
        :class="{ active: activeStep === index }"
      >
        <button 
          class="accordion-header"
          @click="toggleStep(index)"
          :aria-expanded="activeStep === index"
        >
          <div class="step-info">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-title">{{ step.title }}</div>
          </div>
          <div class="step-icon">
            <i :class="step.icon"></i>
          </div>
          <div class="expand-icon">
            <i class="fas fa-chevron-down" :class="{ rotated: activeStep === index }"></i>
          </div>
        </button>
        
        <transition name="accordion">
          <div v-if="activeStep === index" class="accordion-content">
            <div class="step-details">
              <p class="step-description">{{ step.description }}</p>
              
              <!-- Step Tips -->
              <div v-if="step.tips && step.tips.length" class="step-tips">
                <h5>💡 Pro Tips:</h5>
                <ul>
                  <li v-for="(tip, tipIndex) in step.tips" :key="tipIndex">
                    {{ tip }}
                  </li>
                </ul>
              </div>
              
              <!-- Step Image -->
              <div v-if="step.image" class="step-image">
                <img :src="step.image" :alt="step.title" />
              </div>
              
              <!-- Step Duration -->
              <div v-if="step.duration" class="step-duration">
                <i class="fas fa-clock"></i>
                <span>{{ step.duration }}</span>
              </div>
              
              <!-- Step Warning -->
              <div v-if="step.warning" class="step-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ step.warning }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Quick Reference Guide -->
    <div class="quick-reference">
      <h4 class="quick-ref-title">Quick Reference</h4>
      <div class="quick-ref-grid">
        <div class="quick-ref-item">
          <div class="ref-icon frequency">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="ref-content">
            <div class="ref-label">Frequency</div>
            <div class="ref-value">{{ quickRef.frequency }}</div>
          </div>
        </div>
        
        <div class="quick-ref-item">
          <div class="ref-icon timing">
            <i class="fas fa-sun"></i>
          </div>
          <div class="ref-content">
            <div class="ref-label">Best Time</div>
            <div class="ref-value">{{ quickRef.timing }}</div>
          </div>
        </div>
        
        <div class="quick-ref-item">
          <div class="ref-icon duration">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <div class="ref-content">
            <div class="ref-label">Duration</div>
            <div class="ref-value">{{ quickRef.duration }}</div>
          </div>
        </div>
        
        <div class="quick-ref-item">
          <div class="ref-icon results">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="ref-content">
            <div class="ref-label">See Results</div>
            <div class="ref-value">{{ quickRef.results }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Routine Suggestions -->
    <div v-if="routineSuggestions" class="routine-suggestions">
      <h4 class="routine-title">Suggested Routine Order</h4>
      <div class="routine-flow">
        <div 
          v-for="(routine, index) in routineSuggestions" 
          :key="index"
          class="routine-step"
        >
          <div class="routine-number">{{ index + 1 }}</div>
          <div class="routine-content">
            <div class="routine-product">{{ routine.product }}</div>
            <div class="routine-note">{{ routine.note }}</div>
          </div>
          <div v-if="index < routineSuggestions.length - 1" class="routine-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Do's and Don'ts -->
    <div class="dos-donts">
      <div class="dos-donts-grid">
        <div class="dos-section">
          <h5 class="dos-donts-title do">
            <i class="fas fa-check-circle"></i>
            Do's
          </h5>
          <ul class="dos-list">
            <li v-for="(item, index) in dosDonts.dos" :key="'do-' + index">
              <i class="fas fa-check"></i>
              {{ item }}
            </li>
          </ul>
        </div>
        
        <div class="donts-section">
          <h5 class="dos-donts-title dont">
            <i class="fas fa-times-circle"></i>
            Don'ts
          </h5>
          <ul class="donts-list">
            <li v-for="(item, index) in dosDonts.donts" :key="'dont-' + index">
              <i class="fas fa-times"></i>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div v-if="faqs && faqs.length" class="faq-section">
      <h4 class="faq-title">Frequently Asked Questions</h4>
      <div class="faq-list">
        <div 
          v-for="(faq, index) in faqs" 
          :key="'faq-' + index"
          class="faq-item"
          :class="{ active: activeFaq === index }"
        >
          <button 
            class="faq-question"
            @click="toggleFaq(index)"
          >
            <span>{{ faq.question }}</span>
            <i class="fas fa-plus" :class="{ rotated: activeFaq === index }"></i>
          </button>
          
          <transition name="faq">
            <div v-if="activeFaq === index" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Video Tutorial -->
    <div v-if="videoTutorial" class="video-tutorial">
      <h4 class="video-title">Video Tutorial</h4>
      <div class="video-container">
        <div class="video-placeholder" @click="playVideo" v-if="!videoPlaying">
          <img :src="videoTutorial.thumbnail" :alt="videoTutorial.title" />
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
          <div class="video-info">
            <div class="video-duration">{{ videoTutorial.duration }}</div>
          </div>
        </div>
        
        <iframe
          v-if="videoPlaying"
          :src="videoTutorial.url"
          frameborder="0"
          allowfullscreen
          class="video-iframe"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowToUseSection',
  props: {
    usageSteps: {
      type: Array,
      required: true,
      default: () => []
    },
    quickRef: {
      type: Object,
      default: () => ({
        frequency: 'Daily',
        timing: 'Morning & Evening',
        duration: '2-3 minutes',
        results: 'In 2-4 weeks'
      })
    },
    routineSuggestions: {
      type: Array,
      default: () => []
    },
    dosDonts: {
      type: Object,
      default: () => ({
        dos: [],
        donts: []
      })
    },
    faqs: {
      type: Array,
      default: () => []
    },
    videoTutorial: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeStep: 0,
      activeFaq: null,
      videoPlaying: false
    };
  },
  methods: {
    toggleStep(index) {
      this.activeStep = this.activeStep === index ? null : index;
    },
    
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    },
    
    playVideo() {
      this.videoPlaying = true;
    },
    
    nextStep() {
      if (this.activeStep < this.usageSteps.length - 1) {
        this.activeStep++;
      }
    },
    
    previousStep() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    }
  },
  
  mounted() {
    // Auto-expand first step
    this.activeStep = 0;
  }
};
</script>

<style scoped>
.how-to-use-section {
  padding: 40px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--market-text-light);
  margin: 0;
}

/* Usage Accordion */
.usage-accordion {
  margin-bottom: 40px;
}

.accordion-item {
  border: 2px solid var(--market-border);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-item.active {
  border-color: var(--market-primary);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
}

.accordion-header {
  width: 100%;
  padding: 20px 24px;
  background: var(--market-surface);
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.accordion-header:hover {
  background: var(--market-secondary);
}

.accordion-item.active .accordion-header {
  background: var(--market-secondary);
}

.step-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--market-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
}

.step-icon {
  color: var(--market-primary);
  font-size: 20px;
  margin-right: 16px;
}

.expand-icon {
  color: var(--market-text-light);
  transition: transform 0.3s ease;
}

.expand-icon .rotated {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 0 24px 24px;
  background: var(--market-surface);
}

.step-details {
  padding-top: 16px;
}

.step-description {
  font-size: 16px;
  line-height: 1.6;
  color: var(--market-text);
  margin-bottom: 16px;
}

.step-tips {
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.step-tips h5 {
  margin: 0 0 8px 0;
  color: #0c4a6e;
  font-size: 14px;
  font-weight: 600;
}

.step-tips ul {
  margin: 0;
  padding-left: 16px;
}

.step-tips li {
  color: #0c4a6e;
  margin-bottom: 4px;
  font-size: 14px;
}

.step-image {
  margin: 16px 0;
  text-align: center;
}

.step-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.step-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--market-text-light);
  font-size: 14px;
}

.step-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef3c7;
  color: #92400e;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #f59e0b;
}

/* Quick Reference */
.quick-reference {
  background: var(--market-secondary);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
}

.quick-ref-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 24px;
  text-align: center;
}

.quick-ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.quick-ref-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.quick-ref-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.ref-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.ref-icon.frequency { background: #3b82f6; }
.ref-icon.timing { background: #f59e0b; }
.ref-icon.duration { background: #8b5cf6; }
.ref-icon.results { background: #10b981; }

.ref-content {
  flex: 1;
}

.ref-label {
  font-size: 12px;
  color: var(--market-text-light);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.ref-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
}

/* Routine Suggestions */
.routine-suggestions {
  margin-bottom: 40px;
}

.routine-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 24px;
  text-align: center;
}

.routine-flow {
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 20px;
  gap: 16px;
}

.routine-step {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 200px;
  flex-shrink: 0;
}

.routine-number {
  width: 32px;
  height: 32px;
  background: var(--market-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.routine-content {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--market-border);
  min-width: 150px;
}

.routine-product {
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
  font-size: 14px;
}

.routine-note {
  font-size: 12px;
  color: var(--market-text-light);
}

.routine-arrow {
  color: var(--market-primary);
  font-size: 18px;
}

/* Do's and Don'ts */
.dos-donts {
  margin-bottom: 40px;
}

.dos-donts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.dos-donts-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.dos-donts-title.do {
  color: #059669;
}

.dos-donts-title.dont {
  color: #dc2626;
}

.dos-list,
.donts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dos-list li,
.donts-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.dos-list i {
  color: #059669;
  margin-top: 2px;
}

.donts-list i {
  color: #dc2626;
  margin-top: 2px;
}

/* FAQ Section */
.faq-section {
  margin-bottom: 40px;
}

.faq-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 24px;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid var(--market-border);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item.active {
  border-color: var(--market-primary);
}

.faq-question {
  width: 100%;
  padding: 16px 20px;
  background: var(--market-surface);
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-weight: 600;
  color: var(--market-text);
}

.faq-question:hover {
  background: var(--market-secondary);
}

.faq-question i {
  transition: transform 0.3s ease;
  color: var(--market-primary);
}

.faq-question i.rotated {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 16px 20px;
  background: var(--market-secondary);
  border-top: 1px solid var(--market-border);
}

.faq-answer p {
  margin: 0;
  color: var(--market-text);
  line-height: 1.6;
}

/* Video Tutorial */
.video-tutorial {
  text-align: center;
}

.video-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 24px;
}

.video-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.video-placeholder {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-placeholder:hover {
  transform: scale(1.02);
}

.video-placeholder img {
  width: 100%;
  height: auto;
  display: block;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(236, 72, 153, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: var(--market-primary);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-info {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.video-duration {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.video-iframe {
  width: 100%;
  height: 300px;
}

/* Transitions */
.accordion-enter-active,
.accordion-leave-active,
.faq-enter-active,
.faq-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to,
.faq-enter,
.faq-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-to,
.accordion-leave,
.faq-enter-to,
.faq-leave {
  max-height: 1000px;
  opacity: 1;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .quick-ref-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .quick-ref-item {
    padding: 16px;
  }
  
  .ref-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .dos-donts-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .routine-flow {
    flex-direction: column;
    align-items: stretch;
  }
  
  .routine-step {
    min-width: unset;
  }
  
  .routine-arrow {
    transform: rotate(90deg);
  }
  
  .accordion-header {
    padding: 16px 20px;
  }
  
  .step-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }
  
  .quick-ref-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-reference {
    padding: 20px;
  }
  
  .accordion-content {
    padding: 0 16px 16px;
  }
  
  .step-info {
    gap: 12px;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>
