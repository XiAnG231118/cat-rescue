<template>
  <div class="user-profile">
    <div class="profile-card">
      <!-- 个人资料标题 -->
      <div class="profile-header">
        <h1><i class="fas fa-user-circle"></i> 个人中心</h1>
      </div>
      
      <div class="profile-content">
        <!-- 基本信息区域 -->
        <div class="info-section">
          <h2><i class="fas fa-info-circle"></i> 基本信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">用户名：</span>
              <span class="info-value">{{ user.username || '未设置' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">性别：</span>
              <span class="info-value">{{ genderText }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生日：</span>
              <span class="info-value">{{ user.birthday || '未设置' }}</span>
            </div>
          </div>
        </div>
        
        <!-- 联系信息区域 -->
        <div class="info-section">
          <h2><i class="fas fa-envelope"></i> 联系信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">邮箱：</span>
              <span class="info-value">{{ user.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">手机号：</span>
              <span class="info-value">{{ user.phone || '未绑定' }}</span>
              <button @click="showPhoneModal = true" class="phone-btn">
                <i class="fas" :class="user.phone ? 'fa-edit' : 'fa-link'"></i>
                {{ user.phone ? '修改' : '绑定' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 收藏的猫咪区域 -->
        <div class="info-section">
          <h2><i class="fas fa-heart"></i> 我收藏的猫咪</h2>
          <div v-if="favoriteCats.length > 0" class="favorites-grid">
            <div v-for="cat in favoriteCats" :key="cat.id" class="favorite-cat-card">
              <div class="cat-image">
                <img :src="cat.images[0]" :alt="cat.name">
              </div>
              <div class="cat-info">
                <h4>{{ cat.name }}</h4>
                <p>{{ cat.personality }}</p>
                <router-link :to="`/cats/${cat.id}`" class="view-link">
                  查看详情
                </router-link>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>还没有收藏的猫咪</p>
            <router-link to="/cats" class="browse-link">去浏览猫咪</router-link>
          </div>
        </div>
        
        <!-- 申请领养的猫咪区域 -->
        <div class="info-section">
          <h2><i class="fas fa-home"></i> 我的领养申请</h2>
          <div v-if="adoptedCatsWithStatus.length > 0" class="adopted-grid">
            <div 
              v-for="item in adoptedCatsWithStatus" 
              :key="item.cat.id" 
              class="adopted-cat-card"
              :class="`status-${item.status}`"
            >
              <div class="cat-image">
                <img :src="item.cat.images[0]" :alt="item.cat.name">
                <!-- 状态角标 -->
                <span class="status-badge" :class="item.status">
                  {{ item.statusText }}
                </span>
              </div>
              <div class="cat-info">
                <h4>{{ item.cat.name }}</h4>
                
                <!-- 进度条 -->
                <div class="progress-track" v-if="item.status !== 'rejected'">
                  <div class="progress-steps">
                    <span class="step" :class="{ active: isStepActive(item, 'pending') }">📝</span>
                    <span class="step-line" :class="{ active: isStepActive(item, 'reviewing') }"></span>
                    <span class="step" :class="{ active: isStepActive(item, 'reviewing') }">🔍</span>
                    <span class="step-line" :class="{ active: isStepActive(item, 'approved') }"></span>
                    <span class="step" :class="{ active: isStepActive(item, 'approved') }">✅</span>
                    <span class="step-line" :class="{ active: isStepActive(item, 'completed') }"></span>
                    <span class="step" :class="{ active: isStepActive(item, 'completed') }">🏠</span>
                  </div>
                  <div class="step-labels">
                    <span>提交</span>
                    <span>审核</span>
                    <span>通过</span>
                    <span>完成</span>
                  </div>
                </div>
                
                <!-- 状态详情 -->
                <div class="status-detail">
                  <p class="status-message">{{ item.statusMessage }}</p>
                  <p class="apply-time">申请时间：{{ formatTime(item.applyTime) }}</p>
                  <p v-if="item.reviewComment" class="review-comment">
                    <span class="comment-label">审核反馈：</span>{{ item.reviewComment }}
                  </p>
                </div>
                
                <!-- 操作按钮区域 -->
                <div class="card-actions">
                  <router-link :to="`/cats/${item.cat.id}`" class="view-link">
                    查看猫咪
                  </router-link>
                  
                  <template v-if="canCancel(item.status)">
                    <button @click="cancelAdoption(item.cat.id)" class="cancel-btn">
                      取消申请
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>还没有领养申请记录</p>
            <router-link to="/cats" class="browse-link">去看看待领养的猫咪</router-link>
          </div>
        </div>

        <!-- 我的云助养 -->
        <div class="info-section" v-if="mySponsorships.length > 0">
          <h2><i class="fas fa-cloud"></i> 我的云助养</h2>
          <div class="sponsor-list">
            <div v-for="item in mySponsorships" :key="item.catId" class="sponsor-item">
              <img :src="item.catImage" :alt="item.catName">
              <div class="sponsor-info">
                <span class="cat-name">{{ item.catName }}</span>
                <span class="sponsor-amount">累计助养 ¥{{ item.totalAmount }}</span>
              </div>
              <router-link :to="`/cats/${item.catId}`" class="view-link">查看</router-link>
            </div>
          </div>
        </div>

        <!-- 我的兑换订单 -->
        <div class="info-section" v-if="redeemedOrders.length > 0">
          <h2><i class="fas fa-gift"></i> 我的兑换订单</h2>
          <div class="order-list">
            <div 
              v-for="order in redeemedOrders" 
              :key="order.orderId" 
              class="order-item"
              :data-status="order.status"
            >
              <img :src="order.productImage" :alt="order.productName">
              <div class="order-info">
                <span class="order-name">{{ order.productName }}</span>
                <span class="order-points">消耗 {{ order.points }} 积分</span>
                <span class="order-status">{{ order.statusText }}</span>
                <span class="order-time">{{ formatTime(order.orderTime) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 返回按钮 -->
        <div class="action-buttons">
          <button @click="goBack" class="btn back-btn">
            <i class="fas fa-arrow-left"></i> 返回
          </button>
        </div>
      </div>
    </div>
    
    <!-- 手机号绑定/修改模态框 -->
    <div v-if="showPhoneModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ user.phone ? '修改手机号' : '绑定手机号' }}</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label for="phone"><i class="fas fa-phone"></i> 手机号</label>
            <input 
              id="phone" 
              v-model="phoneInput" 
              type="tel" 
              placeholder="请输入手机号"
              maxlength="11"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn modal-cancel-btn">取消</button>
          <button @click="bindPhone" class="btn modal-confirm-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catList } from '@/data/cats'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {},
      showPhoneModal: false,
      phoneInput: '',
      favoriteCats: [],
      adoptedCatsWithStatus: [],
      mySponsorships: [],
      showFollowUpModal: false,
      currentFollowUpCatId: null,
      followUpForm: {
        description: '',
        images: []
      },
      redeemedOrders: []
    }
  },
  computed: {
    genderText() {
      const genderMap = {
        male: '男',
        female: '女'
      }
      return genderMap[this.user.gender] || '未设置'
    }
  },
  created() {
    this.loadUserData()
    this.loadUserCats()
    this.loadSponsorships()
    this.loadRedeemedOrders()
  },
  methods: {
    // 加载用户信息（含手机号）
    loadUserData() {
      const userData = localStorage.getItem('userData')
      if (userData) {
        this.user = JSON.parse(userData)
        
        if (this.user.username) {
          const savedPhone = localStorage.getItem(`userPhone_${this.user.username}`)
          if (savedPhone) {
            this.user.phone = savedPhone
            this.phoneInput = savedPhone
          }
        }
      }
    },
    
    loadUserCats() {
      // 加载收藏的猫咪
      const favorites = JSON.parse(localStorage.getItem('favoriteCats') || '[]')
      this.favoriteCats = catList.filter(cat => favorites.includes(cat.id))
      
      // 加载领养申请（增强版）
      const adoptions = JSON.parse(localStorage.getItem('adoptedCats') || '{}')
      const username = this.user.username
      
      if (username && adoptions[username]) {
        this.adoptedCatsWithStatus = Object.entries(adoptions[username]).map(([catId, detail]) => {
          // 查找猫咪信息，找不到时构造默认对象
          const cat = catList.find(c => c.id === Number(catId)) || {
            id: catId,
            name: detail.catName || '未知猫咪',
            images: [detail.catImage || '']
          }
          // 状态码转中文
          const status = detail.status || 'pending'
          const statusMap = {
            pending: '待审核',
            reviewing: '审核中',
            approved: '已通过',
            rejected: '未通过',
            completed: '已完成'
          }
          // 各状态对应的提示信息
          const messageMap = {
            pending: '您的申请已提交，请耐心等待审核',
            reviewing: `正在审核中${detail.reviewer ? '，审核人：' + detail.reviewer : ''}`,
            approved: `恭喜！申请已通过！${detail.reviewComment || ''}`,
            rejected: `很遗憾，申请未通过。${detail.reviewComment ? '原因：' + detail.reviewComment : '暂不符合领养条件'}`,
            completed: '领养已完成，请记得定期反馈猫咪近况'
          }
          
          return {
            cat,
            ...detail,
            status,
            statusText: statusMap[status] || '待审核',
            statusMessage: messageMap[status] || ''
          }
        })
      } else {
        this.adoptedCatsWithStatus = []
      }
    },
    // 加载云助养记录
    loadSponsorships() {
      const username = this.user.username
      if (!username) return
      
      const sponsors = JSON.parse(localStorage.getItem('catSponsors') || '{}')
      this.mySponsorships = Object.entries(sponsors)
        .filter(([, data]) => data.users && data.users[username])
        .map(([catId, data]) => {
          const cat = catList.find(c => c.id === Number(catId))
          return {
            catId: Number(catId),
            catName: cat?.name || '未知猫咪',
            catImage: cat?.images?.[0] || '',
            totalAmount: data.users[username]
          }
        })
    },
    
    // 进度条状态判断
    isStepActive(item, step) {
      const order = ['pending', 'reviewing', 'approved', 'completed']
      const currentIndex = order.indexOf(item.status)
      const stepIndex = order.indexOf(step)
      return stepIndex <= currentIndex && currentIndex !== -1
    },

    // 是否可取消申请（仅待审核/审核中可取消）
    canCancel(status) {
      return ['pending', 'reviewing'].includes(status)
    },
    
    formatTime(isoString) {
      if (!isoString) return ''
      const date = new Date(isoString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    // 取消领养申请
    cancelAdoption(catId) {
      if (!confirm('确定要取消该领养申请吗？')) {
        return
      }
      
      const username = this.user.username
      if (!username) return
      
      const adoptions = JSON.parse(localStorage.getItem('adoptedCats') || '{}')
      
      if (adoptions[username] && adoptions[username][catId]) {
        delete adoptions[username][catId]
        
        if (Object.keys(adoptions[username]).length === 0) {
          delete adoptions[username]
        }
        
        localStorage.setItem('adoptedCats', JSON.stringify(adoptions))
        this.loadUserCats()
        
        alert('已取消领养申请')
      }
    },
    
    closeModal() {
      this.showPhoneModal = false
      this.phoneInput = this.user.phone || ''
    },
    
    bindPhone() {
      if (!this.phoneInput) {
        alert('请输入手机号')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phoneInput)) {
        alert('请输入有效的手机号')
        return
      }
      
      this.user.phone = this.phoneInput
      
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      userData.phone = this.phoneInput
      localStorage.setItem('userData', JSON.stringify(userData))
      
      if (userData.username) {
        localStorage.setItem(`userPhone_${userData.username}`, this.phoneInput)
      }
      
      this.showPhoneModal = false
      alert(this.user.phone ? '手机号修改成功！' : '手机号绑定成功！')
    },

    // 加载兑换订单
    loadRedeemedOrders() {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      if (!username) {
        this.redeemedOrders = []
        return
      }
      const orders = JSON.parse(localStorage.getItem('redeemedOrders') || '{}')
      this.redeemedOrders = (orders[username] || []).reverse() // 最新订单在前
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.user-profile {
  min-height: calc(100vh - 120px);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 主卡片-白色圆角阴影容器 */
.profile-card {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 个人头部区域 */
.profile-header {
  background: linear-gradient(135deg, #ff7b8b, #ffb8c1);
  color: white;
  padding: 25px;
  text-align: center;
}

.profile-header h1 {
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* 主体内容区域 */
.profile-content {
  padding: 25px;
}

/* 信息区块 */
.info-section {
  margin-bottom: 30px;
}

.info-section h2 {
  color: #ff7b8b;
  margin-bottom: 15px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-grid {
  display: grid;
  gap: 15px;
}

/* 信息条目-左侧粉色强调边框 */
.info-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #ffb8c1;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-value {
  flex: 1;
  color: #333;
}

/* 猫咪卡片网格布局 */
.favorites-grid,
.adopted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 10px;
}

/* 猫咪卡片-统一悬浮效果 */
.favorite-cat-card,
.adopted-cat-card {
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.favorite-cat-card:hover,
.adopted-cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 猫咪图片容器 */
.cat-image {
  height: 140px;
  overflow: hidden;
  position: relative;
}

.cat-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.favorite-cat-card:hover .cat-image img,
.adopted-cat-card:hover .cat-image img {
  transform: scale(1.05);
}

/* 审核状态角标 */
.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  z-index: 2;
}

/* 五种审核状态颜色 */
.status-badge.pending { background: #ffa502; }   /* 橙色-待审核 */
.status-badge.reviewing { background: #1e90ff; } /* 蓝色-审核中 */
.status-badge.approved { background: #2ed573; }  /* 绿色-已通过 */
.status-badge.rejected { background: #ff4757; }  /* 红色-未通过 */
.status-badge.completed { background: #747d8c; } /* 灰色-已完成 */

/* 猫咪文字信息 */
.cat-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.cat-info h4 {
  color: #ff7b8b;
  margin-bottom: 5px;
  font-size: 1rem;
}

.cat-info p {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

/* 审核进度条 */
.progress-track {
  margin: 10px 0;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 进度步骤圆点 */
.step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  z-index: 2;
}

.step.active {
  background: #ff7b8b; /* 已完成步骤-粉色 */
}

/* 步骤间连接线 */
.step-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 -2px;
}

.step-line.active {
  background: #ff7b8b;
}

/* 进度条底部标签 */
.step-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #888;
  margin-top: 4px;
}

/* 状态详情文字 */
.status-detail {
  margin: 8px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.status-message {
  font-size: 12px;
  color: #333;
  margin-bottom: 4px;
}

.apply-time {
  font-size: 11px;
  color: #888;
}

/* 审核评语-虚线分隔 */
.review-comment {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #ddd;
}

.comment-label {
  color: #ff7b8b;
}

/* 卡片按钮组 */
.card-actions {
  display: flex;
  flex-wrap: wrap; /* 按钮过多时换行 */
  gap: 8px;
  margin-top: 10px;
}

.view-link {
  color: #ff7b8b;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  background: #fff5f6; /* 浅粉背景 */
  border-radius: 4px;
  transition: all 0.2s;
}

.view-link:hover {
  background: #ffe0e3; /* 悬浮加深 */
}

.cancel-btn {
  padding: 5px 10px;
  background: #ff4757; /* 红色-危险操作 */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #ff3838;
}

/* 空状态提示 */
.empty-state {
  padding: 30px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  color: #888;
}

.browse-link {
  display: inline-block;
  margin-top: 10px;
  color: #ff7b8b;
  text-decoration: none;
  font-weight: 500;
}

/* 云助养列表 */
.sponsor-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sponsor-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.sponsor-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.sponsor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cat-name {
  font-weight: 500;
  color: #333;
}

.sponsor-amount {
  font-size: 13px;
  color: #ff7b8b; /* 金额用主题色突出 */
}

/* 兑换订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 16px;
  background: #f9f9f9;
  border-radius: 10px;
  border-left: 4px solid #ffb8c1;
  transition: all 0.3s;
}

.order-item:hover {
  background: #f0f0f0;
  transform: translateX(3px);
}

.order-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.order-points {
  color: #ff7b8b;
  font-size: 0.85rem;
  font-weight: 500;
}

.order-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

/* 订单状态颜色（根据实际存储的status值匹配） */
.order-status:has(+ .order-time) {
  /* 默认样式：待发货-橙色 */
  background: #fff3e0;
  color: #ff9800;
}

/* 可通过动态类名更精确控制，如果需要区分状态，建议改为： */
.order-item[data-status="pending"] .order-status {
  background: #fff3e0;
  color: #ff9800;
}

.order-item[data-status="shipped"] .order-status {
  background: #e3f2fd;
  color: #2196f3;
}

.order-item[data-status="delivered"] .order-status {
  background: #e8f5e9;
  color: #4caf50;
}

.order-item[data-status="cancelled"] .order-status {
  background: #fce4ec;
  color: #f44336;
}

.order-time {
  font-size: 0.75rem;
  color: #999;
}

/* 手机号绑定按钮 */
.phone-btn {
  padding: 6px 15px;
  border-radius: 4px;
  border: none;
  background: #ffb8c1;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
}

.phone-btn:hover {
  background: #ff9eb1;
}

/* 返回按钮区域 */
.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.btn {
  padding: 10px 25px;
  border-radius: 25px; /* 胶囊按钮 */
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.back-btn {
  background: #ffb8c1;
  color: white;
}

.back-btn:hover {
  background: #ff9eb1;
}

/* 模态框通用样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-grid,
  .adopted-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .profile-card {
    max-width: 100%;
  }
  
  .order-item {
    padding: 12px;
    gap: 10px;
  }
    
  .order-item img {
    width: 50px;
    height: 50px;
  }
    
  .order-name {
    font-size: 0.9rem;
  }
}
</style>