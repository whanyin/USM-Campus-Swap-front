<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Discover USM's Best Second-hand Deals</h1>
        <p>Buy, sell, and trade within your campus community</p>
        <el-button type="primary" size="large" @click="scrollToProducts">Start Exploring</el-button>
      </div>
    </div>

    <div class="category-filter">
      <div
          class="filter-item"
          :class="{ active: activeCategory === 'all' }"
          @click="handleCategorySelect('all')"
      >
        All
      </div>
      <div
          v-for="cat in categories"
          :key="cat.id"
          class="filter-item"
          :class="{ active: activeCategory === cat.id }"
          @click="handleCategorySelect(cat.id)"
      >
        {{ cat.name }}
      </div>
    </div>

    <div class="products-container" id="products-anchor" v-loading="loading">

      <el-empty v-if="!loading && products.length === 0" description="No items found" />

      <div v-else class="products-grid">
        <div
            v-for="item in products"
            :key="item.id"
            class="product-card"
            @click="goToDetail(item.id)"
        >
          <div class="card-image">
            <img :src="item.coverImage" :alt="item.title" />
            <span class="condition-tag">{{ item.conditionText }}</span>
            <span class="campus-tag">{{ item.campus }}</span>
          </div>

          <div class="card-info">
            <div class="price-row">
              <span class="price">RM {{ item.price.toFixed(2) }}</span>
              <span class="likes">
                 <el-icon><Star /></el-icon> {{ item.likeCount || 0 }}
              </span>
            </div>
            <h3 class="title" :title="item.title">{{ item.title }}</h3>
            <div class="seller-row">
              <el-avatar :size="20" :src="item.userAvatar" />
              <span class="seller-name">{{ item.userName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-container" v-if="total > 0">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="queryParams.pageSize"
            @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Star } from '@element-plus/icons-vue'
import { getGoodsList } from '@/api/goods'      // 引入商品API
import { listCategories } from '@/api/category' // 引入分类API

const router = useRouter()
const route = useRoute()

// 状态变量
const loading = ref(false)
const products = ref([])
const categories = ref([])
const activeCategory = ref('all')
const total = ref(0)

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 12,
  keyword: '',
  categoryId: null
})

// --- 核心逻辑 1: 加载分类 ---
const loadCategories = async () => {
  try {
    const res = await listCategories()
    categories.value = res
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

// --- 核心逻辑 2: 加载商品列表 ---
const loadProducts = async () => {
  loading.value = true
  try {
    // 检查路由里有没有搜索关键词
    if (route.query.keyword) {
      queryParams.keyword = route.query.keyword
    }

    const res = await getGoodsList(queryParams)

    // 处理后端返回的数据
    // 后端返回的是 IPage 对象，列表在 records 字段里
    const rawList = res.records || []
    total.value = res.total || 0

    //  数据转换 (Data Mapping)
    products.value = rawList.map(item => {
      let cover = 'https://placehold.co/300x300?text=No+Image'

      if (item.images) {
        try {
          // 尝试解析 JSON
          const imgArray = JSON.parse(item.images)
          if (Array.isArray(imgArray) && imgArray.length > 0) {
            cover = imgArray[0] // 取第一张图
          }
        } catch (e) {
          // 如果解析失败（或者已经是普通字符串），直接用
          // 这里的逻辑是为了兼容某些可能直接存了 URL 字符串的情况
          if (item.images && item.images.startsWith('http')) {
            cover = item.images
          }
        }
      }

      // 2. 处理成色 (Number -> Text)
      const conditionMap = { 1: 'New', 2: 'Like New', 3: 'Good', 4: 'Fair' }

      return {
        ...item,
        coverImage: cover,
        conditionText: conditionMap[item.condition] || 'Good',
        userAvatar: item.sellerAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 默认头像
        userName: item.sellerName || 'User'
      }
    })

  } catch (error) {
    console.error('Failed to load products', error)
  } finally {
    loading.value = false
  }
}

// 分类点击
const handleCategorySelect = (id) => {
  activeCategory.value = id
  queryParams.categoryId = id === 'all' ? null : id
  queryParams.pageNum = 1 // 重置到第一页
  loadProducts()
}

// 翻页
const handlePageChange = (val) => {
  queryParams.pageNum = val
  loadProducts()
  scrollToProducts()
}

// 跳转详情
const goToDetail = (id) => {
  router.push(`/goods/${id}`)
}

// 滚动到商品区
const scrollToProducts = () => {
  document.getElementById('products-anchor')?.scrollIntoView({ behavior: 'smooth' })
}

// 监听搜索词变化
watch(() => route.query.keyword, (newVal) => {
  queryParams.keyword = newVal || ''
  loadProducts()
})

// 页面初始化
onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Banner 样式 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin-bottom: 30px;
}
.hero-content h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
.hero-content p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }

/* 分类筛选条 */
.category-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 20px;
  margin-bottom: 30px;
}
.filter-item {
  padding: 8px 20px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s;
  font-weight: 500;
  color: #6b7280;
}
.filter-item:hover, .filter-item.active {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

/* 商品网格布局 */
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

/* 商品卡片样式 */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-image {
  position: relative;
  height: 200px;
  width: 100%;
  background: #f3f4f6;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.condition-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.campus-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255,255,255,0.9);
  color: #374151;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.card-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.price {
  color: #ef4444;
  font-size: 18px;
  font-weight: 700;
}
.likes {
  color: #9ca3af;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.title {
  font-size: 16px;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
  /* 标题只显示两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.seller-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}
.seller-name {
  font-size: 13px;
  color: #6b7280;
}

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>