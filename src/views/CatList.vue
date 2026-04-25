<template>
  <div class="cats-page">
    <div class="page-header">
      <h1><i class="fas fa-cat"></i> 猫咪档案</h1>
      <p>认识我们校园里的喵星人朋友们</p>
    </div>
    
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-card">
        <label for="gender-filter"><i class="fas fa-venus-mars"></i> 按性别筛选：</label>
        <select id="gender-filter" v-model="filterGender" class="filter-select">
          <option value="">全部猫咪</option>
          <option value="公">小王子们</option>
          <option value="母">小公主们</option>
        </select>
      </div>
    </div>
    
    <!-- 猫咪列表，使用 CSS Grid 布局 -->
    <div class="cat-list">
      <div v-for="cat in filteredCats" :key="cat.id" class="cat-card">
        <div class="card-image">
          <img :src="cat.images[0]" :alt="cat.name">
          <!-- 性别徽章，根据性别显示不同颜色和符号 -->
          <div class="gender-badge" :class="cat.gender">
            {{ cat.gender === '公' ? '♂' : '♀' }}
          </div>
        </div>
        <div class="card-body">
          <h3>{{ cat.name }}</h3>
          <div class="cat-meta">
            <span><i class="fas fa-heart"></i> {{ cat.personality }}</span>
            <span><i class="fas fa-clinic-medical"></i> {{ cat.health }}</span>
          </div>
          <!-- 跳转到详情页的路由链接 -->
          <router-link :to="`/cats/${cat.id}`" class="detail-link" @click="scrollToTop">
            查看详情 <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { catList } from '@/data/cats'

export default defineComponent({
  name: 'CatList',
  setup() {
    // 筛选条件：性别
    const filterGender = ref('')
    
    // 根据筛选条件计算过滤后的猫咪列表
    const filteredCats = computed(() => {
      return filterGender.value 
        ? catList.filter(cat => cat.gender === filterGender.value)
        : catList
    })
    
    return {
      filterGender,
      filteredCats
    }
  },
  methods: {
    // 滚动到页面顶部的辅助方法
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
})
</script>

<style scoped>
/* 页面容器：居中、内边距、最大宽度 */
.cats-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题区域样式 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: var(--primary-color);
  font-size: 2.2rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

/* 筛选区域样式 */
.filter-section {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.filter-card {
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 123, 139, 0.2);
}

/* 猫咪列表网格布局 */
.cat-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

/* 猫咪卡片样式 */
.cat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 卡片图片区域 */
.card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.cat-card:hover .card-image img {
  transform: scale(1.05);
}

/* 性别徽章：右上角圆形标识 */
.gender-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.gender-badge.公 {
  background: rgba(0, 123, 255, 0.8);
}

.gender-badge.母 {
  background: rgba(255, 65, 130, 0.8);
}

/* 卡片内容区域 */
.card-body {
  padding: 20px;
}

.card-body h3 {
  color: var(--primary-color);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.cat-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.cat-meta i {
  margin-right: 5px;
  color: var(--secondary-color);
}

/* 查看详情链接，悬停时有右移动画 */
.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.detail-link:hover {
  color: #ff5c71;
  transform: translateX(5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-card {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  
  .cat-list {
    grid-template-columns: 1fr;
  }
}
</style>