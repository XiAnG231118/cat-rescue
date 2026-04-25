<!-- LoginStatus.vue -->
<template>
  <div class="login-status">
    <div v-if="isLoggedIn" class="user-profile">
      <div class="avatar">
        {{ username.charAt(0) }}
      </div>
      <div class="user-info">
        <span class="welcome">欢迎回来</span>
        <span class="username">{{ username }}</span>
      </div>
      <button @click="logout" class="logout-btn" title="退出登录">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
    <router-link v-else to="/login" class="login-btn">
      <i class="fas fa-sign-in-alt"></i> 登录
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'LoginStatus',
  data() {
    return {
      username: localStorage.getItem('username') || '用户'
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('isLoggedIn') === 'true'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.login-status {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.welcome {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
}

.username {
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.logout-btn {
  background: transparent;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.login-btn {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}
</style>