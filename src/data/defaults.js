// 菜品分类标签
export const DISH_CATEGORIES = ['荤菜', '素菜', '汤品', '主食', '凉菜', '其他']

// 默认菜品(含备料清单与烹饪步骤)
// ingredients: [{ name, amount, unit }] 备料及用量
// steps: string[] 炒菜步骤,按顺序执行
export const DEFAULT_DISHES = [
  {
    id: 'd1',
    name: '番茄炒蛋',
    category: '素菜',
    ingredients: [
      { name: '番茄', amount: 2, unit: '个' },
      { name: '鸡蛋', amount: 3, unit: '个' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '糖', amount: 1, unit: '小勺' },
      { name: '葱花', amount: 1, unit: '把' }
    ],
    steps: [
      '番茄洗净切块,鸡蛋打散加少许盐',
      '热锅冷油,倒入蛋液翻炒至凝固盛出',
      '锅中下番茄翻炒出汁,加糖盐调味',
      '倒回鸡蛋翻炒均匀,撒葱花出锅'
    ]
  },
  {
    id: 'd2',
    name: '青椒土豆丝',
    category: '素菜',
    ingredients: [
      { name: '土豆', amount: 2, unit: '个' },
      { name: '青椒', amount: 1, unit: '个' },
      { name: '蒜末', amount: 2, unit: '瓣' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '香醋', amount: 1, unit: '小勺' }
    ],
    steps: [
      '土豆去皮切细丝,泡水洗去淀粉沥干',
      '青椒去籽切细丝,蒜切末',
      '热油锅爆香蒜末,下土豆丝大火翻炒',
      '加青椒丝同炒,沿锅边淋醋,加盐调味即可'
    ]
  },
  {
    id: 'd3',
    name: '红烧肉',
    category: '荤菜',
    ingredients: [
      { name: '五花肉', amount: 500, unit: '克' },
      { name: '冰糖', amount: 30, unit: '克' },
      { name: '生抽', amount: 2, unit: '大勺' },
      { name: '老抽', amount: 1, unit: '大勺' },
      { name: '料酒', amount: 2, unit: '大勺' },
      { name: '葱姜', amount: 1, unit: '把' }
    ],
    steps: [
      '五花肉切方块,冷水下锅焯水去血沫',
      '热锅小火炒冰糖至焦糖色',
      '下肉块翻炒上色,加葱姜料酒',
      '加生抽老抽与热水没过肉块',
      '大火烧开转小火炖 40 分钟,收汁出锅'
    ]
  },
  {
    id: 'd4',
    name: '番茄炖牛腩',
    category: '荤菜',
    ingredients: [
      { name: '牛腩', amount: 600, unit: '克' },
      { name: '番茄', amount: 4, unit: '个' },
      { name: '洋葱', amount: 1, unit: '个' },
      { name: '番茄酱', amount: 2, unit: '大勺' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '姜片', amount: 3, unit: '片' }
    ],
    steps: [
      '牛腩切块焯水,番茄切块,洋葱切丝',
      '热油锅炒香洋葱与姜片',
      '下牛腩翻炒,加番茄酱炒匀',
      '加足量热水,大火烧开转小火炖 1 小时',
      '加番茄块继续炖 20 分钟,加盐收汁'
    ]
  },
  {
    id: 'd5',
    name: '蒜蓉空心菜',
    category: '素菜',
    ingredients: [
      { name: '空心菜', amount: 1, unit: '把' },
      { name: '蒜末', amount: 4, unit: '瓣' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '食用油', amount: 2, unit: '大勺' }
    ],
    steps: [
      '空心菜洗净掐段,蒜切末',
      '热油锅爆香蒜末',
      '下空心菜大火快炒',
      '加盐调味,断生即可出锅'
    ]
  },
  {
    id: 'd6',
    name: '紫菜蛋花汤',
    category: '汤品',
    ingredients: [
      { name: '紫菜', amount: 1, unit: '把' },
      { name: '鸡蛋', amount: 2, unit: '个' },
      { name: '葱花', amount: 1, unit: '把' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '香油', amount: 1, unit: '小勺' }
    ],
    steps: [
      '紫菜泡水洗净,鸡蛋打散',
      '锅中加水烧开,下紫菜',
      '画圈淋入蛋液,等蛋花浮起',
      '加盐与香油调味,撒葱花出锅'
    ]
  },
  {
    id: 'd7',
    name: '蛋炒饭',
    category: '主食',
    ingredients: [
      { name: '隔夜米饭', amount: 2, unit: '碗' },
      { name: '鸡蛋', amount: 3, unit: '个' },
      { name: '葱花', amount: 2, unit: '把' },
      { name: '盐', amount: 1, unit: '小勺' },
      { name: '食用油', amount: 2, unit: '大勺' }
    ],
    steps: [
      '鸡蛋打散加少许盐,米饭抓散',
      '热油锅倒入蛋液,半凝固时下米饭',
      '大火快速翻炒,把米饭炒散炒干',
      '加盐调味,撒葱花炒匀出锅'
    ]
  },
  {
    id: 'd8',
    name: '凉拌黄瓜',
    category: '凉菜',
    ingredients: [
      { name: '黄瓜', amount: 2, unit: '根' },
      { name: '蒜末', amount: 3, unit: '瓣' },
      { name: '生抽', amount: 1, unit: '大勺' },
      { name: '香醋', amount: 1, unit: '大勺' },
      { name: '香油', amount: 1, unit: '小勺' },
      { name: '白糖', amount: 1, unit: '小勺' }
    ],
    steps: [
      '黄瓜洗净拍裂,切小段',
      '加盐腌制 10 分钟,倒掉多余水分',
      '加蒜末、生抽、香醋、糖、香油拌匀',
      '冷藏 15 分钟更入味'
    ]
  }
]
