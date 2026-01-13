<template>
  <div class="header">
    <!-- 左侧导航 -->
    <div class="header-left">
      <router-link to="/" class="logo">
        <el-icon><Shop /></el-icon>
        <span>USM Campus Swap</span>
      </router-link>
      <el-menu mode="horizontal" :default-active="activeIndex" router class="main-nav">
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="/my-products">
          <el-icon><Collection /></el-icon>
          <span>My Products</span>
        </el-menu-item>
        <el-menu-item index="/my-wishlist">
          <el-icon><Star /></el-icon>
          <span>Wishlist</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>Orders</span>
        </el-menu-item>
        <el-menu-item index="/help">
          <el-icon><ChatDotRound /></el-icon>
          <span>Help</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 中间搜索框 -->
    <div class="header-center">
      <el-input
          v-model="searchKeyword"
          placeholder="Search products..."
          class="search-input"
          @keyup.enter="handleSearch"
          clearable
          size="large"
      >
        <template #append>
          <el-button icon="Search" @click="handleSearch" size="large"></el-button>
        </template>
      </el-input>
    </div>

    <!-- 右侧功能区域 -->
    <div class="header-right">
      <!-- 消息和发布按钮 -->
      <div class="action-buttons">
          <el-button
              icon="ChatDotRound"
              @click="goMessages"
              class="message-button"
              size="large"
              circle
          ></el-button>
        <router-link to="/sell">
          <el-button
              class="sell-button"
              size="large"
              icon="Plus"
          >
            Sell
          </el-button>
        </router-link>
      </div>

      <!-- 用户认证区域 -->
      <div class="auth-section">
        <template v-if="!isLogin">
          <div class="auth-buttons">
            <el-button
                link
                class="login-btn"
                @click="router.push('/login')"
            >
              Login
            </el-button>
            <span class="divider">/</span>
            <el-button
                link
                class="register-btn"
                @click="router.push('/register')"
            >
              Register
            </el-button>
          </div>
        </template>
        <template v-else>
          <el-dropdown trigger="click" class="user-dropdown">
            <span class="user-avatar">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="user-name">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><User /></el-icon>
                  Profile
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // 1. 引入 Store
import {
  Shop,
  House,
  Star,
  Collection,
  Document,
  ChatDotRound,
  Plus,
  Search,
  ArrowDown,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore() // 2. 实例化 Store

const searchKeyword = ref('')
const activeIndex = computed(() => route.path)

// ★★★ 3. 核心修改：从 Store 中获取真实数据 ★★★
// 使用 computed 确保响应式：Store 变了，这里自动跟着变
const isLogin = computed(() => !!userStore.userInfo)
const userAvatar = computed(() => userStore.userInfo?.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png') // 默认头像
const userName = computed(() => userStore.userInfo?.username || 'User')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/goods?keyword=${searchKeyword.value}`)
  }
}

// ★★★ 4. 真实的注销逻辑 ★★★
const handleLogout = async () => {
  await userStore.logout() // 调用 Store 的注销方法
  // 清空完 Store 后，自动跳转回首页或登录页
  router.push('/login')
  // 可选：强制刷新页面以清除所有残留状态
  // window.location.reload()
}

const goMessages = () => {
  router.push('/messages')
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  position: relative;
}

/* 左侧导航 */
.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #409eff;
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.main-nav {
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.main-nav .el-menu-item {
  padding: 0 16px;
  border-radius: 6px;
  height: 48px;
  line-height: 48px;
}

/* 中间搜索框 - 现在真正居中 */
.header-center {
  display: flex;
  align-items: center;
  justify-content: center; /* 让搜索框在中间区域居中 */
  flex: 1; /* 占据左右两侧剩下的所有空间 */
  min-width: 0; /* 防止内容溢出 */
}

.search-input {
  .search-input {
    width: 100%; /* 改为 100% */
    max-width: 500px; /* 保持原来的宽度作为最大限制 */
  }
}

.search-input :deep(.el-input-group__append) {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.search-input :deep(.el-input-group__append:hover) {
  background-color: #337ecc;
  border-color: #337ecc;
}

/* 右侧功能区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 20px; /* 增加按钮间距从 12px 到 20px */
  margin-right: 16px; /* 在按钮组和认证区域之间添加间距 */
}

/* 消息按钮样式 */
.message-button {
  font-size: 18px;
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
}

.message-button:hover {
  background-color: #f5f7fa;
  transform: scale(1.05);
}

.message-badge :deep(.el-badge__content) {
  top: 8px;
  right: 8px;
}

/* 发布按钮样式 */
.sell-button {
  background-color: #ff5722;
  border-color: #ff5722;
  color: #fff;
  font-weight: 600;
  padding: 0 24px;
  height: 44px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.sell-button:hover {
  background-color: #e64a19;
  border-color: #e64a19;
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
}

/* 用户认证区域 */
.auth-section {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.login-btn,
.register-btn {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.login-btn:hover,
.register-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.divider {
  color: #dcdfe6;
  font-size: 14px;
}

/* 用户下拉菜单 */
.user-dropdown {
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-input {
    width: 400px;
  }

  .action-buttons {
    gap: 16px; /* 在中等屏幕上稍微减小间距 */
  }
}

@media (max-width: 1024px) {
  .search-input {
    width: 350px;
  }

  .header {
    padding: 0 16px;
  }

  .action-buttons {
    gap: 12px; /* 在小屏幕上进一步减小间距 */
    margin-right: 12px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
  }

  .header-center {
    position: static;
    transform: none;
    order: 3;
    width: 100%;
    margin-top: 12px;
  }

  .search-input {
    width: 100%;
  }

  .header-left {
    flex: none;
  }

  .header-right {
    flex: none;
    gap: 12px;
  }

  .action-buttons {
    gap: 8px;
    margin-right: 8px;
  }

  .main-nav {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    flex-direction: column;
    gap: 2px;
  }

  .divider {
    display: none;
  }

  .action-buttons {
    gap: 6px;
  }

  .sell-button {
    padding: 0 16px;
    font-size: 12px;
  }

  .message-button,
  .sell-button {
    height: 40px;
    width: 40px;
  }

  .sell-button {
    padding: 0 12px;
  }
}
</style>