<template>
  <div class="points-shop">
    <!-- 页面头部 -->
    <div class="shop-header">
      <h1>🎁 积分兑换商城</h1>
      <p class="subtitle">用爱心积分兑换猫咪文创好物</p>
    </div>

    <!-- 积分概览卡片 -->
    <div class="points-overview">
      <div class="points-card">
        <div class="points-icon">⭐</div>
        <div class="points-info">
          <div class="points-label">我的积分</div>
          <div class="points-value">{{ userPoints }}</div>
          <div class="points-tip">1元助养 = 1积分</div>
        </div>
      </div>
      
      <div class="points-stats">
        <div class="stat-item">
          <span class="stat-icon">☁️</span>
          <div>
            <div class="stat-label">累计助养</div>
            <div class="stat-value">¥{{ totalSponsorAmount }}</div>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🎁</span>
          <div>
            <div class="stat-label">已兑换</div>
            <div class="stat-value">{{ redeemedCount }} 件</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品分类标签 -->
    <div class="category-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.emoji }} {{ tab.label }}
      </button>
    </div>

    <!-- 商品网格 -->
    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        :class="{ 
          'can-exchange': userPoints >= product.points && product.stock > 0,
          'out-of-stock': product.stock === 0 
        }"
      >
        <!-- 商品图片 -->
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <span v-if="product.stock === 0" class="sold-out-badge">已售罄</span>
          <span v-else-if="product.isNew" class="new-badge">新品</span>
          <span v-else-if="product.isHot" class="hot-badge">🔥 热门</span>
        </div>
        
        <!-- 商品信息 -->
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          
          <div class="product-meta">
            <div class="product-points">
              <span class="points-num">{{ product.points }}</span>
              <span class="points-unit">积分</span>
            </div>
            <div class="product-stock" v-if="product.stock > 0 && product.stock <= 20">
              仅剩 {{ product.stock }} 件
            </div>
          </div>
          
          <!-- 兑换按钮 -->
          <button 
            class="exchange-btn"
            :disabled="userPoints < product.points || product.stock === 0"
            @click="openExchangeModal(product)"
          >
            {{ getButtonText(product) }}
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <p>🛍️ 该分类暂无商品</p>
    </div>

    <!-- 兑换说明 -->
    <div class="exchange-rules">
      <h2>📋 兑换规则</h2>
      <div class="rules-grid">
        <div class="rule-item">
          <span class="rule-emoji">1️⃣</span>
          <span>积分通过云助养累积，助养1元 = 1积分</span>
        </div>
        <div class="rule-item">
          <span class="rule-emoji">2️⃣</span>
          <span>积分永久有效，可累计使用</span>
        </div>
        <div class="rule-item">
          <span class="rule-emoji">3️⃣</span>
          <span>兑换后7个工作日内发货</span>
        </div>
        <div class="rule-item">
          <span class="rule-emoji">4️⃣</span>
          <span>兑换记录可在个人中心查看</span>
        </div>
        <div class="rule-item">
          <span class="rule-emoji">5️⃣</span>
          <span>所有收入用于猫咪救助与绝育</span>
        </div>
      </div>
    </div>

    <!-- 兑换确认模态框 -->
    <div v-if="showExchangeModal" class="modal" @click.self="showExchangeModal = false">
      <div class="modal-content exchange-modal">
        <h3>确认兑换</h3>
        
        <div class="exchange-product-info">
          <img :src="selectedProduct.image" :alt="selectedProduct.name">
          <div>
            <h4>{{ selectedProduct.name }}</h4>
            <p class="exchange-cost">
              消耗 <strong>{{ selectedProduct.points }}</strong> 积分
            </p>
          </div>
        </div>
        
        <!-- 收货信息 -->
        <div class="form-section">
          <h4>📦 收货信息</h4>
          <div class="form-group">
            <label>收货人</label>
            <input v-model="orderForm.receiver" placeholder="请输入收货人姓名" required>
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input v-model="orderForm.phone" placeholder="请输入手机号" required>
          </div>
          <div class="form-group full-width">
            <label>收货地址</label>
            <textarea 
              v-model="orderForm.address" 
              placeholder="请输入详细收货地址"
              rows="3"
              required
            ></textarea>
          </div>
        </div>
        
        <div class="points-summary">
          <div class="summary-row">
            <span>当前积分</span>
            <span class="current-points">{{ userPoints }}</span>
          </div>
          <div class="summary-row">
            <span>兑换消耗</span>
            <span class="cost-points">-{{ selectedProduct.points }}</span>
          </div>
          <div class="summary-row total">
            <span>兑换后剩余</span>
            <span class="remaining-points">{{ userPoints - selectedProduct.points }}</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="showExchangeModal = false" class="btn-secondary">取消</button>
          <button @click="confirmExchange" class="btn-primary">确认兑换</button>
        </div>
      </div>
    </div>

    <!-- 兑换成功提示 -->
    <div v-if="showSuccessModal" class="modal" @click.self="showSuccessModal = false">
      <div class="modal-content success-modal">
        <div class="success-icon">🎉</div>
        <h3>兑换成功！</h3>
        <p>您已成功兑换 <strong>{{ selectedProduct.name }}</strong></p>
        <p class="tip">我们会在7个工作日内发货，请留意物流信息</p>
        <div class="success-actions">
          <button class="btn-primary" @click="goToProfile">查看订单</button>
          <button class="btn-outline" @click="showSuccessModal = false">继续兑换</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PointsShop',
  data() {
    return {
      // 我的积分（从云助养总额转换）
      userPoints: 0,
      // 累计助养总额
      totalSponsorAmount: 0,
      // 已兑换件数
      redeemedCount: 0,
      
      // 当前商品分类
      activeTab: 'all',
      tabs: [
        { key: 'all', label: '全部', emoji: '🎁' },
        { key: 'stationery', label: '文具', emoji: '✏️' },
        { key: 'accessories', label: '配饰', emoji: '🧣' },
        { key: 'home', label: '家居', emoji: '🏠' },
        { key: 'limited', label: '限定', emoji: '✨' }
      ],
      
      // 商品列表
      products: [
        {
          id: 1,
          name: '猫咪主题明信片套装',
          description: '6张精美猫咪插画明信片，含校园猫咪写真',
          image: require('@/assets/products/postcard-set.jpg'),
          points: 50,
          stock: 100,
          category: 'stationery',
          isNew: false,
          isHot: true
        },
        {
          id: 2,
          name: '橘猫冰箱贴',
          description: '手工制作陶瓷冰箱贴，每只都是独一无二的',
          image: require('@/assets/products/fridge-magnet.jpg'),
          points: 80,
          stock: 50,
          category: 'home',
          isNew: true,
          isHot: false
        },
        {
          id: 3,
          name: '毛绒猫爪钥匙扣',
          description: '柔软毛绒材质，还原真实猫爪触感，多色可选',
          image: require('@/assets/products/keychain.jpg'),
          points: 60,
          stock: 80,
          category: 'accessories',
          isNew: false,
          isHot: true
        },
        {
          id: 4,
          name: '猫咪手账本',
          description: 'B6大小，内含猫咪贴纸和月份记录页',
          image: require('@/assets/products/notebook.jpg'),
          points: 120,
          stock: 35,
          category: 'stationery',
          isNew: true,
          isHot: false
        },
        {
          id: 5,
          name: '校园猫咪帆布包',
          description: '印有校园网红猫咪插画，大容量帆布袋',
          image: require('@/assets/products/canvas-bag.jpg'),
          points: 200,
          stock: 25,
          category: 'accessories',
          isNew: false,
          isHot: true
        },
        {
          id: 6,
          name: '猫咪陶瓷杯',
          description: '定制猫咪图案马克杯，容量350ml',
          image: require('@/assets/products/mug.jpg'),
          points: 150,
          stock: 40,
          category: 'home',
          isNew: false,
          isHot: false
        },
        {
          id: 7,
          name: '猫咪袜子礼盒',
          description: '3双装，猫咪印花中筒袜，均码',
          image: require('@/assets/products/socks-box.jpg'),
          points: 100,
          stock: 30,
          category: 'accessories',
          isNew: false,
          isHot: false
        },
        {
          id: 8,
          name: '限量猫咪徽章套装',
          description: '5枚装收藏徽章，限量500套，售完即止',
          image: require('@/assets/products/badge-set.jpg'),
          points: 300,
          stock: 15,
          category: 'limited',
          isNew: true,
          isHot: true
        },
        {
          id: 9,
          name: '猫咪挂历2025',
          description: '12张猫咪主题月历，含校园猫咪故事',
          image: require('@/assets/products/calendar.jpg'),
          points: 180,
          stock: 0,
          category: 'home',
          isNew: false,
          isHot: true
        },
        {
          id: 10,
          name: '猫咪贴纸包',
          description: '50张不重复猫咪贴纸，手账装饰必备',
          image: require('@/assets/products/sticker-pack.jpg'),
          points: 30,
          stock: 200,
          category: 'stationery',
          isNew: false,
          isHot: false
        },
        {
          id: 11,
          name: '猫咪围巾',
          description: '针织猫咪图案围巾，柔软保暖',
          image: require('@/assets/products/scarf.jpg'),
          points: 250,
          stock: 20,
          category: 'accessories',
          isNew: true,
          isHot: false
        },
        {
          id: 12,
          name: '猫咪抱枕',
          description: '40cm圆形猫脸抱枕，柔软亲肤面料',
          image: require('@/assets/products/pillow.jpg'),
          points: 350,
          stock: 10,
          category: 'home',
          isNew: false,
          isHot: true
        }
      ],
      
      // 模态框控制
      showExchangeModal: false,
      showSuccessModal: false,
      selectedProduct: null,
      
      // 订单表单
      orderForm: {
        receiver: '',
        phone: '',
        address: ''
      },
      
      // 已兑换订单（从localStorage加载）
      redeemedOrders: []
    }
  },
  
  computed: {
    // 根据分类过滤商品
    filteredProducts() {
      if (this.activeTab === 'all') {
        return this.products
      }
      return this.products.filter(p => p.category === this.activeTab)
    }
  },
  
  created() {
    this.loadUserPoints()
    this.loadRedeemedOrders()
  },
  
  methods: {
    // 加载用户积分（从云助养记录计算）
    loadUserPoints() {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      
      if (!username) {
        this.userPoints = 0
        this.totalSponsorAmount = 0
        return
      }
      
      const sponsors = JSON.parse(localStorage.getItem('catSponsors') || '{}')
      let totalSponsor = 0
      
      // 遍历所有猫咪的助养记录，累加当前用户的助养金额
      Object.values(sponsors).forEach(catData => {
        if (catData.users && catData.users[username]) {
          totalSponsor += catData.users[username]
        }
      })
      
      this.totalSponsorAmount = totalSponsor
      
      // 计算可用积分：总助养金额 - 已消耗积分
      const consumedPoints = JSON.parse(localStorage.getItem('consumedPoints') || '{}')
      const consumed = consumedPoints[username] || 0
      this.userPoints = Math.max(0, totalSponsor - consumed)
    },
    
    // 加载已兑换订单
    loadRedeemedOrders() {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      
      if (!username) return
      
      const orders = JSON.parse(localStorage.getItem('redeemedOrders') || '{}')
      this.redeemedOrders = orders[username] || []
      this.redeemedCount = this.redeemedOrders.length
    },
    
    // 获取兑换按钮文字
    getButtonText(product) {
      if (product.stock === 0) return '已售罄'
      if (this.userPoints < product.points) {
        const diff = product.points - this.userPoints
        return `还差 ${diff} 积分`
      }
      return '立即兑换'
    },
    
    // 打开兑换确认弹窗
    openExchangeModal(product) {
      if (this.userPoints < product.points || product.stock === 0) return
      
      this.selectedProduct = product
      this.showExchangeModal = true
      
      // 尝试自动填充收货信息
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      
      this.orderForm.receiver = userData.username || ''
      this.orderForm.phone = localStorage.getItem(`userPhone_${username}`) || userData.phone || ''
      this.orderForm.address = ''
    },
    
    // 确认兑换
    confirmExchange() {
      // 表单校验
      if (!this.orderForm.receiver.trim()) {
        alert('请输入收货人姓名')
        return
      }
      if (!this.orderForm.phone.trim() || !/^1[3-9]\d{9}$/.test(this.orderForm.phone)) {
        alert('请输入有效的手机号')
        return
      }
      if (!this.orderForm.address.trim()) {
        alert('请输入收货地址')
        return
      }
      
      const product = this.selectedProduct
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      
      if (!username) {
        alert('请先登录')
        this.$router.push('/login')
        return
      }
      
      // 扣减积分（记录已消耗积分）
      const consumedPoints = JSON.parse(localStorage.getItem('consumedPoints') || '{}')
      if (!consumedPoints[username]) {
        consumedPoints[username] = 0
      }
      consumedPoints[username] += product.points
      localStorage.setItem('consumedPoints', JSON.stringify(consumedPoints))
      
      // 扣减商品库存
      const targetProduct = this.products.find(p => p.id === product.id)
      if (targetProduct) {
        targetProduct.stock--
      }
      
      // 保存订单记录
      const orders = JSON.parse(localStorage.getItem('redeemedOrders') || '{}')
      if (!orders[username]) {
        orders[username] = []
      }
      
      const orderId = 'ORDER' + Date.now() + Math.floor(Math.random() * 1000)
      orders[username].push({
        orderId,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        points: product.points,
        receiver: this.orderForm.receiver,
        phone: this.orderForm.phone,
        address: this.orderForm.address,
        orderTime: new Date().toISOString(),
        status: 'pending',
        statusText: '待发货'
      })
      
      localStorage.setItem('redeemedOrders', JSON.stringify(orders))
      
      // 更新本地数据
      this.userPoints -= product.points
      this.loadRedeemedOrders()
      
      // 显示成功提示
      this.showExchangeModal = false
      this.showSuccessModal = true
      
      // 重置表单
      this.orderForm = {
        receiver: '',
        phone: '',
        address: ''
      }
    },
    
    // 跳转个人中心
    goToProfile() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.points-shop {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面头部 */
.shop-header {
  text-align: center;
  margin-bottom: 30px;
}

.shop-header h1 {
  color: #ff7b8b;
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  font-size: 1rem;
}

/* 积分概览卡片 */
.points-overview {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.points-card {
  flex: 1;
  background: linear-gradient(135deg, #ff7b8b, #ffb8c1);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 123, 139, 0.3);
}

.points-icon {
  font-size: 3rem;
}

.points-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.points-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.points-tip {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 4px;
}

.points-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  background: white;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-btn {
  padding: 10px 20px;
  border: 2px solid #eee;
  border-radius: 25px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.tab-btn:hover {
  border-color: #ffb8c1;
  color: #ff7b8b;
}

.tab-btn.active {
  background: #ff7b8b;
  color: white;
  border-color: #ff7b8b;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-card.can-exchange:hover {
  border-color: #ffb8c1;
}

.product-card.out-of-stock {
  opacity: 0.7;
}

/* 商品图片 */
.product-image {
  height: 200px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sold-out-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 30px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff7b8b;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.hot-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff9800;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 商品信息 */
.product-info {
  padding: 18px;
}

.product-name {
  color: #333;
  font-size: 1rem;
  margin-bottom: 6px;
  font-weight: 600;
}

.product-desc {
  color: #888;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 36px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-points {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.points-num {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff7b8b;
}

.points-unit {
  font-size: 0.9rem;
  color: #ff7b8b;
}

.product-stock {
  font-size: 0.75rem;
  color: #ff9800;
  font-weight: 500;
}

/* 兑换按钮 */
.exchange-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #ff7b8b;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.exchange-btn:hover:not(:disabled) {
  background: #ff5c71;
  transform: translateY(-2px);
}

.exchange-btn:disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1rem;
}

/* 兑换规则 */
.exchange-rules {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 40px;
}

.exchange-rules h2 {
  color: #ff7b8b;
  margin-bottom: 18px;
  font-size: 1.2rem;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #555;
}

.rule-emoji {
  font-size: 1.2rem;
}

/* 模态框通用样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  border-radius: 12px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-content h3 {
  color: #ff7b8b;
  margin-bottom: 20px;
}

/* 兑换确认弹窗 */
.exchange-modal {
  max-width: 480px;
}

.exchange-product-info {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.exchange-product-info img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.exchange-cost {
  color: #666;
  margin-top: 6px;
}

.exchange-cost strong {
  color: #ff7b8b;
  font-size: 1.1rem;
}

/* 表单 */
.form-section {
  margin-bottom: 20px;
}

.form-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group.full-width {
  width: 100%;
}

/* 积分汇总 */
.points-summary {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #666;
}

.summary-row.total {
  border-top: 1px dashed #ddd;
  padding-top: 10px;
  margin-top: 4px;
  font-weight: 600;
  color: #333;
}

.current-points {
  color: #333;
}

.cost-points {
  color: #ff4757;
}

.remaining-points {
  color: #2ed573;
  font-size: 1.1rem;
}

/* 按钮 */
.form-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #ff7b8b;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #ff5c71;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}

.btn-outline {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}

/* 成功弹窗 */
.success-modal {
  text-align: center;
  max-width: 380px;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.success-modal h3 {
  color: #2ed573;
  margin-bottom: 10px;
}

.success-modal p {
  color: #666;
  margin-bottom: 8px;
}

.success-modal .tip {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 20px;
}

.success-actions {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .points-overview {
    flex-direction: column;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
  
  .product-image {
    height: 160px;
  }
  
  .category-tabs {
    gap: 6px;
  }
  
  .tab-btn {
    padding: 8px 14px;
    font-size: 12px;
  }
  
  .rules-grid {
    grid-template-columns: 1fr;
  }
}
</style>