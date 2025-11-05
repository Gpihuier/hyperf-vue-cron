<template>
  <div class="container">
    <header class="top">
      <TopBar />
    </header>

    <nav class="nav">
      <SideNavBar />
    </nav>

    <main class="content">
      <router-view />
    </main>

    <footer class="bottom">
      <BottomBar />
    </footer>
  </div>
</template>

<script setup lang="ts">
// give this component a multi-word name to satisfy the "component-name-in-template-casing" / "multi-word-component-names" lint rule
defineOptions({ name: 'AppLayout' })

import TopBar from './TopBar.vue'
import BottomBar from './BottomBar.vue'
import SideNavBar from './SideNavBar.vue'
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 70px 1fr 40px;
  grid-template-areas:
    'top top'
    'nav content'
    'bottom bottom';
  height: 100vh;
}
.top {
  grid-area: top;
}
.nav {
  grid-area: nav;
  border-right: 1px solid #f0f0f0;
  background: #fff;
  padding-top: 12px;
}
.content {
  grid-area: content;
  padding: 20px;
  background: #f8f8f8;
  overflow: auto;
}
.bottom {
  grid-area: bottom;
  height: 50px;
  padding: 8px 0;
  text-align: center;
}
</style>
