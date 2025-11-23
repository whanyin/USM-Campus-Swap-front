<template>
  <div class="my-products-page">
    <div class="page-header">
      <h1>My Products</h1>
      <p>Manage your listed items and track their status</p>
    </div>

    <div class="page-actions">
      <el-button type="primary" @click="$router.push('/sell')" class="add-product-btn">
        <el-icon><Plus /></el-icon>
        Add New Product
      </el-button>

      <div class="filter-actions">
        <el-input
            v-model="searchKeyword"
            placeholder="Search your products..."
            prefix-icon="Search"
            clearable
            style="width: 300px;"
        />
        <el-select v-model="statusFilter" placeholder="Filter by status" clearable>
          <el-option label="Active" value="active" />
          <el-option label="Sold" value="sold" />
          <el-option label="Draft" value="draft" />
        </el-select>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="products-tabs">
      <el-tab-pane label="Active" name="active">
        <!-- 直接在这里渲染商品，避免组件导入问题 -->
        <div class="products-grid">
          <div
              v-for="product in activeProducts"
              :key="product.id"
              class="product-card"
          >
            <div class="product-image">
              <img :src="product.coverImage" :alt="product.title" />
              <div class="product-status active">Active</div>
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">RM{{ product.price }}</p>

              <div class="product-meta-grid">
                <div class="meta-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ product.campus }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><View /></el-icon>
                  <span>{{ product.viewCount }} views</span>
                </div>
              </div>

              <div class="product-stats-grid">
                <div class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ product.messages }} messages</span>
                </div>
                <div class="stat-item">
                  <el-icon><Star /></el-icon>
                  <span>{{ product.favorites }} favorites</span>
                </div>
              </div>
            </div>

            <div class="product-actions">
              <el-button
                  type="success"
                  @click="handleMarkAsSold(product)"
                  class="action-btn"
              >
                <el-icon><Check /></el-icon>
                Mark Sold
              </el-button>
              <el-button
                  @click="handleEdit(product)"
                  class="action-btn"
              >
                <el-icon><Edit /></el-icon>
                Edit
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Sold" name="sold">
        <div class="products-grid">
          <div
              v-for="product in soldProducts"
              :key="product.id"
              class="product-card"
          >
            <div class="product-image">
              <img :src="product.coverImage" :alt="product.title" />
              <div class="product-status sold">Sold</div>
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">RM{{ product.price }}</p>

              <div class="product-meta-grid">
                <div class="meta-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ product.campus }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><View /></el-icon>
                  <span>{{ product.viewCount }} views</span>
                </div>
              </div>

              <div class="sold-info">
                <el-icon><Check /></el-icon>
                Sold on {{ product.soldAt }}
              </div>
            </div>

            <div class="product-actions">
              <el-button
                  @click="handleView(product)"
                  class="action-btn"
              >
                <el-icon><View /></el-icon>
                View
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Drafts" name="draft">
        <div class="products-grid">
          <div
              v-for="product in draftProducts"
              :key="product.id"
              class="product-card"
          >
            <div class="product-image">
              <img :src="product.coverImage" :alt="product.title" />
              <div class="product-status draft">Draft</div>
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">RM{{ product.price }}</p>

              <div class="product-meta-grid">
                <div class="meta-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ product.campus }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><View /></el-icon>
                  <span>{{ product.viewCount }} views</span>
                </div>
              </div>
            </div>

            <div class="product-actions">
              <el-button
                  type="primary"
                  @click="handlePublish(product)"
                  class="action-btn"
              >
                <el-icon><Promotion /></el-icon>
                Publish
              </el-button>
              <el-button
                  @click="handleEdit(product)"
                  class="action-btn"
              >
                <el-icon><Edit /></el-icon>
                Edit
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Location,
  View,
  ChatDotRound,
  Star,
  Check,
  Promotion,
  Edit
} from '@element-plus/icons-vue'

const activeTab = ref('active')
const searchKeyword = ref('')
const statusFilter = ref('')

// 模拟商品数据
const products = ref([
  {
    id: 1,
    title: 'Basketball',
    price: 25.00,
    coverImage: 'https://i.postimg.cc/yNjYbJ8W/basketball.jpg',
    campus: 'Main Campus',
    viewCount: 156,
    status: 'active',
    createdAt: '2024-01-15',
    messages: 3,
    favorites: 8
  },
  {
    id: 2,
    title: 'Used Laptop ThinkPad',
    price: 1200.00,
    coverImage: 'https://i.postimg.cc/wBQ7Yf0j/laptop.jpg',
    campus: 'Main Campus',
    viewCount: 289,
    status: 'active',
    createdAt: '2024-01-10',
    messages: 5,
    favorites: 12
  },
  {
    id: 3,
    title: 'Java Programming Book',
    price: 35.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816291325-e83fc09d-b519-4633-b1bb-59a150ff3e28.jpg',
    campus: 'Main Campus',
    viewCount: 89,
    status: 'sold',
    createdAt: '2024-01-05',
    soldAt: '2024-01-12',
    soldPrice: 35.00
  },
  {
    id: 4,
    title: 'Smartphone iPhone 12',
    price: 800.00,
    coverImage: 'https://files.imagetourl.net/uploads/1763816270878-b14fc217-39b8-4052-ae6b-7ae2ef1a9e0c.jpg',
    campus: 'Main Campus',
    viewCount: 234,
    status: 'draft',
    createdAt: '2024-01-08'
  }
])

// 计算属性
const activeProducts = computed(() => {
  return products.value.filter(p => p.status === 'active')
})

const soldProducts = computed(() => {
  return products.value.filter(p => p.status === 'sold')
})

const draftProducts = computed(() => {
  return products.value.filter(p => p.status === 'draft')
})

// 操作处理
const handleEdit = (product) => {
  ElMessage.info(`Editing product: ${product.title}`)
}

const handleMarkAsSold = async (product) => {
  try {
    await ElMessageBox.confirm(
        `Are you sure you want to mark "${product.title}" as sold?`,
        'Mark as Sold',
        {
          confirmButtonText: 'Yes, Mark Sold',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
    )

    product.status = 'sold'
    product.soldAt = new Date().toISOString().split('T')[0]
    ElMessage.success('Product marked as sold!')
  } catch {
    // User cancelled
  }
}

const handleView = (product) => {
  ElMessage.info(`Viewing sold product: ${product.title}`)
}

const handlePublish = (product) => {
  product.status = 'active'
  ElMessage.success('Product published successfully!')
}
</script>

<style scoped>
.my-products-page {
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

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-product-btn {
  height: 44px;
  font-weight: 600;
}

.products-tabs {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 商品网格样式 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-status {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-status.active {
  background: #10b981;
}

.product-status.sold {
  background: #6b7280;
}

.product-status.draft {
  background: #f59e0b;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
}

.product-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 4px 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.meta-item .el-icon {
  font-size: 14px;
  color: #9ca3af;
}

.product-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 4px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item .el-icon {
  font-size: 14px;
  color: #667eea;
}

.sold-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
  padding: 6px 10px;
  background: #f0fdf4;
  border-radius: 6px;
  border: 1px solid #dcfce7;
  margin-top: 4px;
}

.sold-info .el-icon {
  font-size: 14px;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-width: 120px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-size: 13px;
  padding: 8px 12px;
}

@media (max-width: 768px) {
  .my-products-page {
    padding: 15px;
  }

  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    flex-direction: column;
  }

  .filter-actions .el-input,
  .filter-actions .el-select {
    width: 100% !important;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    flex-direction: column;
    text-align: center;
  }

  .product-image {
    width: 100%;
    height: 160px;
  }

  .product-meta-grid,
  .product-stats-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .product-actions {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: auto;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }
}
</style>