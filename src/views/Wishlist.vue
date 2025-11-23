<template>
  <div class="wishlist-page">
    <div class="page-header">
      <h1>My Wishlist</h1>
      <p>Items you've saved for later</p>
    </div>

    <div class="wishlist-content">
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <div class="empty-content">
          <el-icon><Star /></el-icon>
          <h3>Your wishlist is empty</h3>
          <p>Start exploring and add items you're interested in!</p>
          <el-button type="primary" @click="$router.push('/')">
            <el-icon><ShoppingCart /></el-icon>
            Start Shopping
          </el-button>
        </div>
      </div>

      <div v-else class="wishlist-grid">
        <div
            v-for="item in wishlistItems"
            :key="item.id"
            class="wishlist-item"
        >
          <div class="item-image">
            <img :src="item.coverImage" :alt="item.title" />
            <div class="item-actions">
              <el-button
                  type="danger"
                  size="small"
                  circle
                  @click="removeFromWishlist(item.id)"
                  class="remove-btn"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div class="item-status available">Available</div>
          </div>

          <div class="item-info">
            <h3 class="item-title" @click="$router.push(`/goods/${item.id}`)">{{ item.title }}</h3>
            <p class="item-price">RM{{ item.price }}</p>
            <div class="item-meta">
              <span class="campus">{{ item.campus }}</span>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ item.viewCount }}
              </span>
            </div>
            <div class="seller-info">
              <img :src="item.userAvatar" :alt="item.userName" class="seller-avatar" />
              <span class="seller-name">{{ item.userName }}</span>
            </div>
          </div>

          <div class="item-actions-bottom">
            <el-button type="primary" @click="contactSeller(item)" class="contact-btn">
              <el-icon><ChatDotRound /></el-icon>
              Contact Seller
            </el-button>
            <el-button @click="$router.push(`/goods/${item.id}`)" class="view-btn">
              View Details
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div v-if="wishlistItems.length > 0" class="recommended-section">
      <h2>You might also like</h2>
      <div class="recommended-grid">
        <div
            v-for="item in recommendedItems"
            :key="item.id"
            class="recommended-item"
            @click="$router.push(`/goods/${item.id}`)"
        >
          <img :src="item.coverImage" :alt="item.title" class="recommended-image" />
          <div class="recommended-info">
            <h4>{{ item.title }}</h4>
            <p class="recommended-price">RM{{ item.price }}</p>
            <p class="recommended-campus">{{ item.campus }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, ShoppingCart, Close, ChatDotRound, View } from '@element-plus/icons-vue'

const router = useRouter()

// 模拟收藏商品数据
const wishlistItems = ref([
  {
    id: 5,
    title: 'Smartphone iPhone 12',
    price: 800.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816270878-b14fc217-39b8-4052-ae6b-7ae2ef1a9e0c.jpg',
    campus: 'Main Campus',
    viewCount: 234,
    userName: 'Chen Qi',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    addedAt: '2024-01-10'
  },
  {
    id: 6,
    title: 'Dorm Refrigerator',
    price: 320.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816253332-bab3874d-329f-4452-a6dc-73b36a1fed7b.jpg',
    campus: 'Main Campus',
    viewCount: 167,
    userName: 'Lina',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    addedAt: '2024-01-08'
  },
  {
    id: 7,
    title: 'Shoes',
    price: 120.00,
    coverImage: 'https://i.postimg.cc/rw6m0XHp/shoes.jpg',
    campus: 'Main Campus',
    viewCount: 167,
    userName: 'Ahmad',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg',
    addedAt: '2024-01-05'
  }
])

// 模拟推荐商品
const recommendedItems = ref([
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
    coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop',
    campus: 'Main Campus'
  },
  {
    id: 10,
    title: 'Textbook - Calculus',
    price: 45.00,
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=200&fit=crop',
    campus: 'Engineering Campus'
  },
  {
    id: 11,
    title: 'Headphones',
    price: 85.00,
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    campus: 'Main Campus'
  }
])

// 从收藏移除
const removeFromWishlist = async (itemId) => {
  try {
    await ElMessageBox.confirm(
        'Are you sure you want to remove this item from your wishlist?',
        'Remove from Wishlist',
        {
          confirmButtonText: 'Remove',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
    )

    wishlistItems.value = wishlistItems.value.filter(item => item.id !== itemId)
    ElMessage.success('Item removed from wishlist')
  } catch {
    // User cancelled
  }
}

// 联系卖家
const contactSeller = (item) => {
  ElMessage.success(`Opening chat with ${item.userName}...`)
  router.push('/messages')
}
</script>

<style scoped>
.wishlist-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* 空状态 */
.empty-wishlist {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.empty-content .el-icon {
  font-size: 64px;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.empty-content h3 {
  font-size: 20px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-content p {
  color: #6b7280;
  margin-bottom: 24px;
}

/* 收藏商品网格 */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.wishlist-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.wishlist-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-actions {
  position: absolute;
  top: 12px;
  right: 12px;
}

.remove-btn {
  background: rgba(239, 68, 68, 0.9);
  border: none;
}

.remove-btn:hover {
  background: #dc2626;
}

.item-status {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  background: #10b981;
}

.item-info {
  padding: 16px;
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
  cursor: pointer;
  line-height: 1.4;
}

.item-title:hover {
  color: #409eff;
}

.item-price {
  font-size: 18px;
  font-weight: bold;
  color: #ef4444;
  margin-bottom: 12px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  color: #6b7280;
}

.item-meta .views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.seller-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 13px;
  color: #6b7280;
}

.item-actions-bottom {
  padding: 0 16px 16px;
  display: flex;
  gap: 8px;
}

.contact-btn, .view-btn {
  flex: 1;
}

/* 推荐商品 */
.recommended-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 40px;
}

.recommended-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #1f2937;
  text-align: center;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.recommended-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.recommended-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recommended-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
}

.recommended-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.4;
}

.recommended-price {
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
  margin: 0 0 4px 0;
}

.recommended-campus {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .wishlist-page {
    padding: 15px;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .item-actions-bottom {
    flex-direction: column;
  }

  .recommended-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>