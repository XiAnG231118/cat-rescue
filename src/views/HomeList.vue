<template>
  <div class="home">
    <!-- 顶部横幅区域 -->
    <div class="hero-banner">
      <h1>欢迎来到校园喵星人基地</h1>
      <p>关爱流浪猫，从了解开始</p>
    </div>
    
    <!-- 今日明星猫展示区 -->
    <section class="cat-wall-section">
      <div class="section-header">
        <h2><i class="fas fa-paw"></i> 今日明星猫</h2>
        <router-link to="/cats" class="view-all">查看全部 &rarr;</router-link>
      </div>
      <div class="cat-wall">
        <!-- 精选猫咪卡片，点击跳转到猫咪档案 -->
        <router-link 
          v-for="cat in featuredCats" 
          :key="cat.id" 
          :to="`/cats#${cat.id}`"
          class="cat-card"
        >
          <div class="card-image">
            <img :src="cat.images[0]" :alt="cat.name">
          </div>
          <div class="card-content">
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.personality }}</p>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 校园猫咪新闻区 -->
    <section class="cat-news">
      <div class="section-header">
        <h2><i class="fas fa-newspaper"></i> 校园猫咪趣闻</h2>
      </div>
      <div class="news-list">
        <!-- 新闻卡片 -->
        <div v-for="(news, index) in catNews" :key="index" class="news-card card">
          <div class="news-image">
            <img :src="news.image" :alt="news.title">
          </div>
          <div class="news-content">
            <h3>{{ news.title }}</h3>
            <p class="date"><i class="far fa-calendar-alt"></i> {{ news.date }}</p>
            <p class="summary">{{ news.summary }}</p>
            <!-- 阅读更多链接 -->
            <router-link :to="`/news/${index + 1}`" class="read-more btn btn-secondary">
              阅读更多 <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// 导入猫咪数据
import { catList } from '@/data/cats'

export default {
  name: 'HomeList',
  data() {
    return {
      // 猫咪新闻数据
      catNews: [
        {
          title: "图书馆橘猫学会自己按电梯",
          date: "2023-10-15",
          summary: "校园图书馆的明星橘猫'胖橘'被拍到用爪子按电梯按钮，成功到达3楼觅食...",
          image: require('@/assets/news/cat-elevator.jpg'),
          link: "/stories/1"
        },
        {
          title: "学生自发为怀孕母猫搭建产房",
          date: "2023-10-08",
          summary: "艺术系学生为校园内的怀孕母猫'小黑'制作了防水保暖的户外产房...",
          image: require('@/assets/news/cat-house.jpg'),
          link: "/stories/2"
        },
        {
          title: "校猫集体绝育计划圆满完成",
          date: "2023-09-28",
          summary: "动物保护协会联合宠物医院为校内15只流浪猫完成绝育手术...",
          image: require('@/assets/news/cat-medical.jpg'),
          link: "/guide/medical"
        },
        {
          title: "校园猫咪暖心投喂点完成升级 新增保暖设施与监控",
          date: "2023-09-10",
          summary: "为改善校园流浪猫的生存环境，学生处联合动物保护协会...",
          image: require('@/assets/news/cat-feeding.jpg'),
          link: "/guide/medical"
        }
      ]
    }
  },
  computed: {
    // 精选猫咪：取前4只猫咪
    featuredCats() {
      return catList.slice(0, 4)
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄横幅：渐变色背景 + 背景图片 */
.hero-banner {
  background: linear-gradient(rgba(255, 123, 139, 0.8), rgba(255, 182, 193, 0.8)), 
              url('@/assets/cat-banner.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 80px 20px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 10px 20px rgba(255, 123, 139, 0.2);
}

.hero-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.hero-banner p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 区块标题区域 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-all {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.view-all:hover {
  color: #ff5c71;
  transform: translateX(5px);
}

/* 猫咪展示墙：网格布局 */
.cat-wall {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.cat-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s;
}

.cat-card:hover {
  transform: translateY(-5px);
}

.card-image {
  height: 200px;
  border-radius: 12px 12px 0 0;
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

.card-content {
  background: white;
  padding: 15px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-content h3 {
  color: var(--primary-color);
  margin-bottom: 5px;
}

.card-content p {
  color: #666;
  font-size: 0.9rem;
}

/* 新闻列表 */
.news-list {
  display: grid;
  gap: 30px;
}

.news-card {
  display: flex;
}

.news-image {
  flex: 0 0 300px;
  height: 250px;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.news-content h3 {
  color: var(--dark-color);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.date {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.date i {
  margin-right: 5px;
}

.summary {
  flex: 1;
  color: #555;
  margin-bottom: 20px;
}

.read-more {
  align-self: flex-start;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-banner {
    padding: 60px 20px;
  }
  
  .hero-banner h1 {
    font-size: 2rem;
  }
  
  /* 新闻卡片改为垂直布局 */
  .news-card {
    flex-direction: column;
  }
  
  .news-image {
    flex: auto;
    height: 200px;
  }
}
</style>