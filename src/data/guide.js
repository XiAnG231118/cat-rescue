export const guideData = [
  {
    id: 1,
    category: "日常投喂",
    title: "流浪猫安全投喂指南",
    content: [
      "食物选择：专用猫粮为主，可搭配鸡胸肉、鱼肉",
      "禁忌食物：洋葱、大蒜、巧克力、葡萄、牛奶（多数猫乳糖不耐）",
      "喂食量：成年猫每天约50-70g猫粮，分早晚两次",
      "固定投喂：定时定点，避免猫咪养成依赖习惯"
    ],
    images: [
      require('@/assets/guide/feeding-safe1.jpg')
    ],
    emergency: false
  },
  {
    id: 2,
    category: "日常投喂",
    title: "四季流浪猫照料要点",
    content: [
      "冬季保暖：食物加温后投喂，使用双层碗防结冰，提供避风纸箱",
      "夏季防暑：确保充足饮水，食物放置阴凉处防止变质",
      "雨季防护：投喂点选择有遮蔽处，保持食物干燥",
      "换季注意：春秋季易发疾病，可适量添加维生素"
    ],
    images: [
      require('@/assets/guide/feeding-season1.jpg')
    ],
    emergency: false
  },
  {
    id: 3,
    category: "紧急救助",
    title: "常见外伤处理指南",
    content: [
      "评估现场：先观察环境是否安全再靠近猫咪",
      "止血处理：用无菌纱布按压伤口5-10分钟止血",
      "安全包裹：用毛巾或衣物包裹猫咪，避免挣扎抓伤",
      "立即送医：联系附近24小时宠物医院，尽快就医"
    ],
    images: [
      require('@/assets/guide/emergency-wound1.jpg')
    ],
    emergency: true
  },
  {
    id: 4,
    category: "紧急救助",
    title: "发现被困/幼猫处理指南",
    content: [
      "高处被困：使用梯子或长杆辅助，必要时拨打119求助",
      "管道被困：尝试用食物引诱，不要强行拉扯",
      "幼猫发现：先远距离观察2-4小时，确认母猫是否返回",
      "幼猫保温：用暖水袋或电热毯包裹毛巾后给幼猫取暖"
    ],
    images: [
      require('@/assets/guide/emergency-trap1.jpg')
    ],
    emergency: true
  },
  {
    id: 5,
    category: "医疗知识",
    title: "流浪猫驱虫与疫苗指南",
    content: [
      "驱虫周期：体外每月一次，体内每3个月一次",
      "驱虫药物：推荐大宠爱（内外同驱）、福来恩（体外专用）",
      "疫苗建议：猫三联（预防猫瘟、杯状病毒、疱疹病毒）",
      "注意事项：幼猫需满2月龄，病猫康复后再进行驱虫疫苗"
    ],
    images: [
      require('@/assets/guide/medical-deworm1.jpg')
    ],
    emergency: true
  },
  {
    id: 6,
    category: "医疗知识",
    title: "流浪猫常见病症识别",
    content: [
      "猫鼻支：打喷嚏、眼鼻分泌物、精神萎靡，传染性强",
      "口炎：流口水、口臭、拒食、牙龈红肿溃烂",
      "猫瘟：呕吐腹泻、高烧、不吃不喝，致死率高需立即隔离就医",
      "耳螨：频繁甩头抓耳、耳内有黑褐色分泌物"
    ],
    images: [
      require('@/assets/guide/medical-symptom1.jpg')
    ],
    emergency: true
  },
  {
    id: 7,
    category: "抓捕安全",
    title: "流浪猫安全抓捕技巧",
    content: [
      "工具准备：诱捕笼、防抓厚手套、航空箱、大浴巾",
      "诱捕方法：笼内放置罐头等气味浓烈食物，耐心等待",
      "徒手抓捕：从后方用浴巾快速包裹，控制四肢根部",
      "注意事项：切勿抓尾巴或直接拎后颈，易造成伤害"
    ],
    images: [
      require('@/assets/guide/catch-safe1.jpg')
    ],
    emergency: false
  },
  {
    id: 8,
    category: "抓捕安全",
    title: "TNR抓捕注意事项",
    content: [
      "TNR含义：诱捕-绝育-放归，控制流浪猫数量的科学方法",
      "术前禁食：抓捕后禁食8-12小时，禁水4小时",
      "术后护理：公猫观察24小时，母猫观察48-72小时后放归",
      "耳标标识：绝育后剪耳尖标记，避免重复抓捕"
    ],
    images: [
      require('@/assets/guide/catch-tnr1.jpg')
    ],
    emergency: false
  }
]