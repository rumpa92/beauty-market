<template>
  <div class="ticketing-system">
    <div class="ticket-header">
      <h3>Support Tickets</h3>
      <p>Create and track your support requests</p>
    </div>

    <div class="ticket-actions">
      <button @click="createNewTicket" class="create-ticket-btn">
        <i class="fas fa-plus"></i>
        Create New Ticket
      </button>
    </div>

    <div class="ticket-list">
      <div v-if="tickets.length === 0" class="empty-state">
        <i class="fas fa-ticket-alt"></i>
        <h4>No tickets yet</h4>
        <p>Create your first support ticket to get help from our team</p>
      </div>

      <div v-else>
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id"
          class="ticket-item"
        >
          <div class="ticket-status" :class="ticket.status"></div>
          <div class="ticket-content">
            <div class="ticket-info">
              <h5>{{ ticket.subject }}</h5>
              <p>Ticket #{{ ticket.id }}</p>
            </div>
            <div class="ticket-meta">
              <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
              <span class="ticket-priority" :class="ticket.priority">{{ ticket.priority }}</span>
            </div>
          </div>
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TicketingSystem',
  computed: {
    ...mapGetters('support', ['tickets'])
  },
  methods: {
    createNewTicket() {
      console.log('Creating new ticket...');
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.ticketing-system {
  padding: 24px;
  height: 600px;
  overflow-y: auto;
}

.ticket-header {
  margin-bottom: 24px;
}

.ticket-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.ticket-header p {
  color: var(--gray-600);
  margin: 0;
}

.ticket-actions {
  margin-bottom: 24px;
}

.create-ticket-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #ec4899;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-ticket-btn:hover {
  background: #db2777;
  transform: translateY(-1px);
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-500);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.empty-state p {
  margin: 0;
  line-height: 1.5;
}

.ticket-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-item:hover {
  border-color: #ec4899;
  background: #fdf2f8;
}

.ticket-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ticket-status.open {
  background: #10b981;
}

.ticket-status.pending {
  background: #f59e0b;
}

.ticket-status.closed {
  background: #6b7280;
}

.ticket-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-info h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.ticket-info p {
  font-size: 14px;
  color: var(--gray-600);
  margin: 0;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.ticket-date {
  font-size: 12px;
  color: var(--gray-500);
}

.ticket-priority {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.ticket-priority.high {
  background: #fee2e2;
  color: #dc2626;
}

.ticket-priority.medium {
  background: #fef3c7;
  color: #d97706;
}

.ticket-priority.low {
  background: #e0e7ff;
  color: #3730a3;
}
</style>
