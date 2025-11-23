<template>
  <div class="sell-page">
    <div class="page-header">
      <h1>Publish Your Item</h1>
      <p>Fill in the details about your item to start publish</p>
    </div>

    <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        label-position="top"
        class="sell-form"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h2>Basic Information</h2>

        <el-form-item label="Item Title" prop="title">
          <el-input
              v-model="form.title"
              placeholder="Enter a clear and descriptive title"
              size="large"
              maxlength="60"
              show-word-limit
          />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="5"
              placeholder="Describe your item's condition, features, and any relevant details"
              maxlength="500"
              show-word-limit
          />
        </el-form-item>
      </div>

      <!-- 价格和分类 -->
      <div class="form-section">
        <h2>Price & Category</h2>

        <div class="form-row">
          <el-form-item label="Price (RM)" prop="price" class="price-item">
            <el-input-number
                v-model="form.price"
                :min="0"
                :precision="2"
                :step="0.01"
                size="large"
                controls-position="right"
                placeholder="0.00"
            />
          </el-form-item>

          <el-form-item label="Category" prop="category" class="category-item">
            <el-select
                v-model="form.category"
                placeholder="Select category"
                size="large"
                style="width: 100%"
            >
              <el-option
                  v-for="cat in categories"
                  :key="cat.value"
                  :label="cat.label"
                  :value="cat.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Condition" prop="condition">
          <el-radio-group v-model="form.condition">
            <el-radio label="New" border>New</el-radio>
            <el-radio label="Like New" border>Like New</el-radio>
            <el-radio label="Good" border>Good</el-radio>
            <el-radio label="Fair" border>Fair</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 图片上传 -->
      <div class="form-section">
        <h2>Photos</h2>
        <p class="section-subtitle">Add clear photos of your item (up to 8 images)</p>

        <el-form-item prop="images">
          <el-upload
              v-model:file-list="fileList"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageChange"
              :on-remove="handleRemove"
              :limit="8"
              accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </div>

      <!-- 配送方式 -->
      <div class="form-section">
        <h2>Delivery Method</h2>

        <el-form-item label="Available Delivery Options" prop="deliveryMethods">
          <el-checkbox-group v-model="form.deliveryMethods">
            <el-checkbox label="pickup" border>
              <div class="delivery-option">
                <div class="option-icon">
                  <el-icon><Location /></el-icon>
                </div>
                <div class="option-content">
                  <div class="option-title">Self Pickup</div>
                  <div class="option-desc">Buyer picks up from your location</div>
                </div>
              </div>
            </el-checkbox>
            <el-checkbox label="delivery" border>
              <div class="delivery-option">
                <div class="option-icon">
                  <el-icon><Box /></el-icon>
                </div>
                <div class="option-content">
                  <div class="option-title">Delivery</div>
                  <div class="option-desc">You deliver to buyer (additional cost may apply)</div>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 自取地点 -->
        <el-form-item
            v-if="form.deliveryMethods.includes('pickup')"
            label="Pickup Location"
            prop="pickupLocation"
            class="pickup-location"
        >
          <el-select
              v-model="form.pickupLocation"
              placeholder="Select pickup location"
              size="large"
              style="width: 100%"
          >
            <el-option
                v-for="location in pickupLocations"
                :key="location.value"
                :label="location.label"
                :value="location.value"
            />
          </el-select>
          <p class="location-note">Buyer will arrange pickup time with you after purchase</p>
        </el-form-item>
      </div>

      <!-- 支付方式 -->
      <div class="form-section">
        <h2>Payment Method</h2>
        <p class="section-subtitle">Choose how you want to receive payment</p>

        <el-form-item label="Preferred Payment" prop="paymentMethod">
          <el-radio-group v-model="form.paymentMethod">
            <el-radio label="balance" border>
              <div class="payment-option">
                <el-icon><Wallet /></el-icon>
                <div>
                  <div class="option-title">Platform Balance</div>
                </div>
              </div>
            </el-radio>
            <el-radio label="cash" border>
              <div class="payment-option">
                <el-icon><Money /></el-icon>
                <div>
                  <div class="option-title">Cash on Delivery</div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 余额显示 -->
        <div v-if="form.paymentMethod === 'balance'" class="balance-info">
          <div class="balance-card">
            <div class="balance-header">
              <el-icon><Wallet /></el-icon>
              <span>Your Balance</span>
            </div>
            <div class="balance-amount">RM {{ userBalance.toFixed(2) }}</div>
            <p class="balance-note">Payment will be added to your balance after successful transaction</p>
          </div>
        </div>
      </div>

      <!-- 发布按钮 -->
      <div class="form-actions">
        <el-button
            type="primary"
            size="large"
            @click="submitForm"
            :loading="loading"
            class="publish-btn"
        >
          <el-icon><Promotion /></el-icon>
          Publish Item
        </el-button>
        <el-button
            size="large"
            @click="saveAsDraft"
            class="draft-btn"
        >
          <el-icon><DocumentAdd /></el-icon>
          Save as Draft
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Location,
  Box,
  Wallet,
  Money,
  Promotion,
  DocumentAdd
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

// 表单数据
const form = reactive({
  title: '',
  description: '',
  price: null,
  category: '',
  condition: 'Good',
  images: [],
  deliveryMethods: ['pickup'], // 默认选择自取
  pickupLocation: '',
  paymentMethod: 'balance'
})

// 验证规则
const rules = reactive({
  title: [
    { required: true, message: 'Please enter item title', trigger: 'blur' },
    { min: 5, max: 60, message: 'Title should be 5-60 characters', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'Please enter item description', trigger: 'blur' },
    { min: 10, max: 500, message: 'Description should be 10-500 characters', trigger: 'blur' }
  ],
  price: [
    { required: true, message: 'Please enter item price', trigger: 'blur' },
    { type: 'number', min: 0.01, message: 'Price must be greater than 0', trigger: 'blur' }
  ],
  category: [
    { required: true, message: 'Please select category', trigger: 'change' }
  ],
  condition: [
    { required: true, message: 'Please select condition', trigger: 'change' }
  ],
  deliveryMethods: [
    { required: true, message: 'Please select at least one delivery method', trigger: 'change' }
  ],
  pickupLocation: [
    { required: true, message: 'Please select pickup location', trigger: 'change' }
  ],
  paymentMethod: [
    { required: true, message: 'Please select payment method', trigger: 'change' }
  ]
})

// 分类选项
const categories = ref([
  { label: 'Textbooks', value: 'textbooks' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Daily Supplies', value: 'daily_supplies' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Sports Equipment', value: 'sports' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Others', value: 'others' }
])

// 自取地点选项
const pickupLocations = ref([
  { label: 'Main Campus - Student Center', value: 'main_student_center' },
  { label: 'Main Campus - Library', value: 'main_library' },
  { label: 'Main Campus - Cafeteria', value: 'main_cafeteria' },
  { label: 'Engineering Campus - Main Building', value: 'eng_main' },
  { label: 'Engineering Campus - Library', value: 'eng_library' },
  { label: 'Health Campus - Main Entrance', value: 'health_main' },
  { label: 'Other (specify in description)', value: 'other' }
])

// 用户余额
const userBalance = ref(156.80)

// 图片上传
const fileList = ref([])

const handleImageChange = (file, fileList) => {
  form.images = fileList.map(f => f.raw || f.url)
}

const handleRemove = (file, fileList) => {
  form.images = fileList.map(f => f.raw || f.url)
}

// 表单提交
const submitForm = async () => {
  if (!formRef.value) return

  try {
    loading.value = true
    await formRef.value.validate()

    // 模拟发布过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('Item published successfully!')
    router.push('/my-products')

  } catch (error) {
    ElMessage.error('Please fill in all required fields correctly')
  } finally {
    loading.value = false
  }
}

// 保存草稿
const saveAsDraft = () => {
  ElMessage.info('Item saved as draft')
  // 这里可以添加保存草稿的逻辑
  router.push('/my-products')
}
</script>

<style scoped>
.sell-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
  color: #1f2937;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
}

.sell-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
}

.section-subtitle {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.price-item,
.category-item {
  margin-bottom: 0;
}

/* 配送选项样式 */
.delivery-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  min-width: 200px;
}

.delivery-option .el-icon {
  font-size: 24px;
  color: #409eff;
}

.option-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #6b7280;
}

/* 自取地点 */
.pickup-location {
  margin-top: 20px;
}

.location-note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  margin-bottom: 0;
}

/* 支付选项样式 */
.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  min-width: 250px;
}

.payment-option .el-icon {
  font-size: 24px;
}

/* 余额信息 */
.balance-info {
  margin-top: 20px;
}

.balance-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.balance-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 500;
  color: #1f2937;
}

.balance-header .el-icon {
  color: #67c23a;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
  color: #67c23a;
  margin-bottom: 8px;
}

.balance-note {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* 发布按钮 */
.form-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e5e7eb;
}

.publish-btn,
.draft-btn {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  margin: 0 8px;
}

.publish-btn {
  background-color: #67c23a;
  border-color: #67c23a;
}

.publish-btn:hover {
  background-color: #5daf34;
  border-color: #5daf34;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sell-page {
    padding: 10px;
  }

  .sell-form {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .delivery-option,
  .payment-option {
    min-width: auto;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .publish-btn,
  .draft-btn {
    width: 100%;
    margin: 0;
  }
}

/* 自定义复选框和单选框样式 */
:deep(.el-checkbox.is-bordered) {
  margin-right: 12px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 8px;
}

:deep(.el-radio.is-bordered) {
  margin-right: 12px;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>