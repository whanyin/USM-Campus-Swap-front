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

          <el-form-item label="Category" prop="categoryId" class="category-item">
            <el-select
                v-model="form.categoryId"
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
            <el-radio :label="1" border>New</el-radio>
            <el-radio :label="2" border>Like New</el-radio>
            <el-radio :label="3" border>Good</el-radio>
            <el-radio :label="4" border>Fair</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="form-section">
        <h2>Photos</h2>
        <p class="section-subtitle">Add clear photos of your item (up to 8 images)</p>

        <el-form-item prop="images">
          <el-upload
              v-model:file-list="fileList"
              action="#"
              list-type="picture-card"
              :http-request="customUpload"
              :limit="8"
              accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </div>

      <div class="form-section">
        <h2>Delivery Method</h2>

        <el-form-item label="Delivery Option" prop="deliveryMethod">
          <el-radio-group v-model="form.deliveryMethod">
            <el-radio :label="1" border>
              <div class="delivery-option">
                <el-icon><Location /></el-icon>
                <span>Self Pickup</span>
              </div>
            </el-radio>
            <el-radio :label="2" border>
              <div class="delivery-option">
                <el-icon><Box /></el-icon>
                <span>Delivery</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
            v-if="form.deliveryMethod === 1"
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
            <el-option label="Main Campus - Student Center" value="Main Campus - Student Center" />
            <el-option label="Main Campus - Library" value="Main Campus - Library" />
            <el-option label="Engineering Campus" value="Engineering Campus" />
            <el-option label="Health Campus" value="Health Campus" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-section">
        <h2>Contact & Payment</h2>
        <p style="color: #666; font-size: 14px;">
          Buyers will contact you via platform messages to arrange payment and delivery.
        </p>
      </div>

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
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Location, Box, Promotion } from '@element-plus/icons-vue'
import { publishGoods } from '@/api/goods'
import { listCategories } from '@/api/category'
import myAxios from "@/plugins/request.js" // 确保引入了你的 axios 实例

const router = useRouter()
const formRef = ref()
const loading = ref(false)

// 1. 文件列表 (Element Plus 自动维护这个列表)
const fileList = ref([])

// 表单数据
const form = reactive({
  title: '',
  description: '',
  price: null,
  categoryId: null,
  condition: 1,      // 1-New, 2-Like New...
  deliveryMethod: 1, // 1-Pickup, 2-Delivery
  pickupLocation: '',
  contactTypes: [1], // 默认站内信
})

// 验证规则
const rules = reactive({
  title: [
    { required: true, message: 'Please enter item title', trigger: 'blur' },
    { min: 0, max: 60, message: 'Title should be 5-60 characters', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'Please enter item description', trigger: 'blur' },
    { min: 0, max: 500, message: 'Description should be 10-500 characters', trigger: 'blur' }
  ],
  price: [
    { required: true, message: 'Please enter item price', trigger: 'blur' },
    { type: 'number', min: 0.01, message: 'Price must be greater than 0', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: 'Please select category', trigger: 'change' }
  ],
  deliveryMethod: [
    { required: true, message: 'Please select delivery method', trigger: 'change' }
  ]
})

// 动态获取分类
const loadCategories = async () => {
  try {
    // 拦截器处理后，res 直接就是分类列表数组
    const res = await myAxios.get('/category/list')
    if (res) {
      categories.value = res.map(cat => ({
        label: cat.name,
        value: cat.id
      }))
    }
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

onMounted(() => {
  loadCategories()
})

const customUpload = async (options) => {
  const { file, onSuccess, onError } = options

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await myAxios.post('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.code === 0) {
      const url = res.data   // 服务器返回的真实图片URL

      // 关键：找到 el-upload 维护的那个 file 对象
      const targetFile = fileList.value.find(f => f.uid === file.uid)

      if (targetFile) {
        targetFile.url = url        // ⭐ 必须写入 url
        targetFile.status = 'success'
      }

      onSuccess(url)
      ElMessage.success('Image uploaded')
    } else {
      onError(new Error(res.message))
      ElMessage.error(res.message)
    }
  } catch (error) {
    onError(error)
    ElMessage.error('Upload failed')
  }
}


const submitForm = async () => {
  if (!formRef.value) return

  // 检查是否还有图片正在上传中 (status === 'uploading')
  // 如果用户刚选了图就立刻点发布，url 还没回来，必须拦住
  const isUploading = fileList.value.some(file => file.status === 'uploading')
  if (isUploading) {
    ElMessage.warning('Images are still uploading. Please wait...')
    return
  }

  try {
    loading.value = true
    await formRef.value.validate()

    const finalImages = fileList.value
        .map(file => file.url)
        .filter(url => url && !url.startsWith('blob:'))

    console.log("提交给后端的 URL:", finalImages)

    // 再次检查
    if (finalImages.length === 0 && fileList.value.length > 0) {
      // 如果 fileList 有东西，但提取出来是空的，说明全是 blob 且没 response
      ElMessage.error("Image upload processing failed. Please delete the image and upload again.")
      loading.value = false
      return
    }

    // 如果用户根本没传图 (根据业务需求，如果允许不传图，这里就不报错)
    // if (finalImages.length === 0) { ... }

    // 3. 构造请求数据
    const requestData = {
      title: form.title,
      description: form.description,
      price: form.price,
      categoryId: form.categoryId,
      condition: form.condition,
      images: finalImages,
      // 封面图逻辑
      coverImage: finalImages.length > 0 ? finalImages[0] : '',
      campus: 'Main Campus',
      contactTypes: [1],
      deliveryMethod: form.deliveryMethod,
      pickupLocation: form.deliveryMethod === 1 ? form.pickupLocation : ''
    }

    const res = await myAxios.post('/goods/publish', requestData)

    if (res) {
      ElMessage.success('Item published successfully!')
      router.push('/')
    }

  } catch (error) {
    console.error(error)
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('Please fill in all required fields')
    }
  } finally {
    loading.value = false
  }
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.publish-btn {
  width: 200px;
  height: 48px;
  font-size: 16px;
}
</style>