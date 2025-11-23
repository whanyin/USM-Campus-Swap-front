<template>
  <div class="messages-page">
    <!-- 左侧对话列表 -->
    <div class="conversations-sidebar">
      <div class="sidebar-header">
        <h2>Messages</h2>
        <el-button type="primary" text class="new-chat-btn">
          <el-icon><ChatDotRound /></el-icon>
          New Chat
        </el-button>
      </div>

      <div class="search-box">
        <el-input
            v-model="searchKeyword"
            placeholder="Search conversations..."
            prefix-icon="Search"
            clearable
        />
      </div>

      <div class="conversations-list">
        <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="conversation-item"
            :class="{ active: activeConversation?.id === conversation.id }"
            @click="selectConversation(conversation.id)"
        >
          <el-avatar :size="48" :src="conversation.avatar" />
          <div class="conversation-info">
            <div class="conversation-header">
              <h4 class="conversation-name">{{ conversation.name }}</h4>
              <span class="conversation-time">{{ conversation.lastTime }}</span>
            </div>
            <p class="conversation-preview">{{ conversation.lastMessage }}</p>
            <div class="conversation-meta">
              <el-tag v-if="conversation.isSeller" type="success" size="small">Seller</el-tag>
              <el-tag v-if="conversation.isBuyer" type="warning" size="small">Buyer</el-tag>
              <el-badge v-if="conversation.unread" :value="conversation.unread" class="unread-badge" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-area">
      <div v-if="!activeConversation" class="no-conversation">
        <div class="no-conversation-content">
          <el-icon><ChatDotRound /></el-icon>
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>

      <div v-else class="chat-container">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="chat-user-info">
            <el-avatar :size="40" :src="activeConversation.avatar" />
            <div class="user-details">
              <h3>{{ activeConversation.name }}</h3>
              <p class="user-status">
                <span class="status-dot" :class="activeConversation.isOnline ? 'online' : 'offline'"></span>
                {{ activeConversation.isOnline ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>
          <div class="chat-actions">
            <el-button type="primary" @click="viewUserProfile(activeConversation.userId)">
              <el-icon><User /></el-icon>
              View Profile
            </el-button>
            <el-button @click="viewRelatedItem(activeConversation.itemId)">
              <el-icon><Box /></el-icon>
              View Item
            </el-button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', message.sender === 'me' ? 'sent' : 'received']"
          >
            <div class="message-content">
              <p class="message-text">{{ message.content }}</p>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <el-avatar
                v-if="message.sender !== 'me'"
                :size="32"
                :src="activeConversation.avatar"
                class="message-avatar"
            />
          </div>
        </div>

        <!-- 消息输入 -->
        <div class="message-input-container">
          <div class="input-actions">
            <el-button type="text" class="action-btn">
              <el-icon><Picture /></el-icon>
            </el-button>
            <el-button type="text" class="action-btn">
              <el-icon><Files /></el-icon>
            </el-button>
          </div>
          <el-input
              v-model="newMessage"
              type="textarea"
              :rows="2"
              placeholder="Type a message..."
              :maxlength="500"
              show-word-limit
              @keydown.enter.exact.prevent="sendMessage"
          />
          <el-button
              type="primary"
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="send-btn"
          >
            <el-icon><Promotion /></el-icon>
            Send
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ChatDotRound,
  Search,
  User,
  Box,
  Picture,
  Files,
  Promotion
} from '@element-plus/icons-vue'

const searchKeyword = ref('')
const activeConversation = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

// 模拟对话数据
const conversations = ref([
  {
    id: '1',
    name: 'Bob Johnson',
    avatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    lastMessage: 'Hi, is the basketball still available?',
    lastTime: '2 min ago',
    unread: 3,
    isSeller: true,
    isBuyer: false,
    isOnline: true,
    userId: 'user123',
    itemId: 'item1'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    avatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    lastMessage: 'I can offer RM 220 for the bicycle',
    lastTime: '1 hour ago',
    unread: 0,
    isSeller: false,
    isBuyer: true,
    isOnline: false,
    userId: 'user456',
    itemId: 'item3'
  },
  {
    id: '3',
    name: 'Wang Wei',
    avatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    lastMessage: 'When can I pick up the laptop?',
    lastTime: '3 hours ago',
    unread: 1,
    isSeller: false,
    isBuyer: true,
    isOnline: true,
    userId: 'user789',
    itemId: 'item2'
  },
  {
    id: '4',
    name: 'Tan Mei Ling',
    avatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    lastMessage: 'Thanks for the quick delivery!',
    lastTime: '1 day ago',
    unread: 0,
    isSeller: true,
    isBuyer: false,
    isOnline: false,
    userId: 'user101',
    itemId: 'item4'
  }
])

// 模拟消息数据
const messages = ref([
  {
    id: '1',
    content: 'Hi, is the basketball still available?',
    sender: 'them',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '2',
    content: 'Yes, it\'s still available! It\'s in great condition.',
    sender: 'me',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '3',
    content: 'That\'s great! Can I see more pictures?',
    sender: 'them',
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: '4',
    content: 'Sure, I can send you more photos. When would you like to meet?',
    sender: 'me',
    timestamp: new Date()
  }
])

// 过滤对话列表
const filteredConversations = computed(() => {
  if (!searchKeyword.value) return conversations.value
  return conversations.value.filter(conv =>
      conv.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 选择对话
const selectConversation = (conversationId) => {
  activeConversation.value = conversations.value.find(conv => conv.id === conversationId)
  // 清除未读消息
  const conversation = conversations.value.find(conv => conv.id === conversationId)
  if (conversation) {
    conversation.unread = 0
  }
  scrollToBottom()
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim() || !activeConversation.value) return

  const message = {
    id: Date.now().toString(),
    content: newMessage.value.trim(),
    sender: 'me',
    timestamp: new Date()
  }

  messages.value.push(message)
  newMessage.value = ''

  // 模拟对方回复
  setTimeout(() => {
    const reply = {
      id: (Date.now() + 1).toString(),
      content: 'Thanks for your message! I\'ll get back to you soon.',
      sender: 'them',
      timestamp: new Date()
    }
    messages.value.push(reply)
    scrollToBottom()
  }, 2000)

  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 查看用户资料
const viewUserProfile = (userId) => {
  ElMessage.info(`Viewing profile of user ${userId}`)
}

// 查看相关商品
const viewRelatedItem = (itemId) => {
  ElMessage.info(`Viewing item ${itemId}`)
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.messages-page {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100vh;
  background: #f8f9fa;
}

/* 左侧对话列表 */
.conversations-sidebar {
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.new-chat-btn {
  font-weight: 500;
}

.search-box {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.conversation-item:hover {
  background-color: #f9fafb;
}

.conversation-item.active {
  background-color: #f0f7ff;
  border-right: 3px solid #409eff;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.conversation-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.conversation-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.conversation-preview {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.unread-badge {
  margin-left: auto;
}

/* 右侧聊天区域 */
.chat-area {
  display: flex;
  flex-direction: column;
  background: white;
}

.no-conversation {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.no-conversation-content {
  text-align: center;
  color: #6b7280;
}

.no-conversation-content .el-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.no-conversation-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.no-conversation-content p {
  margin: 0;
  font-size: 14px;
}

/* 聊天容器 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.user-status {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.online {
  background-color: #10b981;
}

.status-dot.offline {
  background-color: #9ca3af;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

/* 消息列表 */
.messages-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 70%;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.received {
  align-self: flex-start;
}

.message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.sent .message-content {
  background: #409eff;
  color: white;
}

.message-text {
  margin: 0 0 4px 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.message-avatar {
  align-self: flex-end;
}

/* 消息输入 */
.message-input-container {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  color: #6b7280;
}

.action-btn:hover {
  color: #409eff;
}

.message-input-container :deep(.el-textarea) {
  flex: 1;
}

.message-input-container :deep(.el-textarea__inner) {
  border-radius: 12px;
  resize: none;
}

.send-btn {
  height: auto;
  padding: 12px 20px;
  border-radius: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .messages-page {
    grid-template-columns: 1fr;
  }

  .conversations-sidebar {
    display: none;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .messages-container {
    padding: 16px;
  }

  .message-input-container {
    padding: 12px 16px;
  }

  .message {
    max-width: 85%;
  }
}

/* 滚动条样式 */
.conversations-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>