<template>
  <div class="goods-detail">
    <div class="goods-container">
      <!-- 商品图片轮播 -->
      <div class="goods-gallery">
        <el-carousel :interval="5000" arrow="always" height="400px" indicator-position="outside">
          <el-carousel-item v-for="img in goods.images" :key="img">
            <img :src="img" :alt="goods.title" class="carousel-image" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 商品信息 -->
      <div class="goods-info">
        <h1 class="goods-title">{{ goods.title }}</h1>
        <div class="goods-price">RM{{ goods.price }}</div>

        <div class="goods-meta">
          <div class="meta-item">
            <span class="label">Category:</span>
            <span class="value">{{ goods.category }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Condition:</span>
            <el-tag :type="conditionType" size="small">{{ goods.condition }}</el-tag>
          </div>
          <div class="meta-item">
            <span class="label">Campus:</span>
            <span class="value">{{ goods.campus }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Posted:</span>
            <span class="value">{{ goods.postedDate }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Views:</span>
            <span class="value">{{ goods.viewCount }}</span>
          </div>
        </div>

        <div class="goods-description">
          <h3>Description</h3>
          <p>{{ goods.description }}</p>
        </div>

        <div class="action-buttons">
          <el-button type="primary" size="large" @click="purchaseItem" class="purchase-btn">
            <el-icon><ShoppingCart /></el-icon>
            Purchase
          </el-button>
          <el-button
              size="large"
              :type="isInWishlist ? 'danger' : 'default'"
              @click="toggleWishlist"
              class="wishlist-btn"
          >
            <el-icon><Star /></el-icon>
            {{ isInWishlist ? 'In Wishlist' : 'Add to Wishlist' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 卖家信息 -->
    <div class="seller-section">
      <div class="seller-card">
        <div class="seller-header">
          <el-avatar :size="60" :src="goods.userAvatar" />
          <div class="seller-info">
            <h3>{{ goods.userName }}</h3>
            <div class="seller-rating">
              <el-rate v-model="goods.seller.rating" disabled show-score text-color="#ff9900" />
              <span class="review-count">({{ goods.seller.reviewCount }} reviews)</span>
            </div>
            <div class="seller-stats">
              <span class="stat">Items: {{ goods.seller.itemCount }}</span>
              <span class="stat">Member since: {{ goods.seller.joinDate }}</span>
            </div>
          </div>
        </div>
        <div class="seller-actions">
          <el-button @click="viewSellerProfile">View Profile</el-button>
          <el-button type="primary" @click="sendMessage">Send Message</el-button>
        </div>
      </div>
    </div>

    <!-- 相关商品 -->
    <div class="related-section">
      <h2>Other Goods</h2>
      <div class="related-goods">
        <div
            v-for="item in relatedGoods"
            :key="item.id"
            class="related-item"
            @click="viewGoods(item.id)"
        >
          <img :src="item.coverImage" :alt="item.title" class="related-image" />
          <div class="related-info">
            <h4>{{ item.title }}</h4>
            <p class="related-price">RM{{ item.price }}</p>
            <p class="related-campus">{{ item.campus }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Star } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// Mock商品数据 - 基于您的篮球商品扩展
const goods = ref({
  id: 1,
  title: 'Basketball',
  price: 25.00,
  coverImage: 'https://i.postimg.cc/yNjYbJ8W/basketball.jpg',
  campus: 'Main Campus',
  viewCount: 156,
  userName: 'Bob',
  userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
  category: 'Sports Equipment',
  condition: 'Good',
  description: 'Official size basketball in good condition. Used for about 6 months for casual play. Still has good grip and holds air well. No major scratches or damages. Perfect for campus basketball games or practice.',
  postedDate: '2 days ago',
  images: [
    'https://i.postimg.cc/yNjYbJ8W/basketball.jpg',
    'https://i.postimg.cc/yNjYbJ8W/basketball.jpg',
    'https://i.postimg.cc/yNjYbJ8W/basketball.jpg'
  ],
  seller: {
    rating: 4.5,
    reviewCount: 23,
    itemCount: 8,
    joinDate: 'Sep 2023',
    responseTime: 'Usually responds within 1 hour'
  }
})

// 相关商品数据
const relatedGoods = ref([
  {
    id: 7,
    title: 'Shoes',
    price: 120.00,
    coverImage: 'https://i.postimg.cc/rw6m0XHp/shoes.jpg',
    campus: 'Main Campus'
  },
  {
    id: 3,
    title: 'Bicycle',
    price: 280.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816237198-85d345c2-e7ee-4a15-8fc4-b82adf101b1e.jpg',
    campus: 'Engineering Campus'
  },
  {
    id: 8,
    title: 'T-shirt',
    price: 40.00,
    coverImage: 'https://i.postimg.cc/rwcDZ2Nv/xia-zai-(2).jpg',
    campus: 'Main Campus'
  },
  {
    id: 9,
    title: 'Tennis Racket',
    price: 65.00,
    coverImage: 'https://i.postimg.cc/QMYH06mV/xia-zai-(3).jpg',
    campus: 'Main Campus'
  }
])

const isInWishlist = ref(false)

const conditionType = computed(() => {
  const types = {
    'New': 'success',
    'Like New': 'primary',
    'Good': 'warning',
    'Fair': 'info'
  }
  return types[goods.value.condition] || 'info'
})

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  ElMessage({
    type: isInWishlist.value ? 'success' : 'info',
    message: isInWishlist.value ? 'Added to wishlist!' : 'Removed from wishlist'
  })
}

const purchaseItem = () => {
  ElMessage.success('Redirecting to payment page...')
  // 跳转到支付页面
  router.push({
    path: '/payment',
    query: {
      itemId: goods.value.id,
      price: goods.value.price,
      seller: goods.value.userName
    }
  })
}

const sendMessage = async () => {
  try {
    ElMessage.success(`Opening chat with ${goods.value.userName}...`)

    // 模拟创建对话
    const conversationId = await createConversation()

    // 跳转到消息页面
    router.push({
      path: '/messages',
      query: {
        conversation: conversationId,
        item: goods.value.id
      }
    })

  } catch (error) {
    ElMessage.error('Failed to start chat. Please try again.')
  }
}

// 模拟创建对话的函数
const createConversation = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('conv_123456')
    }, 500)
  })
}

const viewSellerProfile = () => {
  ElMessage.info('Navigating to Bob\'s profile...')
}

const viewGoods = (id) => {
  ElMessage.info(`Viewing item ${id}...`)
  router.push(`/goods/${id}`)
}

// 模拟页面加载时增加浏览量
onMounted(() => {
  goods.value.viewCount += 1
})
</script>

<style scoped>
.goods-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.goods-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.goods-gallery {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.goods-price {
  font-size: 32px;
  font-weight: 700;
  color: #ff5722;
  margin-bottom: 24px;
}

.goods-meta {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #6b7280;
  min-width: 80px;
  margin-right: 12px;
}

.value {
  color: #374151;
}

.goods-description h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.goods-description p {
  line-height: 1.6;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.purchase-btn, .wishlist-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

.purchase-btn {
  background-color: #67c23a;
  border-color: #67c23a;
}

.purchase-btn:hover {
  background-color: #5daf34;
  border-color: #5daf34;
}

.seller-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 40px;
  margin-bottom: 40px;
}

.seller-card {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  max-width: 500px;
}

.seller-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.seller-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1f2937;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.review-count {
  color: #6b7280;
  font-size: 14px;
}

.seller-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 14px;
  color: #6b7280;
}

.seller-actions {
  display: flex;
  gap: 12px;
}

.related-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 40px;
}

.related-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #1f2937;
}

.related-goods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.related-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.related-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
}

.related-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1f2937;
}

.related-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff5722;
  margin: 0 0 4px 0;
}

.related-campus {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .goods-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .seller-card {
    max-width: 100%;
  }
}
</style>