export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl: string;
  link?: string;
  tags?: string;
  tagsEn?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  categoryEn: string;
  level?: number;
}

export interface Review {
  id: string;
  author: string;
  authorEn?: string;
  role: string;
  roleEn?: string;
  text: string;
  textEn: string;
  link?: string;
  rating?: number;
  photoUrl?: string;
}

export interface ContactSettings {
  email: string;
  github: string;
  telegram: string;
  vk: string;
  facebook: string;
}

export interface InteractiveStoryChapter {
  id: string;
  iconName: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  content: string;
  contentEn: string;
}

export interface SiteContent {
  heroName: string;
  heroNameEn: string;
  heroRole: string;
  heroRoleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  heroIntro: string;
  heroIntroEn: string;
  skillsClass: string;
  skillsClassEn: string;
  skillsTitle: string;
  skillsTitleEn: string;
  projectsClass: string;
  projectsClassEn: string;
  projectsTitle: string;
  projectsTitleEn: string;
  contactClass: string;
  contactClassEn: string;
  contactTitle: string;
  contactTitleEn: string;
  contactIntro: string;
  contactIntroEn: string;
  methodologyClass: string;
  methodologyClassEn: string;
  methodologyTitle: string;
  methodologyTitleEn: string;
  methodologyChapters: InteractiveStoryChapter[];
}

