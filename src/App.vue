<template>
  <div id="app">
    <!-- 仅在非登录/注册页面显示顶部导航栏 -->
    <header 
      v-if="$route.path !== '/login' && $route.path !== '/register'" 
      class="app-header"
    >
      <nav>
        <router-link to="/home" @click="scrollToTop">首页</router-link>
        <router-link to="/cats" @click="scrollToTop">猫咪档案</router-link>
        <router-link to="/guide" @click="scrollToTop">救助指南</router-link>
        <router-link to="/stories" @click="scrollToTop">故事分享</router-link>
        <router-link to="/points" @click="scrollToTop">积分兑换</router-link>
        
        <!-- 用户区域：根据登录状态显示不同内容 -->
        <div class="user-area">
          <!-- 已登录状态：显示用户信息和退出按钮 -->
          <div v-if="isLoggedIn" class="user-menu">
            <router-link to="/profile" class="user-icon-link">
              <i class="fas fa-user-circle"></i>
              <span class="username">{{ username }}</span>
            </router-link>
            <!-- 退出登录按钮 -->
            <button @click="logout" class="logout-btn" title="退出登录">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
          <!-- 未登录状态：显示登录链接 -->
          <router-link v-else to="/login" class="login-link">
            <i class="fas fa-sign-in-alt"></i> 登录
          </router-link>
        </div>
      </nav>
    </header>
    
    <!-- 主要内容区域：路由视图容器 -->
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      username: '用户',
      // 添加一个响应式的登录状态
      loggedIn: localStorage.getItem('isLoggedIn') === 'true'
    }
  },
  computed: {
    // 使用响应式的 loggedIn 而不是直接读取 localStorage
    isLoggedIn() {
      return this.loggedIn
    }
  },
  created() {
    this.updateUsername()
    // 监听 storage 事件（当其他标签页修改 localStorage 时）
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {  // 修改这里：beforeDestroy -> beforeUnmount
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    logout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      this.loggedIn = false  // 立即更新响应式状态
      this.username = '用户'
      if (this.$route.path !== '/login') {
        this.$router.push('/login')
      }
    },
    updateUsername() {
      const userData = localStorage.getItem('userData')
      if (userData && this.isLoggedIn) {
        try {
          const user = JSON.parse(userData)
          this.username = user.username || '用户'
        } catch {
          this.username = '用户'
        }
      } else {
        this.username = '用户'
      }
    },
    handleStorageChange(e) {
      if (e.key === 'isLoggedIn') {
        this.loggedIn = e.newValue === 'true'
        this.updateUsername()
      }
    },
    // 添加一个手动刷新登录状态的方法
    refreshLoginState() {
      this.loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      this.updateUsername()
    }
  },
  watch: {
    '$route'(to, from) {
      this.updateUsername()
      // 当从登录页跳转时，强制刷新状态
      if (from.path === '/login' && to.path !== '/login') {
        this.refreshLoginState()
      }
    }
  }
}
</script>

<style>
/* 全局CSS变量定义（配色方案） */
:root {
  --primary-color: #ff7b8b;
  --secondary-color: #ffb6c1;
  --light-color: #fff5f6;
  --dark-color: #333;
}

/* 全局基础样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  background-color: #f9f9f9;
  color: var(--dark-color);
  line-height: 1.6;
}

/* 应用容器 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/bg-pattern.png');
  background-attachment: fixed;
  background-size: 400px;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.2);
  background-blend-mode: overlay;
}

/* 顶部导航栏样式 */
.app-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky; /* 粘性定位，滚动时保持在顶部 */
  top: 0;
  z-index: 100;
}

/* 导航菜单布局 */
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 导航链接基础样式 */
nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s;
  position: relative;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 当前激活路由链接的特殊样式 */
nav a.router-link-exact-active {
  background: white;
  color: var(--primary-color);
  font-weight: bold;
}

/* 激活链接下方的小圆点指示器 */
nav a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

/* 用户区域（右侧对齐） */
.user-area {
  margin-left: auto;
  display: flex;
  align-items: center;
}

/* 已登录用户菜单布局 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 用户图标链接样式 */
.user-icon-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 8px 15px !important;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-icon-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-icon-link i {
  font-size: 1.5rem;
}

/* 用户链接激活状态 */
nav a.user-icon-link.router-link-exact-active {
  background: white;
  color: var(--primary-color);
}

/* 用户名文本样式（防止过长） */
.username {
  font-size: 0.95rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

/* 退出按钮样式 */
.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 登录链接样式 */
.login-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 主要内容区域样式 */
main {
  flex: 1;
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 通用卡片样式（可复用组件） */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 通用按钮样式 */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

/* 主按钮样式 */
.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #ff5c71;
  transform: translateY(-2px);
}

/* 次要按钮样式 */
.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background: #ff9eb1;
}

/* 导航菜单布局 */
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  nav {
    gap: 10px;
    /* 改为横向滚动，不换行 */
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 0 15px 10px;
  }
  
  /* 隐藏Chrome/Safari滚动条 */
  nav::-webkit-scrollbar {
    display: none;
  }
  
  nav a {
    padding: 6px 10px;
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .user-area {
    margin-left: 10px;
    flex-shrink: 0;
  }
  
  .user-menu {
    gap: 5px;
  }
  
  .user-icon-link {
    padding: 6px 10px !important;
  }
  
  .username {
    display: none;
  }
  
  .logout-btn {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
}
</style>