<template>
  <div class="guide-page">
    <div class="page-header">
      <h1><i class="fas fa-book-open"></i> 救助指南</h1>
      <p>学习如何正确关爱校园流浪猫</p>
    </div>
    
    <!-- AI症状自查助手入口 -->
    <div class="ai-assistant-entry" @click="showAIAssistant = true" v-if="!showAIAssistant">
      <div class="assistant-card">
        <div class="assistant-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="assistant-info">
          <h3>AI 症状自查助手</h3>
          <p>不确定猫咪怎么了？让AI帮你初步判断</p>
        </div>
        <div class="assistant-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>

    <!-- AI助手弹窗 -->
    <div class="ai-assistant-modal" v-if="showAIAssistant">
      <div class="modal-overlay" @click="closeAIAssistant"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <i class="fas fa-robot"></i>
            AI 症状自查助手
          </h2>
          <button class="close-btn" @click="closeAIAssistant">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- 问卷进度 -->
          <div class="progress-bar">
            <div class="progress" :style="{ width: progressPercent + '%' }"></div>
          </div>
          
          <!-- 动态问卷内容 -->
          <div class="question-container">
            <!-- 问题部分 -->
            <div v-if="!diagnosisResult">
              <h3 class="question-text">{{ currentQuestion.text }}</h3>
              
              <!-- 症状标签选择（第一步） -->
              <div v-if="currentStep === 'symptoms'" class="symptom-tags">
                <button 
                  v-for="symptom in symptomOptions" 
                  :key="symptom.value"
                  :class="['symptom-tag', { selected: selectedSymptoms.includes(symptom.value) }]"
                  @click="toggleSymptom(symptom.value)"
                >
                  <i :class="symptom.icon"></i>
                  {{ symptom.label }}
                </button>
              </div>
              
              <!-- 单选选项 -->
              <div v-else class="options-list">
                <button 
                  v-for="option in currentQuestion.options" 
                  :key="option.value"
                  class="option-btn"
                  @click="selectOption(option)"
                >
                  {{ option.label }}
                </button>
              </div>
              
              <!-- 导航按钮 -->
              <div class="nav-buttons">
                <button 
                  v-if="canGoBack"
                  class="nav-btn back-btn"
                  @click="goBack"
                >
                  <i class="fas fa-arrow-left"></i> 上一步
                </button>
                <button 
                  v-if="currentStep === 'symptoms'"
                  class="nav-btn next-btn"
                  :disabled="selectedSymptoms.length === 0"
                  @click="analyzeSymptoms"
                >
                  开始分析 <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            
            <!-- 诊断结果 -->
            <div v-else class="diagnosis-result">
              <div class="result-header" :class="resultClass">
                <i :class="resultIcon"></i>
                <h3>{{ diagnosisResult.disease }}</h3>
              </div>
              
              <div class="result-section">
                <h4><i class="fas fa-clipboard-list"></i> 症状分析</h4>
                <div class="symptom-summary">
                  <span 
                    v-for="symptom in diagnosisResult.matchedSymptoms" 
                    :key="symptom"
                    class="matched-symptom"
                  >
                    {{ getSymptomLabel(symptom) }}
                  </span>
                </div>
                <p>{{ diagnosisResult.analysis }}</p>
              </div>
              
              <div class="result-section">
                <h4><i class="fas fa-lightbulb"></i> 处理建议</h4>
                <ul class="advice-list">
                  <li v-for="(advice, idx) in diagnosisResult.advice" :key="idx">
                    <i class="fas fa-check-circle"></i>
                    {{ advice }}
                  </li>
                </ul>
              </div>
              
              <div class="result-section emergency-note" v-if="diagnosisResult.emergency">
                <h4><i class="fas fa-exclamation-triangle"></i> 紧急提醒</h4>
                <p>{{ diagnosisResult.emergency }}</p>
              </div>
              
              <div class="result-actions">
                <button class="action-btn restart-btn" @click="restartDiagnosis">
                  <i class="fas fa-redo"></i> 重新自查
                </button>
                <button class="action-btn close-result-btn" @click="closeAIAssistant">
                  <i class="fas fa-check"></i> 完成
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 搜索模块 -->
    <div class="search-container">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索指南标题、内容或分类..."
          class="search-input"
        >
        <button 
          v-if="searchKeyword" 
          @click="clearSearch" 
          class="clear-btn"
          title="清除搜索"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="search-stats" v-if="searchKeyword">
        找到 {{ filteredGuides.length }} 条相关结果
      </div>
    </div>
	
    <!-- 选项卡区域 -->
    <div class="tabs-container">
        <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab" 
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
          class="tab-btn"
        >
          <i :class="tabIcons[tab]"></i> {{ tab }}
        </button>
      </div>
    </div>
    
    <!-- 指南列表 -->
    <div class="guide-list">
      <div v-if="filteredGuides.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>没有找到匹配的指南</p>
        <button @click="clearSearch" class="reset-btn">清除搜索</button>
      </div>
      
      <div 
        v-for="item in filteredGuides" 
        :key="item.id" 
        class="guide-card"
        :class="{ emergency: item.emergency }"
      >
        <div class="card-header">
          <h3>{{ item.title }}</h3>
          <span class="category-badge">{{ item.category }}</span>
        </div>
        
        <div class="content-wrapper">
          <div class="text-content">
            <ul class="guide-points">
              <li v-for="(text, i) in item.content" :key="i">
                <i class="fas fa-check-circle"></i> 
                <span>{{ text }}</span>
              </li>
            </ul>
          </div>
          
          <div class="image-container" v-if="item.images.length">
            <div class="guide-images">
              <img 
                v-for="(img, idx) in item.images" 
                :key="idx" 
                :src="img" 
                :alt="item.title + ' 示例图' + (idx + 1)"
              >
            </div>
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import { guideData } from '@/data/guide'

// 症状决策树配置
// 定义症状选项、对应疾病、追问问题，AI助手根据此配置进行分诊
const symptomDecisionTree = {
  // 可选症状列表
  symptoms: [
    { value: 'eye_red', label: '眼睛红肿', icon: 'fas fa-eye' },
    { value: 'eye_discharge', label: '眼部分泌物', icon: 'fas fa-eye-dropper' },
    { value: 'sneeze', label: '打喷嚏', icon: 'fas fa-wind' },
    { value: 'runny_nose', label: '流鼻涕', icon: 'fas fa-nose' },
    { value: 'mouth_ulcer', label: '口腔溃疡/流口水', icon: 'fas fa-teeth' },
    { value: 'bad_breath', label: '口臭', icon: 'fas fa-face-meh' },
    { value: 'drooling', label: '流口水', icon: 'fas fa-droplet' },
    { value: 'not_eating', label: '食欲不振', icon: 'fas fa-utensils' },
    { value: 'wound', label: '外伤/出血', icon: 'fas fa-band-aid' },
    { value: 'swelling', label: '肿胀/脓肿', icon: 'fas fa-circle-exclamation' },
    { value: 'limping', label: '跛行', icon: 'fas fa-person-walking' },
    { value: 'lethargy', label: '精神萎靡', icon: 'fas fa-bed' }
  ],
  
  // 疾病库：关联症状、分析、建议
  diseases: {
    cat_flu: {
      name: '猫鼻支（猫疱疹病毒）',
      relatedSymptoms: ['eye_red', 'eye_discharge', 'sneeze', 'runny_nose'],
      analysis: '根据您描述的症状，猫咪很可能感染了猫鼻支（猫疱疹病毒感染）。这是流浪猫中非常常见的上呼吸道疾病，传染性强但通常不致命。',
      advice: [
        '使用猫专用左氧氟沙星滴眼液或阿昔洛韦滴眼液，每日3-4次',
        '将猫咪隔离在温暖、安静的环境中观察',
        '补充赖氨酸营养膏，有助于抑制病毒复制',
        '如果猫咪不进食，可用针管喂食流质食物',
        '若症状持续超过3天或加重，建议尽快送医'
      ],
      emergency: '如果猫咪出现呼吸困难、持续高烧或完全拒食超过24小时，请立即就医！'
    },
    
    stomatitis: {
      name: '猫口炎',
      relatedSymptoms: ['mouth_ulcer', 'drooling', 'bad_breath', 'not_eating'],
      analysis: '根据您描述的症状，猫咪可能患有口炎。这是流浪猫常见的口腔炎症性疾病，会导致剧烈疼痛和进食困难。',
      advice: [
        '使用宠物专用口腔消炎喷剂（如可鲁口腔喷剂）',
        '喂食软质、流质食物，避免硬质猫粮刺激',
        '可短期使用甲硝唑（需遵医嘱剂量）控制感染',
        '补充维生素B族，增强口腔黏膜修复能力',
        '建议送医检查，严重口炎可能需要拔牙治疗'
      ],
      emergency: '如果猫咪完全无法进食进水超过24小时，请立即送医进行输液支持！'
    },
    
    trauma: {
      name: '外伤/创伤',
      relatedSymptoms: ['wound', 'swelling', 'limping'],
      analysis: '猫咪有明显外伤表现。流浪猫常见打架咬伤、划伤等情况，需要及时处理防止感染。',
      advice: [
        '用生理盐水或碘伏轻轻清洗伤口',
        '涂抹宠物专用创伤药膏（如百灵金方）',
        '较深伤口建议就医清创缝合',
        '防止猫咪舔舐伤口，必要时佩戴伊丽莎白圈',
        '观察伤口愈合情况，如有化脓、发臭需尽快就医'
      ],
      emergency: '如果伤口深大、持续出血或已出现化脓感染，请立即送医处理！'
    },
    
    general: {
      name: '需进一步观察',
      analysis: '根据您描述的症状，目前无法明确判断具体疾病。可能是多种疾病的早期表现。',
      advice: [
        '密切观察猫咪的精神状态和食欲',
        '记录症状变化情况',
        '确保猫咪有充足的饮水和食物',
        '如果症状持续或加重，建议尽快就医检查'
      ],
      emergency: null
    }
  },
  // 追问问题库（症状匹配不足2个时触发）
  questions: {
    eye_severity: {
      text: '眼睛分泌物是什么颜色？',
      options: [
        { value: 'clear', label: '透明/清水样' },
        { value: 'yellow', label: '黄色/脓性' },
        { value: 'blood', label: '带血丝' }
      ]
    },
    nose_discharge: {
      text: '鼻涕是什么颜色？',
      options: [
        { value: 'clear', label: '透明' },
        { value: 'yellow_green', label: '黄绿色/脓性' }
      ]
    },
    appetite: {
      text: '猫咪还能正常进食吗？',
      options: [
        { value: 'normal', label: '正常进食' },
        { value: 'reduced', label: '食欲下降但仍能吃' },
        { value: 'none', label: '完全不吃' }
      ]
    },
    wound_type: {
      text: '伤口情况如何？',
      options: [
        { value: 'minor', label: '浅表擦伤/小伤口' },
        { value: 'deep', label: '较深/需缝合' },
        { value: 'infected', label: '已红肿化脓' }
      ]
    }
  }
}

export default {
  name: 'GuideList',
  data() {
    return {
      //选项卡与搜索
      tabs: ['全部', '紧急救助', '日常投喂', '医疗知识', '抓捕安全'],
      activeTab: '全部',
      guides: guideData,
      searchKeyword: '',
      tabIcons: {
        '全部': 'fas fa-star',
        '紧急救助': 'fas fa-exclamation-triangle',
        '日常投喂': 'fas fa-utensils',
        '医疗知识': 'fas fa-first-aid',
        '抓捕安全': 'fas fa-shield-alt'
      },
      
      // AI分诊助手状态
      showAIAssistant: false,
      currentStep: 'symptoms',
      selectedSymptoms: [],
      diagnosisHistory: [],
      diagnosisResult: null,
      
      symptomOptions: symptomDecisionTree.symptoms,
      decisionTree: symptomDecisionTree
    }
  },
  
  computed: {
    // 根据激活标签和搜索关键词双重过滤
    filteredGuides() {
      let filtered = this.activeTab === '全部' 
        ? this.guides 
        : this.guides.filter(item => item.category === this.activeTab)
      
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim()
        filtered = filtered.filter(item => {
          const titleMatch = item.title.toLowerCase().includes(keyword)
          const categoryMatch = item.category.toLowerCase().includes(keyword)
          const contentMatch = item.content.some(text => 
            text.toLowerCase().includes(keyword)
          )
          return titleMatch || categoryMatch || contentMatch
        })
      }
      
      return filtered
    },
    // AI助手进度百分比
    progressPercent() {
      if (this.currentStep === 'symptoms') return 20
      if (this.currentStep.includes('question')) return 50
      return 100
    },
    // 当前显示的问题（症状选择或追问）
    currentQuestion() {
      if (this.currentStep === 'symptoms') {
        return { text: '请选择猫咪出现的症状（可多选）' }
      }
      
      const questionKey = this.currentStep.replace('question_', '')
      return this.decisionTree.questions[questionKey] || { text: '' }
    },
    // 是否可返回上一步
    canGoBack() {
      return this.diagnosisHistory.length > 0 && !this.diagnosisResult
    },
    // 诊断结果样式类名
    resultClass() {
      if (!this.diagnosisResult) return ''
      if (this.diagnosisResult.disease.includes('鼻支')) return 'result-catflu'
      if (this.diagnosisResult.disease.includes('口炎')) return 'result-stomatitis'
      if (this.diagnosisResult.disease.includes('外伤')) return 'result-trauma'
      return 'result-general'
    },
    // 诊断结果图标
    resultIcon() {
      if (!this.diagnosisResult) return ''
      if (this.diagnosisResult.disease.includes('鼻支')) return 'fas fa-lungs'
      if (this.diagnosisResult.disease.includes('口炎')) return 'fas fa-face-frown'
      if (this.diagnosisResult.disease.includes('外伤')) return 'fas fa-bone'
      return 'fas fa-circle-info'
    }
  },
  
  methods: {
    //搜索相关
    clearSearch() {
      this.searchKeyword = ''
    },
    
    // AI助手方法
    closeAIAssistant() {
      this.showAIAssistant = false
      this.resetDiagnosis()
    },
    // 重置为初始状态
    resetDiagnosis() {
      this.currentStep = 'symptoms'
      this.selectedSymptoms = []
      this.diagnosisHistory = []
      this.diagnosisResult = null
    },
    // 切换症状的选中状态（多选）
    toggleSymptom(symptomValue) {
      const index = this.selectedSymptoms.indexOf(symptomValue)
      if (index > -1) {
        this.selectedSymptoms.splice(index, 1)
      } else {
        this.selectedSymptoms.push(symptomValue)
      }
    },
    // 分析症状，匹配疾病
    analyzeSymptoms() {
      if (this.selectedSymptoms.length === 0) return
      
      // 判断最匹配的疾病
      let bestMatch = null
      let maxMatchCount = 0
      
      for (const [diseaseKey, disease] of Object.entries(this.decisionTree.diseases)) {
        if (diseaseKey === 'general') continue
        
        const matchCount = this.selectedSymptoms.filter(s => 
          disease.relatedSymptoms.includes(s)
        ).length
        
        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount
          bestMatch = diseaseKey
        }
      }
      
      // 如果匹配症状数少于2个，进入追问流程
      if (maxMatchCount < 2) {
        this.startFollowUpQuestions()
        return
      }
      
      // 直接给出诊断
      this.generateDiagnosis(bestMatch)
    },
    
    startFollowUpQuestions() {
      // 根据已选症状确定追问
      const hasEye = this.selectedSymptoms.some(s => s.includes('eye'))
      const hasNose = this.selectedSymptoms.some(s => s.includes('nose') || s === 'sneeze')
      const hasMouth = this.selectedSymptoms.some(s => s.includes('mouth') || s === 'drooling')
      const hasWound = this.selectedSymptoms.includes('wound') || this.selectedSymptoms.includes('swelling')
      
      if (hasEye) {
        this.currentStep = 'question_eye_severity'
      } else if (hasNose) {
        this.currentStep = 'question_nose_discharge'
      } else if (hasMouth) {
        this.currentStep = 'question_appetite'
      } else if (hasWound) {
        this.currentStep = 'question_wound_type'
      } else {
        // 没有明确症状，给出通用建议
        this.generateDiagnosis('general')
      }
      
      this.diagnosisHistory.push('symptoms')
    },
    
    selectOption(option) {
      this.diagnosisHistory.push({
        step: this.currentStep,
        answer: option.value
      })
      
      // 根据答案跳转或给出诊断
      if (this.currentStep === 'question_eye_severity' || 
          this.currentStep === 'question_nose_discharge') {
        this.generateDiagnosis('cat_flu')
      } else if (this.currentStep === 'question_appetite') {
        this.generateDiagnosis('stomatitis')
      } else if (this.currentStep === 'question_wound_type') {
        this.generateDiagnosis('trauma')
      }
    },
    
    goBack() {
      if (this.diagnosisHistory.length === 0) return
      
      const lastStep = this.diagnosisHistory.pop()
      this.currentStep = typeof lastStep === 'string' ? lastStep : lastStep.step
    },
    // 生成诊断结果
    generateDiagnosis(diseaseKey) {
      const disease = this.decisionTree.diseases[diseaseKey]
      const matchedSymptoms = this.selectedSymptoms.filter(s => 
        disease.relatedSymptoms?.includes(s) || false
      )
      
      this.diagnosisResult = {
        disease: disease.name,
        matchedSymptoms: matchedSymptoms,
        analysis: disease.analysis,
        advice: disease.advice,
        emergency: disease.emergency
      }
      
      this.currentStep = 'result'
    },
    
    restartDiagnosis() {
      this.resetDiagnosis()
    },
    // 根据症状值获取显示标签
    getSymptomLabel(value) {
      const symptom = this.symptomOptions.find(s => s.value === value)
      return symptom ? symptom.label : value
    }
  }
}
</script>

<style scoped>
/* ==================== 页面整体布局 ==================== */
.guide-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: var(--primary-color); /* 使用主题粉色变量 */
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

/* ==================== AI助手入口卡片 ==================== */
.ai-assistant-entry {
  max-width: 600px;
  margin: 0 auto 30px;
  cursor: pointer; /* 整块可点击 */
}

.assistant-card {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 紫色渐变背景 */
  border-radius: 60px; /* 大圆角胶囊形 */
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
}

.assistant-card:hover {
  transform: translateY(-3px); /* 悬浮上浮 */
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

/* 白色圆形图标容器 */
.assistant-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.assistant-icon i {
  font-size: 30px;
  color: #667eea; /* 与渐变背景呼应的紫色 */
}

.assistant-info {
  flex: 1; /* 文字区域自动填充 */
}

.assistant-info h3 {
  color: white;
  margin: 0 0 5px 0;
  font-size: 1.3rem;
}

.assistant-info p {
  color: rgba(255, 255, 255, 0.9); /* 白色半透明 */
  margin: 0;
  font-size: 0.95rem;
}

.assistant-arrow {
  color: white;
  font-size: 24px;
  opacity: 0.8;
}

/* ==================== AI助手弹窗 ==================== */
.ai-assistant-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* 确保在最上层 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 半透明遮罩 */
  backdrop-filter: blur(4px); /* 背景模糊效果 */
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 550px;
  max-height: 85vh; /* 限制高度，超出滚动 */
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease; /* 弹入动画 */
}

/* 弹窗弹出动画 */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95); /* 从上方缩小状态进入 */
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 与入口卡片统一 */
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-btn {
  width: 35px;
  height: 35px;
  border: none;
  background: rgba(255, 255, 255, 0.2); /* 半透明白底 */
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg); /* 悬浮旋转90度 */
}

.modal-body {
  padding: 25px;
  max-height: calc(85vh - 80px); /* 减去头部高度 */
  overflow-y: auto; /* 内容可滚动 */
}

/* ==================== 进度条 ==================== */
.progress-bar {
  height: 4px;
  background: #e0e0e0; /* 灰色底色 */
  border-radius: 2px;
  margin-bottom: 25px;
  overflow: hidden; /* 裁剪圆角溢出 */
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2); /* 紫色渐变进度 */
  border-radius: 2px;
  transition: width 0.3s ease; /* 进度变化动画 */
}

/* ==================== 问卷区域 ==================== */
.question-container {
  min-height: 300px; /* 最小高度，避免布局跳动 */
}

.question-text {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

/* ==================== 症状多选标签 ==================== */
.symptom-tags {
  display: flex;
  flex-wrap: wrap; /* 标签自动换行 */
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.symptom-tag {
  padding: 12px 18px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 40px; /* 胶囊形状 */
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
}

.symptom-tag i {
  color: #999;
  transition: color 0.3s;
}

.symptom-tag:hover {
  border-color: #667eea; /* 悬浮变紫色边框 */
  background: #f8f9ff;
}

.symptom-tag.selected {
  background: #667eea; /* 选中-紫色实心 */
  border-color: #667eea;
  color: white;
}

.symptom-tag.selected i {
  color: white; /* 选中时图标变白 */
}

/* ==================== 追问选项按钮 ==================== */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.option-btn {
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left; /* 文字左对齐 */
  color: #333;
}

.option-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateX(5px); /* 悬浮右移 */
}

/* ==================== 导航按钮 ==================== */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.nav-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 30px; /* 圆角胶囊按钮 */
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  background: #f0f0f0; /* 灰色-次要操作 */
  color: #666;
}

.back-btn:hover {
  background: #e0e0e0;
}

.next-btn {
  background: linear-gradient(135deg, #667eea, #764ba2); /* 紫色渐变-主操作 */
  color: white;
  margin-left: auto; /* 靠右对齐 */
}

.next-btn:hover:not(:disabled) {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.next-btn:disabled {
  opacity: 0.5; /* 禁用时半透明 */
  cursor: not-allowed;
}

/* ==================== 诊断结果 ==================== */
.diagnosis-result {
  animation: fadeIn 0.4s ease; /* 淡入动画 */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.result-header i {
  font-size: 32px;
}

.result-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

/* 不同疾病的渐变背景色 */
.result-catflu {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); /* 粉紫-猫鼻支 */
  color: white;
}

.result-stomatitis {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); /* 粉黄-口炎 */
  color: white;
}

.result-trauma {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); /* 浅粉-外伤 */
  color: #333;
}

.result-general {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); /* 蓝绿-通用 */
  color: #333;
}

.result-section {
  background: #f8f9fa; /* 浅灰背景分区 */
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 15px;
}

.result-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

/* 匹配症状标签 */
.symptom-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.matched-symptom {
  background: #667eea; /* 紫色小标签 */
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* 建议列表 */
.advice-list {
  margin: 0;
  padding: 0;
  list-style: none; /* 去除默认样式 */
}

.advice-list li {
  padding: 10px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0; /* 项目间分隔线 */
}

.advice-list li:last-child {
  border-bottom: none; /* 最后一项无底线 */
}

.advice-list i {
  color: #4caf50; /* 绿色对勾 */
  margin-top: 2px;
  flex-shrink: 0; /* 图标不缩放 */
}

/* 紧急提示-橙色强调 */
.emergency-note {
  background: #fff3e0; /* 浅橙背景 */
  border-left: 4px solid #ff9800; /* 左侧橙色粗边框 */
}

.emergency-note h4 {
  color: #e65100; /* 深橙色标题 */
}

.emergency-note i {
  color: #ff9800;
}

/* 结果操作按钮 */
.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.action-btn {
  flex: 1; /* 等宽分布 */
  padding: 14px;
  border: none;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.restart-btn {
  background: #f0f0f0; /* 灰色-重新诊断 */
  color: #666;
}

.restart-btn:hover {
  background: #e0e0e0;
}

.close-result-btn {
  background: linear-gradient(135deg, #667eea, #764ba2); /* 紫色-关闭 */
  color: white;
}

.close-result-btn:hover {
  transform: translateY(-2px); /* 悬浮上浮 */
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* ==================== 搜索模块 ==================== */
.search-container {
  max-width: 600px;
  margin: 0 auto 30px;
}

.search-box {
  position: relative; /* 为内部绝对定位图标提供参考 */
  width: 100%;
}

/* 搜索图标-绝对定位在左侧 */
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%); /* 垂直居中 */
  color: #999;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 15px 45px 15px 45px; /* 左右留出图标空间 */
  border: 2px solid #f0f0f0;
  border-radius: 50px; /* 圆角搜索框 */
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color); /* 聚焦-粉色边框 */
  box-shadow: 0 5px 20px rgba(255, 123, 139, 0.2); /* 粉色发光 */
}

.search-input::placeholder {
  color: #aaa; /* 占位符灰色 */
}

/* 清除按钮-绝对定位在右侧 */
.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
  font-size: 1rem;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: var(--primary-color); /* 悬浮变粉色 */
}

.search-stats {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

/* ==================== 无结果提示 ==================== */
.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.no-results i {
  font-size: 3rem;
  color: #ccc; /* 浅灰色大图标 */
  margin-bottom: 15px;
}

.no-results p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.reset-btn {
  background: var(--primary-color); /* 粉色重置按钮 */
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: #ff5c71; /* 悬浮加深 */
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 123, 139, 0.3);
}

/* ==================== 选项卡 ==================== */
.tabs-container {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee; /* 底部灰色分隔线 */
}

.tabs {
  display: flex;
  gap: 10px;
  max-width: max-content; /* 宽度由内容决定 */
  margin: 0 auto; /* 居中 */
}

.tab-btn {
  padding: 10px 25px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 30px; /* 圆角标签 */
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: var(--primary-color); /* 悬浮粉色文字 */
  background: rgba(255, 123, 139, 0.1); /* 浅粉背景 */
}

.tab-btn.active {
  color: white;
  background: var(--primary-color); /* 激活-粉色实心 */
  box-shadow: 0 5px 15px rgba(255, 123, 139, 0.3);
}

/* ==================== 指南卡片列表 ==================== */
.guide-list {
  display: grid;
  gap: 25px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  padding: 20px;
}

.guide-card:hover {
  transform: translateY(-5px); /* 悬浮上浮 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 紧急类卡片-红色左边框 */
.guide-card.emergency {
  border-left: 4px solid #ff4757; /* 红色警示边框 */
}

.card-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0; /* 标题与内容分隔 */
  display: flex;
  justify-content: space-between; /* 标题和分类标签左右分布 */
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  color: var(--dark-color);
  margin: 0;
  font-size: 1.2rem;
}

/* 分类标签-粉色圆角 */
.category-badge {
  background: var(--light-color);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.text-content {
  flex: 1; /* 文字区域主要占用空间 */
}

.guide-points {
  margin: 0;
  padding: 0;
}

.guide-points li {
  margin-bottom: 10px;
  padding-left: 5px;
  list-style-type: none; /* 去除默认列表样式 */
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.guide-points li:last-child {
  margin-bottom: 0;
}

.guide-points i {
  color: var(--primary-color); /* 列表图标粉色 */
  margin-top: 3px;
  flex-shrink: 0; /* 图标固定不缩放 */
}

/* 图片区域 */
.image-container {
  flex: 0 0 15%; /* 固定15%宽度 */
  min-width: 100px;
}

.guide-images {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guide-images img {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  cursor: default;
}

.guide-images img:hover {
  transform: scale(1.03); /* 悬浮微微放大 */
}

/* ==================== 响应式-平板端 ==================== */
@media (max-width: 900px) {
  .tabs {
    width: 100%;
    overflow-x: auto; /* 标签可横向滚动 */
    padding-bottom: 10px;
    justify-content: flex-start; /* 左对齐 */
  }
  
  .tab-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .content-wrapper {
    flex-direction: column; /* 图文上下排列 */
  }
  
  .image-container {
    width: 100%;
    margin-top: 20px;
  }
  
  .guide-images {
    flex-direction: row; /* 图片横向排列 */
    overflow-x: auto; /* 图片可横向滚动 */
    padding-bottom: 10px;
  }
  
  .guide-images img {
    width: auto;
    height: 120px; /* 固定高度 */
  }
  
  .search-container {
    padding: 0 15px;
  }
  
  .search-input {
    padding: 12px 40px 12px 40px;
    font-size: 0.95rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 80vh;
  }
  
  .symptom-tag {
    padding: 10px 14px; /* 缩小标签 */
    font-size: 0.85rem;
  }
}

/* ==================== 响应式-手机端 ==================== */
@media (max-width: 480px) {
  .assistant-card {
    padding: 15px 20px; /* 缩小内边距 */
  }
  
  .assistant-icon {
    width: 45px;
    height: 45px;
  }
  
  .assistant-icon i {
    font-size: 22px;
  }
  
  .assistant-info h3 {
    font-size: 1.1rem;
  }
  
  .assistant-info p {
    font-size: 0.8rem;
  }
  
  .modal-header h2 {
    font-size: 1.2rem;
  }
  
  .question-text {
    font-size: 1rem;
  }
}
</style>