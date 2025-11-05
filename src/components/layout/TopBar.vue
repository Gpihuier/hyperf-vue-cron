<template>
  <div class="top-bar">
    <div class="left">
      <div class="logo" @click="goHome">
        <img src="../../assets/images/logo.png" alt="logo" title="logo" />
      </div>
      <div class="title">
        <p>定时任务管理后台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push({ path: '/' })
}
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 0 24px;
  box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.3);
  background-color: #fff;
  z-index: 9;
  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo {
    width: 56px;
    height: 56px;
    cursor: pointer;
  }
  .logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .title p {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}
</style>
