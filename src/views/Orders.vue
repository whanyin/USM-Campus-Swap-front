<template>
  <div class="orders-page">
    <div class="page-header">
      <h1>Orders</h1>
      <p>Manage your purchases and sales</p>
    </div>

    <div class="coming-soon">
      <el-result
          icon="info"
          title="Orders Page Coming Soon"
          sub-title="This page is under development"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">Back to Home</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
// 页面逻辑将在后续添加
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.coming-soon {
  margin-top: 60px;
}
</style>