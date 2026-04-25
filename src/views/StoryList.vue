<template>
  <div class="stories-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1><i class="fas fa-comment-dots"></i> 喵星人故事</h1>
      <p>分享你与校园猫咪的温馨瞬间</p>
    </div>
    
    <!-- 故事分类筛选 -->
    <div class="category-filter">
      <button 
        v-for="cat in categories" 
        :key="cat.value"
        class="filter-btn"
        :class="{ active: activeCategory === cat.value }"
        @click="filterByCategory(cat.value)"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>
    
    <!-- 发布故事表单 -->
    <div class="post-form-container">
      <div class="post-form-card card">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="form-content">
          <textarea 
            v-model="newStory" 
            placeholder="分享你与校园猫咪的故事..."
            rows="3"
          ></textarea>
          
          <!-- 关联猫咪 -->
          <div class="form-options">
            <div class="option-group">
              <label><i class="fas fa-cat"></i> 关联猫咪（可选）</label>
              <select v-model="selectedCatId" class="cat-select">
                <option value="">不关联特定猫咪</option>
                <option v-for="cat in catList" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <!-- 故事分类 -->
            <div class="option-group">
              <label><i class="fas fa-tag"></i> 故事类型</label>
              <div class="tag-select">
                <button 
                  v-for="tag in storyTags" 
                  :key="tag.value"
                  class="tag-btn"
                  :class="{ active: selectedTag === tag.value }"
                  @click="selectedTag = tag.value"
                  type="button"
                >
                  {{ tag.icon }} {{ tag.label }}
                </button>
              </div>
            </div>
            
            <!-- 图片上传 -->
            <div class="option-group">
              <label><i class="fas fa-image"></i> 添加图片（可选）</label>
              <div class="image-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  @change="handleStoryImageUpload"
                  class="file-input"
                >
                <div class="upload-area">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>点击上传图片</span>
                </div>
              </div>
              <!-- 预览图片 -->
              <div v-if="previewImages.length" class="preview-grid">
                <div v-for="(img, idx) in previewImages" :key="idx" class="preview-item">
                  <img :src="img" alt="预览">
                  <span class="remove-img" @click="removePreviewImage(idx)">×</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="postStory" class="post-btn btn btn-primary">
              <i class="fas fa-paper-plane"></i> 发布故事
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 故事列表 -->
    <div class="stories-list">
      <div v-for="(story, i) in filteredStories" :key="i" class="story-card card">
        <!-- 故事头部：用户信息 -->
        <div class="story-header">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <div class="user-name">{{ story.username || '校园爱猫人' }}</div>
            <div class="story-meta">
              <span class="story-time">{{ story.time || '刚刚' }}</span>
              <!-- 关联猫咪标签 -->
              <span v-if="story.catId" class="cat-tag" @click="goToCat(story.catId)">
                <i class="fas fa-cat"></i> @{{ getCatName(story.catId) }}
              </span>
              <!-- 故事类型标签 -->
              <span class="type-tag" :class="'tag-' + story.tag">
                {{ getTagLabel(story.tag) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 故事内容 -->
        <div class="story-content">
          <p class="story-text">{{ story.content }}</p>
          
          <!-- 故事图片 -->
          <div v-if="story.images && story.images.length" class="story-images">
            <div 
              v-for="(img, idx) in story.images.slice(0, 4)" 
              :key="idx" 
              class="story-image-item"
              :class="{ 'has-more': idx === 3 && story.images.length > 4 }"
            >
              <img :src="img" alt="故事图片">
              <div v-if="idx === 3 && story.images.length > 4" class="more-overlay">
                +{{ story.images.length - 4 }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 互动区域 -->
        <div class="story-interaction">
          <div class="interaction-stats">
            <span class="likes-count" @click="toggleLike(i)">
              <i :class="story.liked ? 'fas fa-heart' : 'far fa-heart'"></i>
              {{ story.likes }}
            </span>
            <span class="comments-count">
              <i class="far fa-comment"></i>
              {{ story.comments.length }}
            </span>
            <span class="share-btn" @click="shareStory(story)">
              <i class="fas fa-share"></i> 分享
            </span>
          </div>
          
          <div class="interaction-actions">
            <button class="action-btn" 
              :class="{ 'liked': story.liked }"
              @click="toggleLike(i)">
              <i :class="story.liked ? 'fas fa-heart' : 'far fa-heart'"></i> 
              {{ story.liked ? '已赞' : '点赞' }}
            </button>
            <button class="action-btn" @click="toggleCommentForm(i)">
              <i class="far fa-comment"></i> 评论
            </button>
          </div>
        </div>
          
        <!-- 评论表单 -->
        <div v-if="story.showCommentForm" class="comment-form">
          <div class="comment-input">
            <div class="user-avatar small">
              <i class="fas fa-user"></i>
            </div>
            <textarea 
              v-model="story.newComment" 
              placeholder="写下你的评论..."
              rows="2"
            ></textarea>
          </div>
          <div class="comment-actions">
            <button @click="postComment(i)" class="comment-btn btn btn-primary">
              发布评论
            </button>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div v-if="story.comments.length" class="comments-section">
          <div class="comments-list">
            <div v-for="(comment, j) in story.comments" :key="j" class="comment-item">
              <div class="comment-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-user">用户{{ j + 1 }}</span>
                  <span class="comment-time">刚刚</span>
                </div>
                <p class="comment-text">{{ comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredStories.length === 0" class="empty-state">
        <i class="fas fa-pen-fancy"></i>
        <p>还没有故事，快来分享第一个吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import { catList } from '@/data/cats'

export default {
  name: 'StoryList',
  data() {
    return {
      stories: [
        {
          id: 1,
          content: "昨天在操场边遇到一只三花猫，给了它一根猫条后居然跟着我走了半里路！太可爱了，现在它每天都会在那个时间点等我。",
          likes: 24,
          liked: false,
          comments: ["好有爱啊！我也遇到过这只猫咪", "三花猫很聪明的"],
          newComment: '',
          showCommentForm: false,
          time: '2小时前',
          catId: 4,
          tag: 'story',
          username: '小猫迷',
          images: []
        },
        {
          id: 2,
          content: "图书馆的橘胖最近好像感冒了，一直在打喷嚏。有没有人知道怎么帮它？或者可以联系动物保护协会？",
          likes: 156,
          liked: true,
          comments: ["这只橘胖是我们的常客，特别聪明！", "建议联系校动物保护协会", "我可以帮忙带它去医院"],
          newComment: '',
          showCommentForm: false,
          time: '1天前',
          catId: 1,
          tag: 'help',
          username: '爱猫使者',
          images: []
        },
        {
          id: 3,
          content: "今天在教学楼看到一只小黑猫在躲雨，拿了件旧衣服给它做了个临时小窝，希望它能温暖一些。",
          likes: 89,
          liked: false,
          comments: ["好暖心啊！", "校园里需要更多这样的爱心"],
          newComment: '',
          showCommentForm: false,
          time: '2天前',
          catId: null,
          tag: 'daily',
          username: '暖心学长',
          images: []
        }
      ],
      newStory: '',
      selectedCatId: '',
      selectedTag: 'story',
      previewImages: [],
      activeCategory: 'all',
      categories: [
        { value: 'all', label: '全部', icon: '📋' },
        { value: 'story', label: '猫咪故事', icon: '📖' },
        { value: 'help', label: '求助信息', icon: '🆘' },
        { value: 'daily', label: '日常分享', icon: '💬' },
        { value: 'adopt', label: '领养反馈', icon: '🏠' }
      ],
      storyTags: [
        { value: 'story', label: '猫咪故事', icon: '📖' },
        { value: 'help', label: '求助信息', icon: '🆘' },
        { value: 'daily', label: '日常分享', icon: '💬' },
        { value: 'adopt', label: '领养反馈', icon: '🏠' }
      ]
    }
  },
  computed: {
    catList() {
      return catList || []
    },
    filteredStories() {
      if (this.activeCategory === 'all') {
        return this.stories
      }
      return this.stories.filter(story => story.tag === this.activeCategory)
    }
  },
  methods: {
    // 发布新故事
    postStory() {
      if (!this.newStory.trim()) {
        alert('请输入故事内容')
        return
      }
      
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      
      const newStoryObj = {
        id: Date.now(),
        content: this.newStory,
        likes: 0,
        liked: false,
        comments: [],
        newComment: '',
        showCommentForm: false,
        time: '刚刚',
        catId: this.selectedCatId || null,
        tag: this.selectedTag,
        username: userData.username || '校园爱猫人',
        images: [...this.previewImages]
      }
      
      this.stories.unshift(newStoryObj)
      
      // 如果关联了猫咪，同步到猫咪档案
      if (this.selectedCatId) {
        const catId = Number(this.selectedCatId)
        const catStories = JSON.parse(localStorage.getItem('catStories') || '{}')
        if (!catStories[catId]) {
          catStories[catId] = []
        }
        catStories[catId].unshift({
          id: Date.now(),
          content: this.newStory,
          username: userData.username || '校园爱猫人',
          time: '刚刚',
          tag: this.selectedTag,
          images: [...this.previewImages],
          likes: 0
        })
        if (catStories[catId].length > 20) {
          catStories[catId] = catStories[catId].slice(0, 20)
        }
        localStorage.setItem('catStories', JSON.stringify(catStories))
      }
      
      this.newStory = ''
      this.selectedCatId = ''
      this.selectedTag = 'story'
      this.previewImages = []
      
      this.saveStories()
    },
    
    // 切换点赞状态
    toggleLike(index) {
      const story = this.filteredStories[index]
      if (story.liked) {
        story.likes--
      } else {
        story.likes++
      }
      story.liked = !story.liked
      this.saveStories()
    },
    
    // 切换评论表单
    toggleCommentForm(index) {
      const story = this.filteredStories[index]
      this.filteredStories.forEach((s, i) => {
        if (i !== index) {
          s.showCommentForm = false
        }
      })
      story.showCommentForm = !story.showCommentForm
    },
    
    // 发布评论
    postComment(index) {
      const story = this.filteredStories[index]
      const comment = story.newComment.trim()
      if (comment) {
        story.comments.push(comment)
        story.newComment = ''
        story.showCommentForm = false
        this.saveStories()
      }
    },
    
    // 筛选故事分类
    filterByCategory(value) {
      this.activeCategory = value
    },
    
    // 获取猫咪名称
    getCatName(catId) {
      const cat = catList.find(c => c.id === Number(catId))
      return cat ? cat.name : '未知猫咪'
    },
    
    // 跳转到猫咪详情
    goToCat(catId) {
      this.$router.push(`/cats/${catId}`)
    },
    
    // 获取标签显示文本
    getTagLabel(tag) {
      const tagMap = {
        story: '📖 猫咪故事',
        help: '🆘 求助信息',
        daily: '💬 日常分享',
        adopt: '🏠 领养反馈'
      }
      return tagMap[tag] || '📖 猫咪故事'
    },
    
    // 处理图片上传
    handleStoryImageUpload(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.previewImages.push(event.target.result)
        }
        reader.readAsDataURL(file)
      })
    },
    
    // 移除预览图片
    removePreviewImage(index) {
      this.previewImages.splice(index, 1)
    },
    
    // 分享故事
    shareStory(story) {
      if (navigator.share) {
        navigator.share({
          title: '校园猫咪故事',
          text: story.content.substring(0, 50) + '...',
          url: window.location.href
        })
      } else {
        // 复制链接
        const textarea = document.createElement('textarea')
        textarea.value = window.location.href
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('链接已复制，快去分享吧！')
      }
    },
    
    // 保存故事到localStorage
    saveStories() {
      // 只保存必要数据
      const storiesToSave = this.stories.map(s => ({
        ...s,
        showCommentForm: false,
        newComment: ''
      }))
      localStorage.setItem('communityStories', JSON.stringify(storiesToSave))
    },
    
    // 加载故事
    loadStories() {
      const saved = localStorage.getItem('communityStories')
      if (saved) {
        try {
          const parsedStories = JSON.parse(saved)
          this.stories = parsedStories.map(s => ({
            ...s,
            showCommentForm: false,
            newComment: ''
          }))
        } catch (e) {
          console.error('加载故事数据失败', e)
          this.initDefaultData()
        }
      } else {
        this.initDefaultData()
      }
    },
    
    initDefaultData() {
      // 同步默认故事到 catStories
      const catStories = JSON.parse(localStorage.getItem('catStories') || '{}')
      
      this.stories.forEach(story => {
        if (story.catId) {
          if (!catStories[story.catId]) {
            catStories[story.catId] = []
          }
          // 检查是否已存在（避免重复）
          const exists = catStories[story.catId].some(s => s.id === story.id)
          if (!exists) {
            catStories[story.catId].push({
              id: story.id,
              content: story.content,
              username: story.username,
              time: story.time,
              tag: story.tag,
              images: story.images || [],
              likes: story.likes || 0
            })
          }
        }
      })
      
      localStorage.setItem('catStories', JSON.stringify(catStories))
    }
  },
  mounted() {
    this.loadStories()
  }
}
</script>

<style scoped>
/* 页面容器 */
.stories-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0 20px;
}

.page-header h1 {
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-header p {
  color: #666;
  font-size: 1.2rem;
  opacity: 0.8;
}

/* 分类筛选 */
.category-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border: 2px solid #eee;
  border-radius: 25px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 发布表单容器 */
.post-form-container {
  margin-bottom: 40px;
}

.post-form-card {
  padding: 25px;
  display: flex;
  gap: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 用户头像样式 */
.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--light-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.user-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

/* 表单内容区域 */
.form-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

textarea {
  width: 100%;
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1.1rem;
  resize: none;
  margin-bottom: 20px;
  transition: all 0.3s;
  min-height: 100px;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 123, 139, 0.2);
}

/* 表单选项 */
.form-options {
  margin-bottom: 20px;
}

.option-group {
  margin-bottom: 15px;
}

.option-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.cat-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

/* 标签选择 */
.tag-select {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: var(--primary-color);
}

.tag-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 图片上传 */
.image-upload {
  position: relative;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #999;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.upload-area i {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

/* 预览图片 */
.preview-grid {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-img {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}

/* 发布按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
}

.post-btn {
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 30px;
}

/* 故事列表 */
.stories-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 单个故事卡片样式 */
.story-card {
  padding: 25px;
  transition: all 0.3s;
  border-radius: 12px;
}

.story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 故事头部 */
.story-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.story-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.story-time {
  color: #888;
  font-size: 0.9rem;
}

/* 猫咪标签 */
.cat-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #fff5f6;
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-tag:hover {
  background: #ffe0e3;
}

/* 类型标签 */
.type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.tag-story {
  background: #e3f2fd;
  color: #1976d2;
}

.tag-help {
  background: #fff3e0;
  color: #f57c00;
}

.tag-daily {
  background: #f3e5f5;
  color: #7b1fa2;
}

.tag-adopt {
  background: #e8f5e9;
  color: #388e3c;
}

/* 故事内容样式 */
.story-content {
  margin-bottom: 25px;
}

.story-text {
  line-height: 1.8;
  color: #333;
  font-size: 1.1rem;
  text-align: justify;
  margin-bottom: 15px;
}

/* 故事图片 */
.story-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 15px;
}

.story-image-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.story-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.story-image-item:hover img {
  transform: scale(1.05);
}

.more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

/* 互动区域样式 */
.story-interaction {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
  margin-bottom: 20px;
}

.interaction-stats {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 15px;
}

.likes-count, .comments-count, .share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  transition: color 0.3s;
}

.likes-count:hover, .share-btn:hover {
  color: var(--primary-color);
}

.interaction-actions {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.action-btn {
  background: transparent;
  border: none;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 123, 139, 0.1);
  color: var(--primary-color);
}

.action-btn.liked {
  color: var(--primary-color);
}

/* 评论表单样式 */
.comment-form {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
}

.comment-input {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.comment-form textarea {
  margin-bottom: 0;
  min-height: 60px;
  font-size: 1rem;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-btn {
  padding: 10px 25px;
  font-size: 0.95rem;
}

/* 评论列表区域 */
.comments-section {
  margin-top: 20px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 600;
  color: var(--dark-color);
  font-size: 0.95rem;
}

.comment-time {
  color: #888;
  font-size: 0.8rem;
}

.comment-text {
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stories-page {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .post-form-card {
    flex-direction: column;
    gap: 15px;
  }
  
  .interaction-actions {
    gap: 15px;
  }
  
  .story-text {
    font-size: 1rem;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .story-images {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .story-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .interaction-actions {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .category-filter {
    gap: 6px;
  }
  
  .filter-btn {
    padding: 6px 14px;
    font-size: 13px;
  }
}
</style>