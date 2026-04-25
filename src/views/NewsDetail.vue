<template>
  <div class="news-detail-page">
    <!-- 返回首页按钮 -->
    <router-link to="/home" class="back-btn">
      <i class="fas fa-arrow-left"></i> 返回首页
    </router-link>

    <div class="content-wrapper">
      <!-- 新闻文章内容区域 -->
      <article class="news-article">
        <header class="article-header">
          <h1>{{ news.title }}</h1>
          <p class="date"><i class="far fa-calendar-alt"></i> {{ news.date }}</p>
        </header>
        
        <!-- 新闻图片，点击可查看大图 -->
        <div class="article-image">
          <img :src="news.image" :alt="news.title" @click="openLightbox">
        </div>
        
        <!-- 新闻正文内容 -->
        <div class="article-content">
          <p v-for="(paragraph, index) in news.content.split('\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </article>
      
      <!-- 相关新闻推荐 -->
      <section class="related-news" v-if="relatedNews.length">
        <div class="section-header">
          <h2><i class="fas fa-newspaper"></i> 相关新闻</h2>
        </div>
        <div class="related-list">
          <!-- 相关新闻卡片，点击跳转到对应新闻详情 -->
          <!-- 在模板中修改为： -->
          <router-link 
            v-for="item in relatedNews" 
            :key="item.id" 
            :to="{ name: 'NewsDetail', params: { id: item.id } }"
            class="related-card card"
          >
            <div class="related-image">
              <img :src="item.image" :alt="item.title">
            </div>
            <div class="related-content">
              <h3>{{ item.title }}</h3>
              <p class="date">{{ item.date }}</p>
              <p class="summary">{{ getSummary(item.content) }}</p>
              <span class="read-more">
                阅读更多 <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </router-link>
        </div>
      </section>
    </div>
    
    <!-- 图片查看器（lightbox） -->
    <div v-if="showLightbox" class="lightbox" @click="showLightbox = false">
      <div class="lightbox-content">
        <img :src="news.image" :alt="news.title">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsDetail',
  props: ['id'],  // 从路由参数获取新闻ID
  data() {
    return {
      news: {  // 当前新闻数据
        title: '',
        date: '',
        image: '',
        content: ''
      },
      showLightbox: false,  // 控制图片查看器显示
      newsList: [  // 所有新闻数据
        {
          id: 1,
          title: "图书馆橘猫学会自己按电梯",
          date: "2023-10-15",
          image: require('@/assets/news/cat-elevator.jpg'),
          content: "校园图书馆的明星橘猫'胖橘'被拍到用爪子按电梯按钮，成功到达3楼觅食。据目击者称，胖橘经常在图书馆附近活动，对电梯似乎很感兴趣。这次它熟练地按下按钮，让大家惊叹不已。有同学猜测，胖橘可能是为了去3楼的自习室找吃的，因为那里经常有同学会带零食。这一有趣的行为也让校园里的同学们对胖橘更加喜爱了。"
        },
        {
          id: 2,
          title: "学生自发为怀孕母猫搭建产房",
          date: "2023-10-08",
          image: require('@/assets/news/cat-house.jpg'),
          content: "艺术系学生为校园内的怀孕母猫'小黑'制作了防水保暖的户外产房。同学们用木板和防水布精心搭建了一个舒适的小窝，里面还铺上了柔软的垫子。大家希望这个产房能让小黑在生产和哺育小猫时感到安全和温暖。据了解，小黑平时性格温顺，经常在校园里和同学们互动，所以大家都很关心它的情况。目前，小黑已经住进了新产房，等待着小猫的降生。"
        },
        {
          id: 3,
          title: "校猫集体绝育计划圆满完成",
          date: "2023-09-28",
          image: require('@/assets/news/cat-medical.jpg'),
          content: "动物保护协会联合宠物医院为校内15只流浪猫完成绝育手术。这次绝育计划旨在控制校园内流浪猫的数量，同时也有助于提高它们的健康水平。手术过程非常顺利，所有猫咪都在术后得到了妥善的照顾和护理。现在，这些猫咪已经陆续回到校园，它们的生活也将更加健康和稳定。学校方面表示，未来还会继续关注流浪猫的情况，为它们提供必要的帮助和保护。"
        },
        {
          id: 4,
          title: "校园猫咪暖心投喂点完成升级 新增保暖设施与监控",
          date: "2023-09-10",
          image: require('@/assets/news/cat-feeding.jpg'),
          content: "为改善校园流浪猫的生存环境，学生处联合动物保护协会对校内3处猫咪投喂点进行全面升级改造。本次升级不仅更换了防水防蚁的新型投喂食盆和饮水器，还为投喂点加装了防风保暖的遮雨棚，同时配备了高清监控设备，便于志愿者实时观察猫咪的进食情况和健康状态。据了解，投喂点升级后，志愿者每日投喂的效率提升了40%，校园猫咪的定点进食率也从原来的65%提高至90%。不少同学表示，升级后的投喂点既整洁又贴心，能明显感受到猫咪们的状态变得更好。后续学校还将定期对投喂点进行维护，并根据猫咪活动轨迹，考虑新增1-2处投喂点，让校园里的流浪猫都能得到温暖的照料。"
        }
      ]
    }
  },
  computed: {
    // 相关新闻：排除当前新闻，取最多3条
    relatedNews() {
      return this.newsList.filter(news => news.id !== Number(this.id)).slice(0, 3)
    }
  },
  mounted() {
    // 组件挂载时，根据ID查找对应的新闻数据
    this.news = this.newsList.find(news => news.id === Number(this.id)) || {}
  },
   // 添加 watch 监听路由参数变化
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.loadNews(newId)
      }
    }
  },
  methods: {
    loadNews(id) {
      this.news = this.newsList.find(news => news.id === Number(id)) || {}
      this.showLightbox = false
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    openLightbox() {
      this.showLightbox = true
    },
    // 生成内容摘要（截取前80字符）
    getSummary(content) {
      return content.substring(0, 50) + '...'
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.news-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

/* 返回按钮样式 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 30px;
  background: rgba(255, 123, 139, 0.1);
}

.back-btn:hover {
  color: #ff5c71;
  transform: translateX(-5px);
  background: rgba(255, 123, 139, 0.2);
}

/* 内容区域：两栏布局（主文章+相关新闻） */
.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

/* 新闻文章样式 */
.news-article {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 0;
}

/* 文章标题区域 */
.article-header {
  text-align: center;
  margin-bottom: 30px;
}

.article-header h1 {
  color: var(--dark-color);
  font-size: 2.5rem;
  margin-bottom: 15px;
  line-height: 1.3;
}

.date {
  color: #888;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* 文章图片样式 */
.article-image {
  width: 100%;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  cursor: zoom-in;  /* 鼠标悬停时显示放大镜图标 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-image img {
  width: 100%;
  height: auto;
  min-height: 300px;
  max-height: 500px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s;
}

.article-image:hover img {
  transform: scale(1.03);
}

/* 文章内容样式 */
.article-content {
  line-height: 1.8;
  color: #555;
  font-size: 1.1rem;
}

.article-content p {
  margin-bottom: 25px;
  text-align: justify;
}

/* 相关新闻区域 */
.related-news {
  margin-top: 0;
}

.section-header {
  margin-bottom: 25px;
}

.related-news h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 相关新闻卡片样式 */
.related-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  padding: 0;
  height: 100%;
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.related-image {
  height: 200px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.related-content h3 {
  color: var(--dark-color);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.related-content .date {
  color: #888;
  font-size: 0.9rem;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.summary {
  flex: 1;
  color: #555;
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.read-more {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.related-card:hover .read-more {
  color: #ff5c71;
  transform: translateX(5px);
}

/* 图片查看器（lightbox）样式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  cursor: zoom-out;  /* 点击图片外部关闭时显示缩小图标 */
}

.lightbox-content {
  max-width: 90%;
  max-height: 90%;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  /* 平板设备：改为单栏布局 */
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .news-article {
    padding: 30px;
  }
  
  .article-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  /* 移动设备：调整内边距和字体大小 */
  .news-detail-page {
    padding: 20px;
  }
  
  .news-article {
    padding: 25px;
  }
  
  .article-header h1 {
    font-size: 1.8rem;
  }
  
  .article-content {
    font-size: 1rem;
  }
  
  .related-content {
    padding: 20px;
  }
  
  .related-image {
    height: 180px;
  }
}

/* 大屏幕设备优化 */
@media (min-width: 1200px) {
  .news-detail-page {
    padding: 40px;
  }
  
  .content-wrapper {
    gap: 50px;
  }
}
</style>