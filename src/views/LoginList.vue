<template>
  <div class="login-container">
    <!-- 登录表单卡片 -->
    <div class="login-card">
      <div class="login-header">
        <h1><i class="fas fa-paw"></i> 校园喵星人</h1>
        <p>加入我们的猫咪关爱社区</p>
      </div>
      
      <!-- 登录表单 -->
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username"><i class="fas fa-user"></i> 用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> 密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            required
          >
        </div>
        
        <button type="submit" class="login-btn">
          <i class="fas fa-sign-in-alt"></i> 登录
        </button>
      </form>
      
      <p class="tip">测试账号：admin / 123456</p>
      
      <!-- 注册引导 -->
      <div class="login-footer">
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
    
    <!-- 登录页插图区域 -->
    <div class="login-illustration">
      <img src="@/assets/login-cat.png" alt="猫咪插图">
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginList',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      // 输入验证
      if (!this.username || !this.password) {
        alert('请输入用户名和密码')
        return
      }
      
      // 检查测试账号
      if (this.username === 'admin' && this.password === '123456') {
        this.handleSuccessfulLogin({
          username: 'admin',
          email: 'admin@example.com',
          gender: 'male',
          birthday: '2000-01-01'
        })
        return
      }
      
      // 从 localStorage 获取已注册用户信息
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      const userData = registeredUsers[this.username]
      
      // 验证用户名和密码
      if (userData && userData.password === this.password) {
        const userInfo = { ...userData }
        delete userInfo.password  // 移除密码字段，不存储在 userData 中
        
        // 获取保存的手机号（如果有）
        const savedPhone = localStorage.getItem(`userPhone_${this.username}`)
        if (savedPhone) {
          userInfo.phone = savedPhone
        }
        
        this.handleSuccessfulLogin(userInfo)
      } else {
        alert('用户名或密码错误！')
      }
    },
    // 登录成功处理：保存登录状态并跳转到首页
    handleSuccessfulLogin(userInfo) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userData', JSON.stringify(userInfo))
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
/* 登录容器：左右分栏布局 */
.login-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f6, #ffeef0);
}

/* 左侧登录表单卡片 */
.login-card {
  flex: 1;
  max-width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  box-shadow: 0 0 30px rgba(255, 123, 139, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  color: var(--primary-color);
  font-size: 2.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-header p {
  color: #666;
}

/* 登录表单样式 */
.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 123, 139, 0.2);
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-btn:hover {
  background: #ff5c71;
  transform: translateY(-2px);
}

.tip {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

/* 注册引导链接 */
.login-footer {
  text-align: center;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* 右侧插图区域 */
.login-illustration {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.login-illustration img {
  max-width: 100%;
  max-height: 80vh;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

/* 响应式设计 */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-card {
    max-width: 100%;
    padding: 30px 20px;
  }
  
  .login-illustration {
    display: none;  /* 移动端隐藏插图 */
  }
}
</style>