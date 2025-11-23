<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧欢迎信息 -->
      <div class="login-left">
        <div class="welcome-content">
          <h1>Welcome Back</h1>
          <p>Sign in to continue trading with USM Campus Swap</p>
          <div class="features">
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>Access your products</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>Manage your orders</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>Connect with buyers</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="form-container">
          <div class="form-header">
            <h2>Sign In</h2>
            <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
          </div>

          <el-form
              :model="form"
              :rules="rules"
              ref="formRef"
              label-width="0"
              class="login-form"
              size="large"
          >
            <el-form-item prop="userAccount" class="form-item">
              <el-input
                  v-model="form.userAccount"
                  placeholder="Enter your account"
                  :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="userPassword" class="form-item">
              <el-input
                  v-model="form.userPassword"
                  placeholder="Enter your password"
                  type="password"
                  show-password
                  :prefix-icon="Lock"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <el-button
                type="primary"
                size="large"
                @click="handleLogin"
                :loading="loading"
                class="login-btn"
            >
              Sign In
            </el-button>
          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

// 表单数据
const form = reactive({
  userAccount: '',
  userPassword: ''
})

// 验证规则
const rules = reactive({
  userAccount: [
    { required: true, message: 'Please enter your account', trigger: 'blur' },
    { min: 4, message: 'Account must be at least 4 characters', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ]
})

// 登录处理
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    loading.value = true
    await formRef.value.validate()

    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('Login successful!')
    router.push('/')

  } catch (error) {
    if (error.errorFields) {
      ElMessage.error('Please fill in all required fields correctly')
    } else {
      ElMessage.error('Login failed. Please check your account and password.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
}

/* 左侧样式 */
.login-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.welcome-content p {
  font-size: 16px;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.5;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.feature-item .el-icon {
  color: #10b981;
}

/* 右侧样式 */
.login-right {
  padding: 50px 40px;
  display: flex;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-header p {
  color: #6b7280;
  font-size: 14px;
}

.form-header a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.form-header a:hover {
  text-decoration: underline;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-bottom: 25px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 分割线 */
.divider {
  position: relative;
  text-align: center;
  margin-bottom: 25px;
  color: #9ca3af;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 15px;
  position: relative;
}

/* 社交登录 */
.social-login {
  text-align: center;
}

.social-btn {
  width: 100%;
  height: 48px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #667eea;
  background: #f8faff;
  transform: translateY(-1px);
}

.social-icon {
  width: 18px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .login-left {
    padding: 30px 25px;
    min-height: 200px;
  }

  .welcome-content h1 {
    font-size: 24px;
  }

  .welcome-content p {
    font-size: 14px;
  }

  .login-right {
    padding: 30px 25px;
  }

  .form-header h2 {
    font-size: 24px;
  }
}

/* 自定义表单样式 */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
  padding: 0 15px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

:deep(.el-form-item__error) {
  font-size: 12px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #6b7280;
}
</style>