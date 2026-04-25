<template>
  <div class="cat-detail">
    <!-- 返回按钮 -->
    <router-link to="/cats" class="back-btn">
      &lt; 返回猫咪列表
    </router-link>

    <!-- 猫咪头部信息 -->
    <div class="cat-header">
      <h1>{{ cat.name }}</h1>
      <div class="meta">
        <span class="gender" :class="cat.gender">{{ cat.gender }}</span>
        <span class="personality">{{ cat.personality }}</span>
      </div>
    </div>

    <!-- 图片展示区域 -->
    <div class="gallery">
      <div class="main-image">
        <img :src="currentImage" :alt="cat.name">
      </div>
      <div class="thumbnails">
        <img 
          v-for="(img, index) in cat.images" 
          :key="index"
          :src="img"
          @click="currentIndex = index"
          :class="{ active: currentIndex === index }"
        >
      </div>
    </div>

    <!-- 详细信息区块 -->
    <div class="info-sections">
      <!-- 基本信息 -->
      <section class="basic-info">
        <h2>基本信息</h2>
        <div class="basic-info-grid">
          <div class="basic-info-item">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">年龄</div>
              <div class="info-value">{{ cat.age }}</div>
            </div>
          </div>
          <div class="basic-info-item">
            <div class="info-icon">⚖️</div>
            <div class="info-content">
              <div class="info-label">体重</div>
              <div class="info-value">{{ cat.weight }}</div>
            </div>
          </div>
          <div class="basic-info-item">
            <div class="info-icon">🎨</div>
            <div class="info-content">
              <div class="info-label">毛色</div>
              <div class="info-value">{{ cat.color }}</div>
            </div>
          </div>
          <div class="basic-info-item">
            <div class="info-icon">😺</div>
            <div class="info-content">
              <div class="info-label">性格</div>
              <div class="info-value">{{ cat.personality }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 健康档案 -->
      <section class="health">
        <h2>健康档案</h2>
        <ul>
          <li v-for="(value, key) in cat.healthRecords" :key="key">
            <strong>{{ key }}：</strong> {{ value }}
          </li>
        </ul>
      </section>

      <!-- 猫咪故事 -->
      <section class="story">
        <h2>猫咪故事</h2>
        <p>{{ cat.story }}</p>
      </section>

      <!-- 生活习惯 -->
      <section class="habits">
        <h2>生活习惯</h2>
        <div class="habits-grid">
          <div v-for="(habit, index) in cat.habits" :key="index" class="habit-item">
            <span class="emoji">{{ habit.emoji }}</span>
            <span>{{ habit.text }}</span>
          </div>
        </div>
      </section>
  
      <!-- 社区故事 -->
      <section v-if="relatedStories.length" class="community-stories">
        <h2>📖 社区故事</h2>
        <div class="story-list">
          <div v-for="story in relatedStories" :key="story.id" class="story-item">
            <div class="story-user">👤 {{ story.username }}</div>
            <p class="story-text">{{ story.content }}</p>
            <div class="story-footer">
              <span class="story-time">{{ story.time }}</span>
              <span class="story-tag">{{ story.tag }}</span>
              <span class="story-likes">❤️ {{ story.likes }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 交互按钮区域 -->
    <div class="interaction">
      <button class="adopt-btn" @click="showAdoptNotice = true">
        🏠 正式领养 {{ cat.name }}
      </button>
      
      <button class="sponsor-btn" @click="showSponsorModal = true">
        ☁️ 云助养 {{ cat.name }}
      </button>
      
      <button @click="toggleFavorite" class="favorite-btn">
        {{ isFavorite ? '❤️ 已收藏' : '♡ 收藏猫咪' }}
      </button>
    </div>

    <!-- 领养须知模态框 -->
    <div v-if="showAdoptNotice" class="modal" @click.self="showAdoptNotice = false">
      <div class="modal-content notice-modal">
        <div class="notice-header">
          <span class="icon">📋</span>
          <h3>领养须知</h3>
        </div>
        <div class="notice-body">
          <div class="notice-item">
            <span class="emoji">✅</span>
            <span>领养前需获得房东/家人的同意</span>
          </div>
          <div class="notice-item">
            <span class="emoji">✅</span>
            <span>接受定期视频回访（领养后1个月、3个月）</span>
          </div>
          <div class="notice-item">
            <span class="emoji">✅</span>
            <span>科学喂养，适龄绝育，有病就医</span>
          </div>
          <div class="notice-item">
            <span class="emoji">⚠️</span>
            <span class="warning">校园流浪猫优先考虑"云助养"模式</span>
          </div>
        </div>
        <div class="notice-actions">
          <button class="btn-outline" @click="showAdoptNotice = false">我再想想</button>
          <button class="btn-primary" @click="proceedToForm">我已了解，继续申请</button>
        </div>
      </div>
    </div>

    <!-- 领养申请表单模态框 -->
    <div v-if="showAdoptForm" class="modal" @click.self="showAdoptForm = false">
      <div class="modal-content modal-large">
        <h3>申请领养 {{ cat.name }}</h3>
        
        <!-- 猫咪匹配度提示 -->
        <div v-if="cat.personality" class="match-tip" :class="matchLevel">
          <span class="tip-icon">{{ matchIcon }}</span>
          <span class="tip-text">{{ matchMessage }}</span>
        </div>

        <form @submit.prevent="submitAdoptForm" class="adopt-form">
          <!-- 申请人基本信息 -->
          <div class="form-section">
            <h4><i class="icon-user">👤</i> 基本信息</h4>
            <div class="form-row">
              <div class="form-group">
                <label>姓名</label>
                <input v-model="adoptForm.name" placeholder="真实姓名" required>
              </div>
              <div class="form-group">
                <label>年龄</label>
                <input v-model.number="adoptForm.age" type="number" min="18" placeholder="需满18岁" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>联系方式</label>
                <input v-model="adoptForm.contact" placeholder="手机号/微信号" required>
              </div>
              <div class="form-group">
                <label>职业</label>
                <select v-model="adoptForm.occupation" required>
                  <option value="">请选择</option>
                  <option value="学生">学生</option>
                  <option value="上班族">上班族</option>
                  <option value="自由职业">自由职业</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 居住环境评估 -->
          <div class="form-section">
            <h4><i class="icon-home">🏠</i> 居住环境</h4>
            <div class="form-row">
              <div class="form-group">
                <label>居住类型</label>
                <select v-model="adoptForm.housingType" required>
                  <option value="">请选择</option>
                  <option value="自有住房">自有住房</option>
                  <option value="整租">整租</option>
                  <option value="合租">合租</option>
                  <option value="宿舍">宿舍（建议改为云助养）</option>
                </select>
              </div>
              <div class="form-group">
                <label>封窗情况</label>
                <select v-model="adoptForm.windowSealed" required>
                  <option value="">请选择</option>
                  <option value="已封窗">已封窗/有纱窗</option>
                  <option value="准备封窗">准备封窗</option>
                  <option value="未封窗">未封窗</option>
                </select>
              </div>
            </div>
            <div class="form-group full-width">
              <label>详细地址</label>
              <input v-model="adoptForm.address" placeholder="用于后续家访/回访" required>
            </div>
          </div>

          <!-- 养猫经验与意愿 -->
          <div class="form-section">
            <h4><i class="icon-cat">🐱</i> 养猫经验</h4>
            <div class="radio-group-vertical">
              <label class="radio-label">
                <input type="radio" v-model="adoptForm.experience" value="有经验" required>
                <span class="radio-text">
                  <strong>有养猫经验</strong>
                  <small>养过 {{ adoptForm.catCount || 0 }} 只猫，最久养了 {{ adoptForm.longestPeriod || 0 }} 年</small>
                </span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="adoptForm.experience" value="新手" required>
                <span class="radio-text">
                  <strong>新手</strong>
                  <small>已学习养猫知识，愿意接受指导</small>
                </span>
              </label>
            </div>
            
            <!-- 联动显示：有经验时展开详细字段 -->
            <div v-if="adoptForm.experience === '有经验'" class="experience-detail">
              <div class="form-row">
                <div class="form-group">
                  <label>养过几只猫</label>
                  <input v-model.number="adoptForm.catCount" type="number" min="0">
                </div>
                <div class="form-group">
                  <label>最长饲养时长(年)</label>
                  <input v-model.number="adoptForm.longestPeriod" type="number" min="0" step="0.5">
                </div>
              </div>
            </div>

            <div class="form-group full-width">
              <label>领养理由 <span class="required">*</span></label>
              <textarea 
                v-model="adoptForm.reason" 
                :placeholder="`请详细说明为什么想领养${cat.name}，你对它的了解程度等`"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="showAdoptForm = false" class="btn-secondary">取消</button>
            <button type="submit" class="btn-primary">提交申请</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 提交成功提示 -->
    <div v-if="showSuccessModal" class="modal" @click.self="showSuccessModal = false">
      <div class="modal-content success-modal">
        <div class="success-icon">✅</div>
        <h3>申请已提交！</h3>
        <p>您的领养申请已成功提交，我们会在3个工作日内进行审核。</p>
        <p class="tip">请前往「个人中心」查看申请进度。</p>
        <button class="btn-primary" @click="goToProfile">查看申请进度</button>
        <button class="btn-outline" @click="showSuccessModal = false">继续浏览</button>
      </div>
    </div>

    <!-- 云助养模态框 -->
    <div v-if="showSponsorModal" class="modal" @click.self="showSponsorModal = false">
      <div class="modal-content sponsor-modal">
        <h3>☁️ 云助养 {{ cat.name }}</h3>
        
        <div class="cat-summary">
          <img :src="cat.images?.[0]" :alt="cat.name">
          <div>
            <p><strong>{{ cat.name }}</strong> · {{ cat.personality }}</p>
            <p>每月伙食/医疗预算：¥{{ cat.monthlyBudget || 200 }}</p>
          </div>
        </div>
        
        <div class="sponsor-options">
          <h4>选择助养金额</h4>
          <div class="amount-grid">
            <div 
              v-for="amount in [1, 5, 10, 50, 100]" 
              :key="amount"
              class="amount-item"
              :class="{ active: sponsorAmount === amount }"
              @click="sponsorAmount = amount"
            >
              ¥{{ amount }}
            </div>
            <div class="amount-item custom">
              <input 
                v-model.number="sponsorAmount" 
                type="number" 
                min="1"
                placeholder="自定义"
              >
            </div>
          </div>
        </div>
        
        <div class="sponsor-info">
          <p>💰 目前已有 {{ sponsorCount }} 人助养，本月已筹 ¥{{ currentAmount }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="showSponsorModal = false" class="btn-secondary">取消</button>
          <button @click="submitSponsor" class="btn-primary">确认助养</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catList } from '@/data/cats'

export default {
  name: 'CatDetail',
  props: ['id'], // 从路由参数接收猫咪ID
  data() {
    return {
      // 图片展示状态
      currentIndex: 0,
      
      // 模态框显示控制
      showAdoptNotice: false,
      showAdoptForm: false,
      showSuccessModal: false,
      showSponsorModal: false,
      
      // 收藏与助养状态
      isFavorite: false,
      sponsorAmount: 5,
      sponsorCount: 0,
      currentAmount: 0,
      
      // 领养表单数据（双向绑定）
      adoptForm: {
        name: '',
        age: '',
        contact: '',
        occupation: '',
        housingType: '',
        windowSealed: '',
        address: '',
        experience: '', 
        catCount: 0, 
        longestPeriod: 0,
        reason: ''
      },
      
      // 社区关联故事
      relatedStories: [] // 从localStorage加载的社区故事
    }
  },
  
  computed: {
    cat() {
      const foundCat = catList.find(cat => cat.id === Number(this.id))
      return foundCat || {
        id: Number(this.id),
        name: '未知猫咪',
        age: '未知',
        weight: '未知',
        color: '未知',
        personality: '未知',
        habits: [],
        healthRecords: {},
        monthlyBudget: 200,
        images: []  // 确保有images字段
      }
    },
    
    // 当前展示的大图
    currentImage() {
      const images = this.cat.images || []
      return images[this.currentIndex] || ''
    },
    
    // 猫咪性格与领养人匹配度：good(匹配) / caution(需谨慎) / info(普通)
    matchLevel() {
      if (!this.cat.personality) return 'info'
      const friendlyKeywords = ['亲人', '温顺', '黏人', '活泼']
      const cautiousKeywords = ['警惕', '怕生', '独立', '高冷']
      
      if (friendlyKeywords.some(k => this.cat.personality.includes(k))) {
        return 'good'
      } else if (cautiousKeywords.some(k => this.cat.personality.includes(k))) {
        return 'caution'
      }
      return 'info'
    },
    
    // 匹配度对应图标
    matchIcon() {
      const map = { good: '✅', caution: '⚠️', info: 'ℹ️' }
      return map[this.matchLevel] || 'ℹ️'
    },
    
    // 匹配度提示文字（包含猫咪名字和性格）
    matchMessage() {
      if (this.matchLevel === 'good') {
        return `${this.cat.name}性格${this.cat.personality}，适合与领养人快速建立信任`
      } else if (this.matchLevel === 'caution') {
        return `${this.cat.name}性格${this.cat.personality}，建议有经验的领养人，需要更多耐心`
      }
      return '请仔细阅读猫咪档案，确保自己适合领养它'
    },
    
    // 云助养进度百分比（上限100%）
    progressPercent() {
      return Math.min((this.currentAmount / (this.cat.monthlyBudget || 200)) * 100, 100)
    }
  },
  
  methods: {
    // 从localStorage读取收藏状态
    checkFavorite() {
      const favorites = JSON.parse(localStorage.getItem('favoriteCats') || '[]')
      this.isFavorite = favorites.includes(this.cat.id)
    },
    
    // 从localStorage加载该猫咪的助养数据（总金额、人数）
    loadSponsorInfo() {
      const sponsors = JSON.parse(localStorage.getItem('catSponsors') || '{}')
      if (sponsors[this.cat.id]) {
        this.currentAmount = sponsors[this.cat.id].total || 0
        this.sponsorCount = Object.keys(sponsors[this.cat.id].users || {}).length
      } else {
        this.currentAmount = 0
        this.sponsorCount = 0
      }
    },
    
    // 确认领养须知后，切换到申请表单
    proceedToForm() {
      this.showAdoptNotice = false
      this.showAdoptForm = true
    },
    
    // 重置领养表单为初始状态
    resetAdoptForm() {
      this.adoptForm = {
        name: '',
        age: '',
        contact: '',
        occupation: '',
        housingType: '',
        windowSealed: '',
        address: '',
        experience: '',
        catCount: 0,
        longestPeriod: 0,
        reason: ''
      }
    },
    
    // 切换收藏状态，同步更新localStorage
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      const message = this.isFavorite ? '已添加收藏' : '已取消收藏'
      
      const favorites = JSON.parse(localStorage.getItem('favoriteCats') || '[]')
      if (this.isFavorite) {
        if (!favorites.includes(this.cat.id)) {
          favorites.push(this.cat.id)
        }
      } else {
        const index = favorites.indexOf(this.cat.id)
        if (index > -1) {
          favorites.splice(index, 1) // 取消收藏时移除
        }
      }
      localStorage.setItem('favoriteCats', JSON.stringify(favorites))
      
      alert(`${this.cat.name} ${message}`)
    },
    
    // 提交领养申请（含校验）
    submitAdoptForm() {
      // 年龄校验
      if (this.adoptForm.age < 18) {
        alert('领养人需年满18周岁')
        return
      }
      // 安全校验：未封窗二次确认
      if (this.adoptForm.windowSealed === '未封窗') {
        const confirm = window.confirm('未封窗对猫咪有安全隐患，确定要继续申请吗？')
        if (!confirm) return
      }
      // 环境校验：宿舍二次确认
      if (this.adoptForm.housingType === '宿舍') {
        const confirm = window.confirm('宿舍环境不太适合养猫，建议考虑「云助养」模式。是否仍要提交申请？')
        if (!confirm) return
      }
      
      // 登录校验
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      if (!username) {
        alert('请先登录')
        this.$router.push('/login')
        return
      }
      
      // 重复申请校验
      const adoptions = JSON.parse(localStorage.getItem('adoptedCats') || '{}')
      if (!adoptions[username]) adoptions[username] = {}
      
      if (adoptions[username][this.cat.id] && 
          adoptions[username][this.cat.id].status !== 'rejected') {
        alert('您已提交过该猫咪的领养申请，请勿重复提交')
        return
      }
      
      // 保存申请记录到localStorage
      adoptions[username][this.cat.id] = {
        catId: this.cat.id,
        catName: this.cat.name,
        catImage: this.cat.images?.[0] || '',
        status: 'pending',        // 审核状态：pending/rejected/approved
        statusText: '审核中',
        applyTime: new Date().toISOString(),
        formData: { ...this.adoptForm },
        reviewComment: '',
        reviewTime: null,
        reviewer: '',
        followUpRecords: []
      }
      
      localStorage.setItem('adoptedCats', JSON.stringify(adoptions))
      
      // 关闭表单，显示成功提示
      this.showAdoptForm = false
      this.showSuccessModal = true
      this.resetAdoptForm()
    },
    
    // 提交云助养
    submitSponsor() {
      // 登录校验
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const username = userData.username
      if (!username) {
        alert('请先登录')
        this.$router.push('/login')
        return
      }
      
      alert(`感谢您为 ${this.cat.name} 助养 ¥${this.sponsorAmount}！\n（此处可跳转支付页面）`)
      
      // 更新助养记录到localStorage
      const sponsors = JSON.parse(localStorage.getItem('catSponsors') || '{}')
      if (!sponsors[this.cat.id]) {
        sponsors[this.cat.id] = { total: 0, users: {} }
      }
      sponsors[this.cat.id].total += this.sponsorAmount
      if (!sponsors[this.cat.id].users[username]) {
        sponsors[this.cat.id].users[username] = 0
      }
      sponsors[this.cat.id].users[username] += this.sponsorAmount
      localStorage.setItem('catSponsors', JSON.stringify(sponsors))
      
      // 刷新页面显示的最新助养数据
      this.currentAmount = sponsors[this.cat.id].total
      this.sponsorCount = Object.keys(sponsors[this.cat.id].users).length
      
      this.showSponsorModal = false
    },
    
    // 跳转到个人中心查看申请进度
    goToProfile() {
      this.$router.push('/profile')
    },
    
    // 从localStorage加载该猫咪关联的社区故事
    loadRelatedStories() {
      const catStories = JSON.parse(localStorage.getItem('catStories') || '{}')
      this.relatedStories = catStories[this.cat.id] || []
    }
  },
  
  // 监听路由参数变化，切换猫咪时重新加载数据
  watch: {
    id: {
      immediate: true, // 首次绑定时立即执行
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.currentIndex = 0       // 重置为第一张图片
          this.checkFavorite()        // 刷新收藏状态
          this.loadSponsorInfo()      // 刷新助养数据
          this.loadRelatedStories()   // 刷新社区故事
        }
      }
    }
  },
  
  mounted() {
    window.scrollTo(0, 0)  // 页面加载时滚到顶部
  },

}
</script>

<style scoped>
/* 交互按钮区域 */
.interaction {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap; 
}
.interaction button {
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 180px;
}
.adopt-btn {
  background: #ff7b8b;
  color: white;
}
.adopt-btn:hover {
  background: #ff5c71;
}
.sponsor-btn {
  background: #7b93ff;
  color: white;
}
.sponsor-btn:hover {
  background: #5c7cff;
}
.favorite-btn {
  background: #f0f0f0;
}
.favorite-btn:hover {
  background: #e0e0e0;
}

/* 领养须知模态框 */
.notice-modal {
  max-width: 450px; 
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee; 
}

.notice-header .icon {
  font-size: 28px; 
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
}

.notice-item .warning {
  color: #ff4757;
}

.notice-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

/* 通用按钮样式 */
.btn-outline {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-primary {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #ff7b8b;
  color: white;
  cursor: pointer;
}

/* 领养表单模态框 */
.modal-large {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.adopt-form {
  margin-top: 15px;
}

.form-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.form-group {
  flex: 1;
}

.form-group.full-width {
  width: 100%;
  margin-top: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.required {
  color: #ff4757; /* 必填标记红色 */
}

/* 单选框组-垂直排列 */
.radio-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.radio-text {
  display: flex;
  flex-direction: column;
}

.radio-text strong {
  font-size: 14px;
}

.radio-text small {
  font-size: 12px;
  color: #888;
  margin-top: 3px;
}

/* 养猫经验详情-条件展示区域 */
.experience-detail {
  margin-top: 15px;
  padding-top: 10px;
}

/* 猫咪匹配度提示 */
.match-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.match-tip.good {
  background: #e8f5e9;
  border-left: 4px solid #4caf50; /* 绿色-匹配度高 */
}

.match-tip.caution {
  background: #fff3e0;
  border-left: 4px solid #ff9800; /* 橙色-需谨慎 */
}

.match-tip.info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3; /* 蓝色-普通提示 */
}

.tip-icon {
  font-size: 20px;
}

.tip-text {
  font-size: 13px;
  color: #333;
}

/* 提交成功提示模态框 */
.success-modal {
  text-align: center;
  max-width: 350px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.success-modal h3 {
  color: #4caf50;
  margin-bottom: 10px;
}

.success-modal p {
  color: #666;
  margin-bottom: 8px;
}

.success-modal .tip {
  font-size: 13px;
  color: #888;
  margin-bottom: 20px;
}

.success-modal .btn-primary,
.success-modal .btn-outline {
  width: 100%;
  margin-bottom: 8px;
}

/* 云助养模态框 */
.sponsor-modal {
  max-width: 400px;
}

/* 猫咪摘要卡片 */
.cat-summary {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin: 15px 0;
}

.cat-summary img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

/* 助养金额选项网格 */
.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.amount-item {
  padding: 12px;
  text-align: center;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-item:hover {
  border-color: #ff7b8b;
}

.amount-item.active {
  border-color: #ff7b8b;
  background: #fff5f6;
}

 /* 自定义金额独占一行 */
.amount-item.custom {
  grid-column: span 3;
}

.amount-item.custom input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

/* 助养进度信息 */
.sponsor-info {
  margin: 15px 0;
}

.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff7b8b, #ffb8c1);
  border-radius: 4px;
  transition: width 0.3s; /* 进度变化动画 */
}

/* 次要按钮 */
.btn-secondary {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: black;
  cursor: pointer;
}

/* 页面整体布局 */
.cat-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

/* 返回链接 */
.back-btn {
  display: inline-block;
  margin-bottom: 20px;
  color: #ff7b8b;
  text-decoration: none;
  font-weight: bold;
}

/* 猫咪头部信息 */
.cat-header {
  margin-bottom: 30px;
}
.cat-header h1 {
  color: #333;
  margin-bottom: 5px;
}
.meta {
  display: flex;
  gap: 15px;
}
.gender {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 14px;
}
.gender.公 {
  background: #a0c4ff; /* 公猫-蓝色标签 */
}
.gender.母 {
  background: #ffc6ff; /* 母猫-粉色标签 */
}
.personality {
  color: #666;
}

/* 图片展示区域 */
.gallery {
  margin-bottom: 40px;
}
.main-image {
  width: 100%;
  height: 400px;
  margin-bottom: 15px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}
.thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
}
.thumbnails img:hover,
.thumbnails img.active {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* 详细信息区块（两列网格布局 */
.info-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}
section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h2 {
  color: #ff7b8b;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 15px;
}

/* 基本信息-2×2网格 */
.basic-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.basic-info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s;
}
.basic-info-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}
.info-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
}
.info-content {
  flex: 1;
}
.info-label {
  color: #888;
  font-size: 12px;
  margin-bottom: 4px;
}
.info-value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

/* 健康档案列表 */
.health ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.health li {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
}
.health li:last-child {
  border-bottom: none;
}
.health li strong {
  color: #555;
  min-width: 80px;
}

/* 猫咪故事文本 */
.story p {
  line-height: 1.6;
  color: #555;
  text-align: justify;
}

/* 生活习惯-2列网格 */
.habits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.habit-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.habit-item .emoji {
  font-size: 20px;
}
.community-stories {
  grid-column: 1 / -1; 
}

.story-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.story-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #ff7b8b;
}

.story-user {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.story-text {
  color: #555;
  line-height: 1.6;
  margin-bottom: 10px;
}

.story-footer {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}
/* 模态框通用样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
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
  margin-top: 0;
  color: #ff7b8b;
}

/* 表单底部按钮区域 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-sections {
    grid-template-columns: 1fr; /* 两列变一列 */
  }
  .basic-info-grid {
    grid-template-columns: 1fr; /* 基本信息单列 */
  }
  .habits-grid {
    grid-template-columns: 1fr; /* 习惯单列 */
  }
  .main-image {
    height: 300px; /* 主图缩小 */
  }
  .interaction {
    flex-direction: column; /* 按钮竖向排列 */
    align-items: center;
  }
  .interaction button {
    width: 100%; /* 按钮占满宽度 */
    margin-bottom: 10px;
  }
  .form-row {
    flex-direction: column; /* 表单行竖向排列 */
    gap: 10px;
  }
}
</style>