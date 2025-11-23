<template>
  <div id="app">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
}

.el-header {
  padding: 0;
  height: 60px;
}

.el-main {
  min-height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f5f5f5;
}
</style>