// src/utils/storage.js
class StoryStorage {
  constructor() {
    this.dbName = 'CatCommunityDB'
    this.storeName = 'stories'
    this.version = 2 // 增加版本号
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        // 如果已存在旧表，删除重建
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName)
        }
        // 创建新的对象存储
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
        store.createIndex('time', 'time', { unique: false })
        store.createIndex('catId', 'catId', { unique: false })
        store.createIndex('tag', 'tag', { unique: false })
      }
    })
  }

  // 清理对象，使其可以被 IndexedDB 克隆
  sanitizeStory(story) {
    // 创建一个纯净的可克隆对象
    const cleanStory = {
      id: story.id,
      content: story.content || '',
      likes: story.likes || 0,
      liked: story.liked || false,
      comments: Array.isArray(story.comments) ? [...story.comments] : [],
      time: story.time || '刚刚',
      catId: story.catId || null,
      tag: story.tag || 'story',
      username: story.username || '校园爱猫人',
      images: Array.isArray(story.images) ? [...story.images] : []
    }
    
    return cleanStory
  }

  async saveStories(stories) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      // 清除旧数据
      const clearRequest = store.clear()
      
      clearRequest.onsuccess = () => {
        if (!stories || stories.length === 0) {
          resolve()
          return
        }
        
        // 使用普通 for 循环代替 forEach，避免异步问题
        let completed = 0
        const total = stories.length
        
        for (let i = 0; i < stories.length; i++) {
          const story = stories[i]
          // 清理每个故事对象
          const cleanStory = this.sanitizeStory(story)
          
          const addRequest = store.add(cleanStory)
          
          addRequest.onsuccess = () => {
            completed++
            if (completed === total) {
              resolve()
            }
          }
          
          addRequest.onerror = (e) => {
            console.error('添加故事失败', e, cleanStory)
            completed++
            if (completed === total) {
              // 即使有错误也继续，但记录错误
              console.warn('部分故事保存失败')
              resolve()
            }
          }
        }
      }
      
      clearRequest.onerror = (e) => {
        console.error('清除数据失败', e)
        reject(clearRequest.error)
      }
      
      transaction.onerror = (e) => {
        console.error('事务失败', e)
        reject(transaction.error)
      }
    })
  }

  async loadStories() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()
      
      request.onsuccess = () => {
        const stories = request.result || []
        // 按 id 倒序排列（最新的在前）
        stories.sort((a, b) => b.id - a.id)
        resolve(stories)
      }
      
      request.onerror = () => {
        console.error('加载数据失败', request.error)
        reject(request.error)
      }
    })
  }

  async deleteStory(storyId) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(storyId)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getStoriesByCatId(catId) {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('catId')
      const request = index.getAll(catId)
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async clearAll() {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export default new StoryStorage()