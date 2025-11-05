<template>
  <div class="side-wrap">
    <el-menu default-active="1" class="side-menu" router>
      <el-menu-item index="1" :route="{ path: '/crontabs' }">
        <el-icon><CreditCard /></el-icon>
        <span>领星定时任务</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.side-wrap {
  height: calc(100vh - 70px - 40px);
  overflow: auto;
}
.side-menu {
  border-right: none;
}
</style>
