<template>
  <div class="register-container">
    <!-- 注册表单卡片 -->
    <div class="register-card">
      <div class="register-header">
        <h1><i class="fas fa-paw"></i> 校园喵星人</h1>
        <p>加入我们的猫咪关爱社区</p>
      </div>
      
      <!-- 注册表单 -->
      <form @submit.prevent="register" class="register-form">
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
          <label><i class="fas fa-venus-mars"></i> 性别</label>
          <div class="gender-options">
            <label class="gender-option">
              <input type="radio" v-model="gender" value="male" required>
              <span>男</span>
            </label>
            <label class="gender-option">
              <input type="radio" v-model="gender" value="female" required>
              <span>女</span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="birthday"><i class="fas fa-birthday-cake"></i> 生日</label>
          <input 
            id="birthday" 
            v-model="birthday" 
            type="date" 
            required
          >
        </div>
		
        <div class="form-group">
          <label for="email"><i class="fas fa-envelope"></i> 邮箱</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="请输入邮箱"
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
            minlength="6"
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword"><i class="fas fa-lock"></i> 确认密码</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            required
          >
        </div>
        
        <button type="submit" class="register-btn">
          <i class="fas fa-user-plus"></i> 注册
        </button>
      </form>
      
      <!-- 登录引导 -->
      <div class="register-footer">
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
    
    <!-- 注册页插图区域 -->
    <div class="register-illustration">
      <img src="@/assets/register-cat.png" alt="猫咪插图">
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterList',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      birthday: ''
    }
  },
  methods: {
    // 表单验证
    validateForm() {
      if (!this.username.trim()) {
        alert('请输入用户名')
        return false
      }
      if (!this.email.trim()) {
        alert('请输入邮箱')
        return false
      }
      if (this.password.length < 6) {
        alert('密码长度至少为6位')
        return false
      }
      if (this.password !== this.confirmPassword) {
        alert('两次输入的密码不一致！')
        return false
      }
      if (!this.gender) {
        alert('请选择性别')
        return false
      }
      if (!this.birthday) {
        alert('请选择生日')
        return false
      }
      return true
    },
    
    // 注册处理
    register() {
      if (!this.validateForm()) {
        return
      }
      
      // 检查用户名是否已存在
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      if (registeredUsers[this.username]) {
        alert('用户名已存在，请选择其他用户名！')
        return
      }
      
      // 创建用户数据对象
      const userData = {
        username: this.username,
        email: this.email,
        gender: this.gender,
        birthday: this.birthday,
        password: this.password
      }
      
      // 保存到localStorage
      registeredUsers[this.username] = userData
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      
      // 保存登录状态（移除密码字段）
      const userInfo = { ...userData }
      delete userInfo.password
      
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userData', JSON.stringify(userInfo))
      
      alert('注册成功！')
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
/* 注册容器：左右分栏布局 */
.register-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f6, #ffeef0);
}

/* 左侧注册表单卡片 */
.register-card {
  flex: 1;
  max-width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  box-shadow: 0 0 30px rgba(255, 123, 139, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h1 {
  color: var(--primary-color);
  font-size: 2.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.register-header p {
  color: #666;
}

/* 注册表单样式 */
.register-form {
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

/* 性别选择按钮样式 */
.gender-options {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #555;
}

.gender-option input[type="radio"] {
  width: auto;
  margin: 0;
}

/* 注册按钮 */
.register-btn {
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

.register-btn:hover {
  background: #ff5c71;
  transform: translateY(-2px);
}

/* 登录引导链接 */
.register-footer {
  text-align: center;
}

.register-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}

/* 右侧插图区域 */
.register-illustration {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.register-illustration img {
  max-width: 100%;
  max-height: 80vh;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

/* 响应式设计 */
@media (max-width: 992px) {
  .register-container {
    flex-direction: column;
  }
  
  .register-card {
    max-width: 100%;
    padding: 30px 20px;
  }
  
  .register-illustration {
    display: none;  /* 移动端隐藏插图 */
  }
}
</style>