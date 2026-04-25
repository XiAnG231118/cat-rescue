export const catList = [
  {
    id: 1,
    name: "橘胖",
    gender: "公",
    age: "1岁",
    weight: "5.2kg",
    color: "橘色",
    personality: "贪吃黏人",
    health: "已绝育",
    story: "在食堂后门捡到的，特别爱吃，是食堂的常客，每天准时出现等待投喂。性格温顺，喜欢被摸头和下巴，是校园里最受欢迎的猫咪之一。",
    habits: [
      { emoji: '⏰', text: '每天18:00食堂准时出现' },
      { emoji: '🏠', text: '常驻食堂后门附近' },
      { emoji: '🍗', text: '最爱鱼味猫条和猫粮' },
      { emoji: '😺', text: '喜欢被摸头和下巴' }
    ],
    healthRecords: {
      '绝育状态': '已绝育',
      '疫苗接种': '已完成三联疫苗',
      '驱虫情况': '每月定期驱虫',
      '最近体检': '2023-10-10 一切正常'
    },
    images: [
      require('@/assets/cats/orange1.jpg'),
      require('@/assets/cats/orange2.jpg')
    ]
  },
  {
    id: 2,
    name: "小黑",
    gender: "母",
    age: "2岁",
    weight: "3.8kg",
    color: "纯黑色",
    personality: "高冷警惕",
    health: "已驱虫",
    story: "图书馆常驻猫，不喜欢被摸但会跟着人走。白天喜欢在图书馆窗台晒太阳睡觉，晚上会在校园里巡逻，是图书馆的守护猫。",
    habits: [
      { emoji: '📚', text: '图书馆窗台常驻' },
      { emoji: '🌙', text: '晚上会巡逻校园' },
      { emoji: '🐟', text: '偏爱鱼肉味零食' },
      { emoji: '🚫', text: '不喜欢被抱，允许轻抚' }
    ],
    healthRecords: {
      '绝育状态': '未绝育',
      '疫苗接种': '已接种狂犬疫苗',
      '驱虫情况': '上月已完成体内外驱虫',
      '最近体检': '2023-09-20 健康状况良好'
    },
    images: [
      require('@/assets/cats/black1.jpg')
    ]
  },
  {
    id: 3,
    name: "狸花",
    gender: "公",
    age: "2.5岁",
    weight: "4.5kg",
    color: "狸花斑纹",
    personality: "温顺黏人",
    health: "已绝育，已驱虫",
    story: "教5常驻猫，喜欢与人亲近，主动蹭人。性格非常温顺，喜欢被抱着走路，是教学区的明星猫咪，深受师生喜爱。",
    habits: [
      { emoji: '🏫', text: '常在教5号附近活动' },
      { emoji: '☀️', text: '喜欢在阳光下睡觉' },
      { emoji: '🍖', text: '喜欢吃鸡肉干' },
      { emoji: '🤗', text: '喜欢被抱着走路' }
    ],
    healthRecords: {
      '绝育状态': '已绝育',
      '疫苗接种': '已完成全套疫苗',
      '驱虫情况': '每月定期驱虫',
      '最近体检': '2023-10-05 非常健康'
    },
    images: [
      require('@/assets/cats/tabby1.jpg')
    ]
  },
  {
    id: 4,
    name: "三花",
    gender: "母",
    age: "1.5岁",
    weight: "3.5kg",
    color: "三色（黑白橘）",
    personality: "聪明机灵",
    health: "已驱虫",
    story: "诚信公寓常驻猫，喜欢互动，会主动和人玩耍。非常聪明，能听懂自己的名字，喜欢玩小球和羽毛玩具。",
    habits: [
      { emoji: '🏘️', text: '常在诚信公寓门口等待' },
      { emoji: '🎮', text: '会玩小球和羽毛玩具' },
      { emoji: '🍤', text: '最爱虾仁味零食' },
      { emoji: '🎯', text: '会和人玩躲猫猫' }
    ],
    healthRecords: {
      '绝育状态': '已绝育',
      '疫苗接种': '已完成基础疫苗',
      '驱虫情况': '每两个月驱虫一次',
      '最近体检': '2023-09-28 一切正常'
    },
    images: [
      require('@/assets/cats/calico1.jpg')
    ]
  },
  {
    id: 5,
    name: "星星",
    gender: "母",
    age: "1岁",
    weight: "3.2kg",
    color: "黑色橘斑",
    personality: "活泼粘人",
    health: "已绝育，已驱虫",
    story: "教学楼旁的小流浪，眼睛像星星一样亮，一开始见人就躲，在同学们的耐心投喂下，现在会主动蹭经常喂她的同学，性格变得非常温柔。",
    habits: [
      { emoji: '🏢', text: '在教学楼B座附近活动' },
      { emoji: '🌟', text: '眼睛特别明亮像星星' },
      { emoji: '🥛', text: '喜欢喝羊奶' },
      { emoji: '💕', text: '对熟悉的同学会翻肚皮' }
    ],
    healthRecords: {
      '绝育状态': '已绝育',
      '疫苗接种': '已完成全套免疫',
      '驱虫情况': '每月定期驱虫',
      '最近体检': '2023-10-08 恢复良好'
    },
    images: [
      require('@/assets/cats/star1.jpg'),
      require('@/assets/cats/star2.jpg')
    ]
  },
  {
    id: 6,
    name: "丧彪",
    gender: "公",
    age: "3.5岁",
    weight: "5.8kg",
    color: "灰黑色虎斑",
    personality: "独立暖心",
    health: "已绝育，轻微耳螨（治疗中）",
    story: "名字和性格反差萌，看起来凶巴巴的，但从不主动伤人。会把喜欢的玩具叼给投喂者，是校园里的暖心大个子。",
    habits: [
      { emoji: '⚔️', text: '外表凶悍但从不攻击人' },
      { emoji: '🎁', text: '会叼玩具送给投喂者' },
      { emoji: '🏗️', text: '常在学校工地附近' },
      { emoji: '💊', text: '需要定期滴耳药' }
    ],
    healthRecords: {
      '绝育状态': '已绝育',
      '疫苗接种': '已完成基础疫苗',
      '驱虫情况': '正在治疗耳螨中',
      '最近体检': '2023-10-12 耳螨治疗中',
      '治疗情况': '每日需要滴耳药水'
    },
    images: [
      require('@/assets/cats/sangbiao1.jpg'),
      require('@/assets/cats/sangbiao2.jpg')
    ]
  }
]