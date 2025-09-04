<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-user-edit"></i>
          Edit Profile
        </h2>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <p class="modal-description">
          Update your personal details including name, profile picture, contact information, and preferences to keep your account up to date.
        </p>

        <form @submit.prevent="saveProfile" class="profile-form">
          <!-- Profile Picture Section -->
          <div class="form-section">
            <h3 class="section-title">Profile Picture</h3>
            <div class="profile-picture-section">
              <div class="current-avatar">
                <img v-if="formData.avatar" :src="formData.avatar" alt="Profile Picture">
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
                <div class="avatar-overlay" @click="triggerFileUpload">
                  <i class="fas fa-camera"></i>
                  <span>Change</span>
                </div>
              </div>
              <input 
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                style="display: none"
              >
              <div class="avatar-actions">
                <button type="button" @click="triggerFileUpload" class="btn btn-outline btn-sm">
                  <i class="fas fa-upload"></i>
                  Upload New
                </button>
                <button v-if="formData.avatar" type="button" @click="removeAvatar" class="btn btn-outline btn-sm">
                  <i class="fas fa-trash"></i>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input 
                  type="text" 
                  v-model="formData.name"
                  class="form-input"
                  placeholder="Enter your full name"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input 
                  type="email" 
                  v-model="formData.email"
                  class="form-input"
                  placeholder="Enter your email"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  v-model="formData.phone"
                  class="form-input"
                  placeholder="Enter your phone number"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  v-model="formData.dateOfBirth"
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- Beauty Preferences -->
          <div class="form-section">
            <h3 class="section-title">Beauty Preferences</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Skin Type</label>
                <select v-model="formData.skinType" class="form-select">
                  <option value="">Select skin type</option>
                  <option value="oily">Oily</option>
                  <option value="dry">Dry</option>
                  <option value="combination">Combination</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Hair Type</label>
                <select v-model="formData.hairType" class="form-select">
                  <option value="">Select hair type</option>
                  <option value="straight">Straight</option>
                  <option value="wavy">Wavy</option>
                  <option value="curly">Curly</option>
                  <option value="coily">Coily</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Skin Concerns</label>
                <div class="checkbox-group">
                  <label v-for="concern in skinConcerns" :key="concern" class="checkbox-item">
                    <input 
                      type="checkbox" 
                      :value="concern"
                      v-model="formData.skinConcerns"
                    >
                    <span class="checkmark"></span>
                    {{ concern }}
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Favorite Brands</label>
                <div class="tags-input">
                  <span v-for="brand in formData.favoriteBrands" :key="brand" class="tag">
                    {{ brand }}
                    <button type="button" @click="removeBrand(brand)" class="tag-remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                  <input 
                    type="text"
                    v-model="newBrand"
                    @keypress.enter.prevent="addBrand"
                    placeholder="Type brand name and press Enter"
                    class="tag-input"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="form-section">
            <h3 class="section-title">Privacy & Communication</h3>
            <div class="privacy-controls">
              <div class="control-item">
                <div class="control-info">
                  <h4>Email Notifications</h4>
                  <p>Receive updates about orders, new products, and offers</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="formData.emailNotifications">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="control-item">
                <div class="control-info">
                  <h4>SMS Notifications</h4>
                  <p>Get important updates via text message</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="formData.smsNotifications">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="control-item">
                <div class="control-info">
                  <h4>Profile Visibility</h4>
                  <p>Allow other users to see your profile and reviews</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="formData.profileVisible">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" @click="closeModal" class="btn btn-outline">
          Cancel
        </button>
        <button @click="saveProfile" class="btn btn-primary" :disabled="isSaving">
          <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-save"></i>
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProfileModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    userProfile: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isSaving: false,
      newBrand: '',
      formData: {
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        avatar: '',
        skinType: '',
        hairType: '',
        skinConcerns: [],
        favoriteBrands: [],
        emailNotifications: true,
        smsNotifications: false,
        profileVisible: true
      },
      skinConcerns: [
        'Acne', 'Dark Spots', 'Fine Lines', 'Dryness', 'Oily T-Zone', 
        'Sensitivity', 'Dullness', 'Large Pores', 'Uneven Tone', 'Dark Circles'
      ]
    };
  },
  watch: {
    userProfile: {
      handler(newProfile) {
        if (newProfile) {
          this.formData = {
            ...this.formData,
            name: newProfile.name || 'Sarah Johnson',
            email: newProfile.email || 'sarah.j@example.com',
            phone: newProfile.phone || '9775637590',
            avatar: newProfile.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            ...newProfile
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },

    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Create a URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removeAvatar() {
      this.formData.avatar = '';
    },

    addBrand() {
      if (this.newBrand.trim() && !this.formData.favoriteBrands.includes(this.newBrand.trim())) {
        this.formData.favoriteBrands.push(this.newBrand.trim());
        this.newBrand = '';
      }
    },

    removeBrand(brand) {
      const index = this.formData.favoriteBrands.indexOf(brand);
      if (index > -1) {
        this.formData.favoriteBrands.splice(index, 1);
      }
    },

    async saveProfile() {
      this.isSaving = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Emit the updated profile data
        this.$emit('save', this.formData);
        
        // Show success notification
        this.$emit('notify', {
          type: 'success',
          message: 'Profile updated successfully!'
        });
        
        this.closeModal();
      } catch (error) {
        this.$emit('notify', {
          type: 'error',
          message: 'Failed to update profile. Please try again.'
        });
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--gray-200);
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50));
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-500);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-description {
  color: var(--gray-600);
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 16px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Profile Picture Section */
.profile-picture-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.current-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-100);
  cursor: pointer;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 32px;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Checkbox Group */
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-item input:checked + .checkmark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-item input:checked + .checkmark::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

/* Tags Input */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  min-height: 48px;
  align-items: center;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--primary-600);
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  font-size: 14px;
}

/* Privacy Controls */
.privacy-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 12px;
}

.control-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.control-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: 0.2s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-500);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
}

.btn-outline {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-200);
}

.btn-outline:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-picture-section {
    flex-direction: column;
    text-align: center;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
