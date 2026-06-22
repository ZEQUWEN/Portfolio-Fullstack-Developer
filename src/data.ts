import { Project, Skill, Review } from './types';

export const initialProjects: Project[] = [
  {
    id: 'mal-o',
    title: 'MalO',
    shortDescription: 'Ваш личный AI-ассистент с характером.',
    shortDescriptionEn: 'Your personal AI assistant with a character.',
    description: 'Что это?\nУмный виртуальный помощник с ярко выраженной индивидуальностью, живущий в вашем устройстве.\n\nЗачем это?\nДля автоматизации рутины, быстрого поиска информации и просто приятного общения в ретро-эстетике.\n\nЧто умеет?\nГенерировать изображения по описанию, анализировать текстовые и графические файлы, а также отвечать на голосовые сообщения, имитируя живой диалог.',
    descriptionEn: 'What is it?\nA smart virtual assistant with a distinct personality living in your device.\n\nWhy?\nTo automate routines, rapidly search for information, and have a pleasant chat in a retro aesthetic.\n\nWhat can it do?\nGenerate images from text, analyze text and image files, and reply to voice messages, mimicking a real conversation.',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
    tags: 'AI, Ассистент',
    tagsEn: 'AI, Assistant',
  },
  {
    id: 'nodex',
    title: 'NodeX',
    shortDescription: 'Элегантная система управления проектами.',
    shortDescriptionEn: 'Elegant project management system.',
    description: 'Что это?\nМинималистичная и быстрая платформа для координации персональных и командных задач.\n\nЗачем это?\nЧтобы избавиться от хаоса в делах, сфокусироваться на главном и наглядно видеть свой прогресс.\n\nЧто умеет?\nСоздавать доски, устанавливать приоритеты, отслеживать время и выстраивать задачи в виде связного графа.',
    descriptionEn: 'What is it?\nA minimalist and fast platform for coordinating personal and team tasks.\n\nWhy?\nTo eliminate chaos in tasks, focus on what matters, and visually track your progress.\n\nWhat can it do?\nCreate boards, set priorities, track time, and build tasks as an interconnected graph.',
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80',
    tags: 'Продуктивность',
    tagsEn: 'Productivity',
  },
  {
    id: 'mystery',
    title: 'L\'Énigme',
    shortDescription: 'Интерактивная текстовая игра.',
    shortDescriptionEn: 'Interactive text-based game.',
    description: 'Что это?\nЗахватывающее ролевое приключение в формате интерактивной книги с нелинейным повествованием.\n\nЗачем это?\nДля погружения в таинственную атмосферу старинных детективов и тренировки дедуктивного мышления.\n\nЧто умеет?\nПодстраивать ход сюжета под ваши решения, сохранять инвентарь и генерировать уникальные ветки диалогов.',
    descriptionEn: 'What is it?\nA thrilling role-playing adventure in an interactive book format with non-linear storytelling.\n\nWhy?\nTo immerse in the mysterious atmosphere of old detective stories and train deductive reasoning.\n\nWhat can it do?\nAdapt the plot to your decisions, track inventory, and generate unique dialogue branches.',
    imageUrl: 'https://images.unsplash.com/photo-1587691592099-24045742c181?w=800&q=80',
    tags: 'Игра',
    tagsEn: 'Game',
  }
];

export const initialSkills: Skill[] = [
  { id: '1', name: 'Java/Kotlin', category: 'Backend & Mobile', categoryEn: 'Backend & Mobile', level: 90 },
  { id: '2', name: 'Python', category: 'Backend & Logic', categoryEn: 'Backend & Logic', level: 85 },
  { id: '3', name: 'Go / C# / C++', category: 'Backend & Logic', categoryEn: 'Backend & Logic', level: 75 },
  { id: '4', name: 'TS/React', category: 'Frontend', categoryEn: 'Frontend', level: 90 },
  { id: '5', name: 'Flutter', category: 'Мобильная', categoryEn: 'Mobile', level: 80 },
  { id: '6', name: 'SQL/MongoDB', category: 'Базы данных', categoryEn: 'Databases', level: 85 },
  { id: '7', name: 'REST API & Webhooks', category: 'Интеграции', categoryEn: 'Integrations', level: 95 },
  { id: '8', name: 'Claude Opus / Copilot', category: 'AI Инструменты', categoryEn: 'AI Tools', level: 95 },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Виктория',
    authorEn: 'Victoria',
    role: 'Арт-директор',
    roleEn: 'Art Director',
    text: 'Работы Александра отличаются удивительным вниманием к деталям. Каждый проект словно пропитан духом времени, сохраняя при этом современную функциональность.',
    textEn: 'Alexander\'s works stand out with surprising attention to detail. Every project feels imbued with the spirit of time, while retaining modern functionality.',
    link: 'https://linkedin.com'
  },
  {
    id: 'r2',
    author: 'Михаил',
    authorEn: 'Mikhail',
    role: 'Инженер-архитектор',
    roleEn: 'Architect Engineer',
    text: 'Редкое сочетание технической грамотности и тонкого эстетического вкуса. Интерфейсы, созданные им, не просто работают — они рассказывают историю.',
    textEn: 'A rare combination of technical literacy and subtle aesthetic taste. The interfaces he creates don\'t just work — they tell a story.',
  }
];

export const initialContactSettings: import('./types').ContactSettings = {
  email: 'sasha.naugoln@gmail.com',
  github: 'https://github.com',
  telegram: 'https://t.me/CreepsyDear',
  vk: 'https://vk.com',
  facebook: 'https://facebook.com',
};

export const initialSiteContent: import('./types').SiteContent = {
  heroName: 'Александр',
  heroNameEn: 'Alexander',
  heroRole: 'Full-Stack Developer & Vibe Coder',
  heroRoleEn: 'Full-Stack Developer & Vibe Coder',
  heroSubtitle: 'Возраст: 21 год | Город: Киров',
  heroSubtitleEn: 'Age: 21 | City: Kirov',
  heroIntro: 'Разработчик с 4-летним опытом коммерческой и исследовательской разработки. Специализируюсь на создании высоконагруженных Telegram-ботов, нативных мобильных приложений и корпоративных лендингов.\n\nМой подход основан на агентном кодинге с использованием передовых ИИ-инструментов (Claude Opus, SOTA-модели), что позволяет мне в 2-3 раза ускорять цикл разработки без потери качества кода. Предлагаю комплексные решения «под ключ»: от прототипирования интерфейса до интеграции банковских эквайрингов и поддержки.',
  heroIntroEn: 'A developer with 4 years of commercial and research development experience. I specialize in building highly-loaded Telegram bots, native mobile applications, and corporate landing pages.\n\nMy approach is based on agent-based coding using advanced AI tools (Claude Opus, SOTA models), allowing me to accelerate the development cycle 2-3 times without losing code quality. I offer turnkey complex solutions: from UI prototyping to bank acquiring integrations and technical support.',
  skillsClass: "Стек",
  skillsClassEn: "Stack",
  skillsTitle: "Ключевые компетенции",
  skillsTitleEn: "Key Competencies",
  projectsClass: "Кейсы",
  projectsClassEn: "Cases",
  projectsTitle: "Портфолио",
  projectsTitleEn: "Portfolio",
  contactClass: "Связь",
  contactClassEn: "Contact",
  contactTitle: "Контактная информация",
  contactTitleEn: "Contact Information",
  contactIntro: "Готовность к работе: Полная занятость / Проектная работа\nГеография: Киров (ищу удаленную работу)\nГарантирую прозрачность этапов разработки, соблюдение дедлайнов и техподдержку проекта после сдачи.",
  contactIntroEn: "Availability: Full-time / Project work\nLocation: Kirov (looking for remote work)\nI guarantee transparency of development stages, adherence to deadlines, and technical support of the project after delivery.",
  methodologyClass: "Методика",
  methodologyClassEn: "Methodology",
  methodologyTitle: "Коммерческие направления разработки",
  methodologyTitleEn: "Commercial Development Areas",
  methodologyChapters: [
    {
      id: 'tg-bots',
      iconName: 'MessageSquare',
      title: 'Telegram-боты и автоматизация бизнеса',
      titleEn: 'Telegram Bots & Business Automation',
      subtitle: 'Кастомные боты для малого и среднего бизнеса.',
      subtitleEn: 'Custom bots for small and medium businesses.',
      content: 'Реализую сложную логику цепочек сообщений, инлайн-клавиатуры, рассылки и админ-панели. Особое внимание уделяю стабильности работы при высоких нагрузках.',
      contentEn: 'I implement complex message chain logic, inline keyboards, mailings, and admin panels. I pay special attention to stability under high loads.'
    },
    {
      id: 'android',
      iconName: 'Smartphone',
      title: 'Нативные Android-приложения',
      titleEn: 'Native Android Applications',
      subtitle: 'Приложения на Kotlin/Java с акцентом на производительность.',
      subtitleEn: 'Kotlin/Java apps focusing on performance.',
      content: 'Проектирую архитектуру (MVVM/MVP), интегрирую внешние сервисы и обеспечиваю совместимость с широким спектром устройств.',
      contentEn: 'I design architecture (MVVM/MVP), integrate external services, and ensure compatibility with a wide range of devices.'
    },
    {
      id: 'landings',
      iconName: 'Layout',
      title: 'Лендинги и корпоративные сайты',
      titleEn: 'Landings & Corporate Sites',
      subtitle: 'Быстрая разработка одностраничных сайтов.',
      subtitleEn: 'Rapid development of single-page sites.',
      content: 'Разработка по готовым макетам или брифу. Использую React для интерактивности и адаптивную верстку, гарантирующую корректное отображение на всех девайсах.',
      contentEn: 'Development from provided mockups or brief. I use React for interactivity and responsive layout, guaranteeing perfect display across all devices.'
    },
    {
      id: 'ui',
      iconName: 'PenTool',
      title: 'UX/UI Дизайн «под заказчика»',
      titleEn: 'Tailored UX/UI Design',
      subtitle: 'Проектирование пользовательского пути.',
      subtitleEn: 'User journey design mapping.',
      content: 'Не просто верстаю, а учитываю требования бизнеса. Создаю интуитивные интерфейсы и кастомизирую дизайн с учетом поведенческих паттернов целевой аудитории.',
      contentEn: 'Not just slicing layouts, I consider business requirements. I craft intuitive interfaces and customize designs considering the behavioral patterns of the target audience.'
    },
    {
      id: 'payments',
      iconName: 'CreditCard',
      title: 'Работа с платежными системами',
      titleEn: 'Payment Systems Integration',
      subtitle: 'Успешный опыт интеграции эквайринга.',
      subtitleEn: 'Successful experience in acquiring integration.',
      content: 'Подключение через API банков-партнеров, настройка онлайн-касс (54-ФЗ), безопасное хранение токенов и обработка webhooks с гарантией транзакций.',
      contentEn: 'Connecting via banking APIs, configuring online cash registers, securely storing tokens and handling webhooks securing transaction confirmations.'
    }
  ]
};
