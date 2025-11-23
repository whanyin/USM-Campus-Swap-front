<template>
  <div class="home">
    <!-- Carousel -->
    <el-carousel height="400px" :interval="4000">
      <el-carousel-item v-for="item in carouselItems" :key="item.id">
        <div class="carousel-image-container">
          <img :src="item.image" :alt="item.title" class="carousel-image" />
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- Categories -->
    <div class="category-section">
      <h2 class="section-title">Categories</h2>
      <div class="category-grid">
        <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="handleCategoryClick(category.id)"
        >
          <img :src="category.icon" :alt="category.name" class="category-icon" />
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- Hot Products -->
    <div class="hot-goods-section">
      <div class="section-header">
        <h2 class="section-title">Hot Products</h2>
        <el-button type="primary" text @click="$router.push('/goods')">
          View All
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="goods-grid">
        <div
            v-for="goods in hotGoods"
            :key="goods.id"
            class="goods-card"
            @click="$router.push(`/goods/${goods.id}`)"
        >
          <div class="goods-image">
            <img :src="goods.coverImage" :alt="goods.title" />
            <div class="goods-status available">Available</div>
          </div>
          <div class="goods-info">
            <h3 class="goods-title">{{ goods.title }}</h3>
            <p class="goods-price">RM{{ goods.price }}</p>
            <div class="goods-meta">
              <span class="campus">{{ goods.campus }}</span>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ goods.viewCount }}
              </span>
            </div>
            <div class="seller-info">
              <img :src="goods.userAvatar" :alt="goods.userName" class="seller-avatar" />
              <span class="seller-name">{{ goods.userName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="feature-section">
      <h2 class="section-title">Features</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <el-icon size="48" color="#67C23A"><Lock /></el-icon>
          <h3>Secure Transactions</h3>
          <p>Verified identities ensure safe trading</p>
        </div>
        <div class="feature-item">
          <el-icon size="48" color="#E6A23C"><School /></el-icon>
          <h3>Campus Exclusive</h3>
          <p>Only for USM students and staff</p>
        </div>
        <div class="feature-item">
          <el-icon size="48" color="#409EFF"><ChatDotRound /></el-icon>
          <h3>Instant Communication</h3>
          <p>Built-in chat system for easy contact</p>
        </div>
        <div class="feature-item">
          <el-icon size="48" color="#F56C6C"><Box /></el-icon>
          <h3>Multiple Delivery</h3>
          <p>Support pickup and express delivery</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  View,
  Lock,
  School,
  ChatDotRound,
} from '@element-plus/icons-vue'

const router = useRouter()

// Carousel data
const carouselItems = ref([
  {
    id: 1,
    image: 'https://files.imagetourl.net/uploads/1763815584727-f4862246-02c8-4807-94e7-f289876cb6bf.png',
  },
  {
    id: 2,
    image: 'https://files.imagetourl.net/uploads/1763815623999-123acd52-6231-41b5-ae70-8b7627254e92.jpg',
  },
  {
    id: 3,
    image: 'https://files.imagetourl.net/uploads/1763815654486-d3db784d-bc5d-41be-bde3-e3ac2d20c087.jpg',
  }
])

// Categories data
const categories = ref([
  {
    id: 1,
    name: 'Textbooks',
    icon: 'https://cdn-icons-png.flaticon.com/512/2702/2702134.png'
  },
  {
    id: 2,
    name: 'Electronics',
    icon: 'https://cdn-icons-png.flaticon.com/512/9018/9018746.png'
  },
  {
    id: 3,
    name: 'Transportation',
    icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png'
  },
  {
    id: 4,
    name: 'Daily Supplies',
    icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png'
  },
  {
    id: 5,
    name: 'Clothing',
    icon: 'https://cdn-icons-png.flaticon.com/512/892/892458.png'
  },
  {
    id: 6,
    name: 'Sports Equipment',
    icon: 'https://cdn-icons-png.flaticon.com/512/857/857422.png'
  }
])

// Hot products data
const hotGoods = ref([
  {
    id: 1,
    title: 'Basketball',
    price: 25.00,
    coverImage: 'https://i.postimg.cc/yNjYbJ8W/basketball.jpg',
    campus: 'Main Campus',
    viewCount: 156,
    userName: 'Bob',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 2,
    title: 'Used Laptop ThinkPad',
    price: 1200.00,
    coverImage: 'https://i.postimg.cc/wBQ7Yf0j/laptop.jpg',
    campus: 'Main Campus',
    viewCount: 289,
    userName: 'Siti',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 3,
    title: 'Bicycle',
    price: 280.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816237198-85d345c2-e7ee-4a15-8fc4-b82adf101b1e.jpg',
    campus: 'Engineering Campus',
    viewCount: 342,
    userName: 'Wang wei',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 4,
    title: 'Java Programming Book',
    price: 35.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816291325-e83fc09d-b519-4633-b1bb-59a150ff3e28.jpg',
    campus: 'Main Campus',
    viewCount: 89,
    userName: 'Tan Wei Ming',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 5,
    title: 'Smartphone iPhone 12',
    price: 800.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816270878-b14fc217-39b8-4052-ae6b-7ae2ef1a9e0c.jpg',
    campus: 'Main Campus',
    viewCount: 234,
    userName: 'Chen Qi',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 6,
    title: 'Dorm Refrigerator',
    price: 320.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816253332-bab3874d-329f-4452-a6dc-73b36a1fed7b.jpg',
    campus: 'Main Campus',
    viewCount: 167,
    userName: 'Lina',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 7,
    title: 'Shoes',
    price: 120.00,
    coverImage: 'https://i.postimg.cc/rw6m0XHp/shoes.jpg',
    campus: 'Main Campus',
    viewCount: 167,
    userName: 'Ahmad',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  },
  {
    id: 8,
    title: 'T-shirt',
    price: 40.00,
    coverImage: ' https://i.postimg.cc/rwcDZ2Nv/xia-zai-(2).jpg',
    campus: 'Main Campus',
    viewCount: 167,
    userName: 'Lin Yue',
    userAvatar: 'https://files.imagetourl.net/uploads/1763816168510-47145212-c6b1-4993-b848-fffaa4d2c8c5.jpg'
  }
])

// Category click handler
const handleCategoryClick = (categoryId) => {
  router.push(`/goods?categoryId=${categoryId}`)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

/* Carousel styles */
.carousel-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Categories section */
.category-section {
  margin: 40px 0;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.category-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  object-fit: contain;
}

.category-card span {
  font-weight: 500;
  color: #666;
}

/* Hot products section */
.hot-goods-section {
  margin: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.goods-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.goods-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.goods-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  background: #67C23A;
}

.goods-info {
  padding: 15px;
}

.goods-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #F56C6C;
  margin-bottom: 8px;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #909399;
}

.goods-meta .views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seller-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 0.9rem;
  color: #666;
}

/* Features section */
.feature-section {
  margin: 40px 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.feature-item {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  margin: 15px 0 10px;
  font-size: 1.2rem;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.5;
}

/* Responsive design */
@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .goods-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

/* Fallback styles for image loading */
.category-icon:before,
.goods-image img:before {
  content: "📦";
  font-size: 24px;
}
</style>