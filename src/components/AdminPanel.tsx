import React, { useState, useRef } from 'react';
import { Project, ContactSettings, SiteContent, Skill, Review } from '../types';
import { X, Lock, Plus, Upload, Trash2, Edit2, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../i18n';
import { ProjectMedia } from './ProjectMedia';
import { WaxSeal } from './WaxSeal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AdminPanelProps {
  projects: Project[];
  skills: Skill[];
  reviews: Review[];
  contactSettings: ContactSettings;
  siteContent: SiteContent;
  onAddProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onUpdateContacts: (c: ContactSettings) => void;
  onUpdateSiteContent: (sc: SiteContent) => void;
  onAddSkill: (s: Skill) => void;
  onDeleteSkill: (id: string) => void;
  onAddReview: (r: Review) => void;
  onDeleteReview: (id: string) => void;
  onResetDefaults: () => void;
  lastUpdated?: string | null;
  lang?: Language;
}

export function AdminPanel({ projects, skills, reviews, contactSettings, siteContent, lastUpdated, onAddProject, onUpdateProject, onDeleteProject, onUpdateContacts, onUpdateSiteContent, onAddSkill, onDeleteSkill, onAddReview, onDeleteReview, onResetDefaults, lang = 'ru' }: AdminPanelProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'reviews' | 'contacts' | 'content' | 'system'>('projects');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'json' | 'pdf' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewPhotoInputRef = useRef<HTMLInputElement>(null);
  const t = (key: keyof typeof translations['ru']) => translations[lang][key] || key;

  const initialFormState: Partial<Project> = {
    title: '', titleEn: '',
    shortDescription: '', shortDescriptionEn: '',
    description: '', descriptionEn: '',
    imageUrl: '', link: '', tags: '', tagsEn: ''
  };

  const initialSkillFormState: Partial<Skill> = {
    name: '', category: '', categoryEn: ''
  };

  const initialReviewFormState: Partial<Review> = {
    author: '', authorEn: '', role: '', roleEn: '', text: '', textEn: '', rating: 5, photoUrl: ''
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialFormState);
  const [skillFormData, setSkillFormData] = useState<Partial<Skill>>(initialSkillFormState);
  const [reviewFormData, setReviewFormData] = useState<Partial<Review>>(initialReviewFormState);
  const [contactsData, setContactsData] = useState<ContactSettings>(contactSettings);
  const [contentData, setContentData] = useState<SiteContent>(siteContent);
  const [draftContent, setDraftContent] = useState<SiteContent | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  React.useEffect(() => {
    const draft = localStorage.getItem('vintage_draft_content');
    if (draft) {
      try {
        setDraftContent(JSON.parse(draft));
      } catch (e) {
        console.error("Error parsing draft content", e);
      }
    }
  }, []);

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('vintage_draft_content', JSON.stringify(contentData));
    setDraftContent(contentData);
    showToast(lang === 'ru' ? 'Черновик сохранен' : 'Draft saved');
  };

  const handleLoadDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    if (draftContent) {
      setContentData(draftContent);
      showToast(lang === 'ru' ? 'Черновик загружен' : 'Draft loaded');
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'NodeX2026') setUnlocked(true);
    else alert(lang === 'ru' ? 'Неверный пароль' : 'Invalid password');
    setPassword('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setFormData(prev => ({ ...prev, imageUrl: ev.target!.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription || !formData.description) {
      showToast(lang === 'ru' ? 'Заполните обязательные поля' : 'Fill required fields');
      return;
    }
    
    if (editingId) {
      onUpdateProject({ ...formData, id: editingId } as Project);
      setEditingId(null);
      showToast(lang === 'ru' ? 'Проект был обновлён' : 'Project updated');
    } else {
      const newProject: Project = {
        ...(formData as Project),
        id: Date.now().toString(),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1544830250-1f2db8935c13?w=800&q=80',
      };
      onAddProject(newProject);
      showToast(lang === 'ru' ? 'Новый проект добавлен' : 'New project added');
    }
    setFormData(initialFormState);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillFormData.name || !skillFormData.category) {
      showToast(lang === 'ru' ? 'Заполните обязательные поля (Название и Категория)' : 'Fill required fields (Name & Category)');
      return;
    }
    const newSkill: Skill = {
      ...(skillFormData as Skill),
      id: Date.now().toString()
    };
    onAddSkill(newSkill);
    showToast(lang === 'ru' ? 'Навык был добавлен' : 'Skill added');
    setSkillFormData(initialSkillFormState);
  };

  const handleReviewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setReviewFormData(prev => ({ ...prev, photoUrl: ev.target!.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormData.author || !reviewFormData.text) {
      showToast(lang === 'ru' ? 'Заполните обязательные поля (Автор и Текст)' : 'Fill required fields (Author & Text)');
      return;
    }
    const newReview: Review = {
      ...(reviewFormData as Review),
      id: Date.now().toString()
    };
    onAddReview(newReview);
    showToast(lang === 'ru' ? 'Отзыв был добавлен' : 'Review added');
    setReviewFormData(initialReviewFormState);
  };

  const handleContactsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContacts(contactsData);
    showToast(lang === 'ru' ? 'Изменения успешно запечатлены' : 'Changes successfully imprinted');
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent(contentData);
    showToast(lang === 'ru' ? 'Сведения успешно переданы и сохранены на сервере базы данных' : 'Records successfully dispatched and recorded onto the database server');
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setFormData({ ...p });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleExportJson = () => {
    const data = JSON.stringify({ projects, contactSettings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) {
      setIsOpen(false);
      setTimeout(() => {
          window.print();
      }, 500);
      return;
    }
    
    try {
      showToast(lang === 'ru' ? 'Генерация PDF...' : 'Generating PDF...');
      const canvas = await html2canvas(input, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // If it's too long, it will overflow one page. A4 proportion is fine for a 1-pager summary.
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`portfolio_cv_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error(err);
      showToast(lang === 'ru' ? 'Ошибка генерации PDF' : 'Error generating PDF');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 p-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-ink/30 hover:text-ink transition-colors p-2 bg-parchment/60 rounded-full shadow-sm"
          title="Admin"
        >
          <Lock size={16} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-parchment-dark w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative vintage-border"
            >
              <div className="p-4 md:p-6 border-b border-ink/20 flex justify-between items-center bg-parchment">
                <h3 className="font-serif text-2xl md:text-3xl text-ink font-light">{t('adminTitle')}</h3>
                <button onClick={() => setIsOpen(false)} className="text-ink/60 hover:text-ink p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center">
                {!unlocked ? (
                  <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-6 flex flex-col items-center mt-20">
                    <Lock size={48} className="text-ink/20 mb-4" strokeWidth={1} />
                    <p className="font-serif italic text-lg">{t('adminKeyMsg')}</p>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink text-center tracking-widest font-mono"
                      placeholder={t('adminPassPlaceholder')}
                      autoFocus
                    />
                    <button type="submit" className="w-full border border-ink py-3 hover:bg-ink hover:text-parchment transition-colors font-serif uppercase tracking-widest text-xs font-bold">
                      {t('adminUnlockBtn')}
                    </button>
                  </form>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    
                    {/* Tabs Navigation */}
                    <div className="w-full flex justify-center gap-6 border-b border-ink/20 pb-4 mb-8 flex-wrap">
                      <button 
                         onClick={() => setActiveTab('projects')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'projects' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {t('adminTabProjects')}
                      </button>
                      <button 
                         onClick={() => setActiveTab('skills')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'skills' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {lang === 'ru' ? 'Ключевые навыки' : 'Key Skills'}
                      </button>
                      <button 
                         onClick={() => setActiveTab('reviews')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'reviews' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {lang === 'ru' ? 'Отзывы' : 'Reviews'}
                      </button>
                      <button 
                         onClick={() => setActiveTab('contacts')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'contacts' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {t('adminTabContacts')}
                      </button>
                      <button 
                         onClick={() => setActiveTab('content')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'content' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {t('adminTabContent')}
                      </button>
                      <button 
                         onClick={() => setActiveTab('system')}
                         className={`font-serif text-lg tracking-widest transition-colors ${activeTab === 'system' ? 'text-ink font-bold' : 'text-ink/60 hover:text-ink'}`}
                      >
                         {t('adminTabSystem')}
                      </button>
                    </div>

                    {activeTab === 'projects' && (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT COL: FORM */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2">
                            {editingId ? t('adminEditBtn') : t('adminAddNew')}
                          </h4>
                          <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={`${t('adminTitleLabel')} (RU)`} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                              <input placeholder="Title (EN)" value={formData.titleEn || ''} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={`${t('adminShortDescLabel')} (RU)`} value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                              <input placeholder="Short Description (EN)" value={formData.shortDescriptionEn || ''} onChange={e => setFormData({...formData, shortDescriptionEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                            </div>
                            <textarea required placeholder={`${t('adminDescLabel')} (RU)`} rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink resize-none placeholder:text-ink/40" />
                            <textarea placeholder="Full Description (EN)" rows={4} value={formData.descriptionEn || ''} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink resize-none placeholder:text-ink/40" />
                            
                            <div className="flex gap-4 items-end">
                              <div className="flex-1">
                                <input placeholder={t('adminImgLabel')} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              </div>
                              <span className="text-sm italic opacity-50 mb-2">или</span>
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex gap-2 items-center px-4 py-2 border border-ink/30 text-xs uppercase tracking-widest font-bold hover:bg-ink hover:text-parchment transition-colors whitespace-nowrap">
                                <Upload size={14} /> {t('adminUploadImg')}
                              </button>
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/mp4,video/webm" onChange={handleFileChange} />
                            </div>

                            {formData.imageUrl && (
                              <div className="w-full h-32 bg-ink/5 border border-ink/20 flex items-center justify-center p-2 relative overflow-hidden">
                                <ProjectMedia src={formData.imageUrl} alt="preview" className="max-h-full max-w-full object-contain" />
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input placeholder={t('adminLinkLabel')} value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              <input placeholder={`${t('adminTagsLabel')} (RU)`} value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              <input placeholder="Tags (EN)" value={formData.tagsEn || ''} onChange={e => setFormData({...formData, tagsEn: e.target.value})} className="col-span-1 md:col-span-2 w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                            </div>

                            <div className="flex gap-4 pt-4">
                              <button type="submit" className="flex-1 border border-ink py-3 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-xs font-bold flex justify-center items-center gap-2">
                                {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                                {editingId ? t('adminSaveBtn') : t('adminAddBtn')}
                              </button>
                              {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="px-6 border border-ink/30 hover:border-ink py-3 transition-colors font-serif uppercase tracking-widest text-xs font-bold">
                                  {t('adminCancelBtn')}
                                </button>
                              )}
                            </div>
                          </form>
                        </div>

                        {/* RIGHT COL: LIST */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2 flex justify-between items-center">
                            {t('adminProjectsList')}
                            <span className="text-sm font-sans not-italic bg-ink/10 px-2 py-0.5 rounded-full">{projects.length}</span>
                          </h4>
                          <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
                            {projects.map(p => (
                              <div key={p.id} className="bg-parchment border border-ink/20 p-4 flex gap-4 items-center group shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-20 h-16 bg-ink/5 shrink-0 overflow-hidden relative border border-ink/10">
                                  <ProjectMedia src={p.imageUrl} alt={p.title} className="w-full h-full object-cover grayscale opacity-80" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-serif text-lg truncate mb-1">{p.title}</h5>
                                  <p className="text-xs opacity-60 truncate">{p.shortDescription}</p>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEdit(p)} className="p-1.5 text-ink/60 hover:text-ink bg-ink/5 hover:bg-ink/10 rounded">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => setProjectToDelete(p.id)} className="p-1.5 text-stamp/60 hover:text-stamp bg-stamp/5 hover:bg-stamp/10 rounded">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'skills' && (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT COL: FORM */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2">
                            {lang === 'ru' ? 'Добавить навык' : 'Add Skill'}
                          </h4>
                          <form onSubmit={handleSkillSubmit} className="space-y-5">
                            <input required placeholder={lang === 'ru' ? 'Название (Например: React)' : 'Name (e.g. React)'} value={skillFormData.name} onChange={e => setSkillFormData({...skillFormData, name: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={lang === 'ru' ? 'Категория (RU)' : 'Category (RU)'} value={skillFormData.category} onChange={e => setSkillFormData({...skillFormData, category: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              <input required placeholder={lang === 'ru' ? 'Категория (EN)' : 'Category (EN)'} value={skillFormData.categoryEn} onChange={e => setSkillFormData({...skillFormData, categoryEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                            </div>
                            <input type="number" min="0" max="100" placeholder={lang === 'ru' ? 'Уровень владения (0-100)' : 'Proficiency Level (0-100)'} value={skillFormData.level || ''} onChange={e => setSkillFormData({...skillFormData, level: parseInt(e.target.value) || undefined})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                            <div className="flex pt-4">
                              <button type="submit" className="flex-1 border border-ink py-3 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-xs font-bold flex justify-center items-center gap-2">
                                <Plus size={16} />
                                {t('adminAddBtn')}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* RIGHT COL: LIST */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2 flex justify-between items-center">
                            {lang === 'ru' ? 'Список навыков' : 'Skills List'}
                            <span className="text-sm font-sans not-italic bg-ink/10 px-2 py-0.5 rounded-full">{skills.length}</span>
                          </h4>
                          <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
                            {skills.map(s => (
                              <div key={s.id} className="bg-parchment border border-ink/20 px-4 py-3 flex gap-4 items-center justify-between group shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-serif text-lg truncate mb-0.5">{s.name}</h5>
                                  <p className="text-xs opacity-60 uppercase tracking-widest truncate">{lang === 'ru' ? s.category : s.categoryEn}</p>
                                </div>
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setSkillToDelete(s.id)} className="p-1.5 text-stamp/60 hover:text-stamp bg-stamp/5 hover:bg-stamp/10 rounded">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT COL: FORM */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2">
                            {lang === 'ru' ? 'Добавить отзыв' : 'Add Review'}
                          </h4>
                          <form onSubmit={handleReviewSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={lang === 'ru' ? 'Автор (RU)' : 'Author (RU)'} value={reviewFormData.author} onChange={e => setReviewFormData({...reviewFormData, author: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                              <input placeholder={lang === 'ru' ? 'Автор (EN)' : 'Author (EN)'} value={reviewFormData.authorEn || ''} onChange={e => setReviewFormData({...reviewFormData, authorEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input placeholder={lang === 'ru' ? 'Должность (RU)' : 'Role (RU)'} value={reviewFormData.role || ''} onChange={e => setReviewFormData({...reviewFormData, role: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              <input placeholder={lang === 'ru' ? 'Должность (EN)' : 'Role (EN)'} value={reviewFormData.roleEn || ''} onChange={e => setReviewFormData({...reviewFormData, roleEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                            </div>
                            <textarea required placeholder={lang === 'ru' ? 'Текст отзыва (RU)' : 'Review Text (RU)'} rows={4} value={reviewFormData.text} onChange={e => setReviewFormData({...reviewFormData, text: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink resize-none placeholder:text-ink/40 text-sm" />
                            <textarea placeholder={lang === 'ru' ? 'Текст отзыва (EN)' : 'Review Text (EN)'} rows={4} value={reviewFormData.textEn || ''} onChange={e => setReviewFormData({...reviewFormData, textEn: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink resize-none placeholder:text-ink/40 text-sm" />
                            
                            <div className="flex gap-4 items-end">
                              <div className="flex-1">
                                <label className="text-xs uppercase tracking-widest text-ink/60 font-bold mb-1 block">
                                  {lang === 'ru' ? 'Оценка (1-5)' : 'Rating (1-5)'}
                                </label>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                                      className="p-1 focus:outline-none"
                                    >
                                      <Star size={20} className={star <= (reviewFormData.rating || 5) ? 'fill-stamp text-stamp' : 'text-ink/20'} strokeWidth={1} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-4 items-end">
                              <div className="flex-1">
                                <input placeholder={lang === 'ru' ? 'Ссылка на фото автора (или загрузите)' : 'Author Photo URL (or upload)'} value={reviewFormData.photoUrl || ''} onChange={e => setReviewFormData({...reviewFormData, photoUrl: e.target.value})} className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-ink placeholder:text-ink/40 text-sm" />
                              </div>
                              <span className="text-sm italic opacity-50 mb-2">или</span>
                              <button type="button" onClick={() => reviewPhotoInputRef.current?.click()} className="flex gap-2 items-center px-4 py-2 border border-ink/30 text-xs uppercase tracking-widest font-bold hover:bg-ink hover:text-parchment transition-colors whitespace-nowrap">
                                <Upload size={14} /> {lang === 'ru' ? 'Загрузить' : 'Upload'}
                              </button>
                              <input type="file" ref={reviewPhotoInputRef} className="hidden" accept="image/*" onChange={handleReviewPhotoChange} />
                            </div>

                            {reviewFormData.photoUrl && (
                              <div className="w-16 h-16 rounded-full bg-ink/5 border border-ink/20 flex items-center justify-center overflow-hidden">
                                <img src={reviewFormData.photoUrl} alt="preview" className="w-full h-full object-cover" />
                              </div>
                            )}

                            <div className="flex pt-4">
                              <button type="submit" className="flex-1 border border-ink py-3 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-xs font-bold flex justify-center items-center gap-2">
                                <Plus size={16} />
                                {lang === 'ru' ? 'Добавить отзыв' : 'Add Review'}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* RIGHT COL: LIST */}
                        <div className="space-y-6">
                          <h4 className="font-serif text-2xl italic border-b border-ink/20 pb-2 flex justify-between items-center">
                            {lang === 'ru' ? 'Список отзывов' : 'Reviews List'}
                            <span className="text-sm font-sans not-italic bg-ink/10 px-2 py-0.5 rounded-full">{reviews.length}</span>
                          </h4>
                          <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
                            {reviews.map(r => (
                              <div key={r.id} className="bg-parchment border border-ink/20 p-4 flex flex-col gap-2 group shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    {r.photoUrl ? (
                                      <img src={r.photoUrl} alt={r.author} className="w-10 h-10 rounded-full object-cover border border-ink/20" />
                                    ) : (
                                      <WaxSeal initial={(lang === 'ru' ? r.author : (r.authorEn || r.author)).charAt(0)} size="sm" />
                                    )}
                                    <div>
                                      <h5 className="font-serif text-lg leading-tight">{r.author}</h5>
                                      {r.role && <p className="text-xs opacity-60 uppercase tracking-widest">{r.role}</p>}
                                    </div>
                                  </div>
                                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setReviewToDelete(r.id)} className="p-1.5 text-stamp/60 hover:text-stamp bg-stamp/5 hover:bg-stamp/10 rounded">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={12} className={star <= (r.rating || 5) ? 'fill-stamp text-stamp' : 'text-ink/20'} strokeWidth={1} />
                                  ))}
                                </div>
                                <p className="text-sm font-serif italic opacity-80 mt-1 line-clamp-2">{r.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'contacts' && (
                      <div className="w-full max-w-2xl">
                        <form onSubmit={handleContactsSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminEmailLabel')}</label>
                            <input value={contactsData.email} onChange={e => setContactsData({...contactsData, email: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-mono" />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminGithubLabel')}</label>
                            <input value={contactsData.github} onChange={e => setContactsData({...contactsData, github: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-mono" placeholder="https://github.com/..." />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminTelegramLabel')}</label>
                            <input value={contactsData.telegram} onChange={e => setContactsData({...contactsData, telegram: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-mono" placeholder="https://t.me/..." />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminVkLabel')}</label>
                            <input value={contactsData.vk} onChange={e => setContactsData({...contactsData, vk: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-mono" placeholder="https://vk.com/..." />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminFacebookLabel')}</label>
                            <input value={contactsData.facebook} onChange={e => setContactsData({...contactsData, facebook: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-mono" placeholder="https://facebook.com/..." />
                          </div>

                          <button type="submit" className="w-full border border-ink py-4 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-sm font-bold mt-4">
                            {t('adminSaveBtn')}
                          </button>
                        </form>
                      </div>
                    )}

                    {activeTab === 'content' && (
                      <div className="w-full max-w-2xl max-h-[70vh] overflow-y-auto pr-4 no-scrollbar">
                        <form onSubmit={handleContentSubmit} className="space-y-6">
                          <h4 className="font-serif text-xl border-b border-ink/20 pb-2">Hero Section</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Name (RU)</label>
                              <input value={contentData.heroName} onChange={e => setContentData({...contentData, heroName: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Name (EN)</label>
                              <input value={contentData.heroNameEn} onChange={e => setContentData({...contentData, heroNameEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Role (RU)</label>
                              <input value={contentData.heroRole} onChange={e => setContentData({...contentData, heroRole: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Role (EN)</label>
                              <input value={contentData.heroRoleEn} onChange={e => setContentData({...contentData, heroRoleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminContentSubtitleLabel')} (RU)</label>
                              <input value={contentData.heroSubtitle} onChange={e => setContentData({...contentData, heroSubtitle: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Subtitle (EN)</label>
                              <input value={contentData.heroSubtitleEn} onChange={e => setContentData({...contentData, heroSubtitleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">{t('adminContentIntroLabel')} (RU)</label>
                            <textarea rows={4} value={contentData.heroIntro} onChange={e => setContentData({...contentData, heroIntro: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink resize-none font-serif" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">About Me Text (EN)</label>
                            <textarea rows={4} value={contentData.heroIntroEn} onChange={e => setContentData({...contentData, heroIntroEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink resize-none font-serif" />
                          </div>

                          <h4 className="font-serif text-xl border-b border-ink/20 pb-2 pt-4">Skills Section</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (RU)</label>
                              <input value={contentData.skillsClass} onChange={e => setContentData({...contentData, skillsClass: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (EN)</label>
                              <input value={contentData.skillsClassEn} onChange={e => setContentData({...contentData, skillsClassEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (RU)</label>
                              <input value={contentData.skillsTitle} onChange={e => setContentData({...contentData, skillsTitle: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (EN)</label>
                              <input value={contentData.skillsTitleEn} onChange={e => setContentData({...contentData, skillsTitleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                          </div>

                          <h4 className="font-serif text-xl border-b border-ink/20 pb-2 pt-4">Projects Section</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (RU)</label>
                              <input value={contentData.projectsClass} onChange={e => setContentData({...contentData, projectsClass: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (EN)</label>
                              <input value={contentData.projectsClassEn} onChange={e => setContentData({...contentData, projectsClassEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (RU)</label>
                              <input value={contentData.projectsTitle} onChange={e => setContentData({...contentData, projectsTitle: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (EN)</label>
                              <input value={contentData.projectsTitleEn} onChange={e => setContentData({...contentData, projectsTitleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                          </div>

                          <h4 className="font-serif text-xl border-b border-ink/20 pb-2 pt-4">Contact Section</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (RU)</label>
                              <input value={contentData.contactClass} onChange={e => setContentData({...contentData, contactClass: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (EN)</label>
                              <input value={contentData.contactClassEn} onChange={e => setContentData({...contentData, contactClassEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (RU)</label>
                              <input value={contentData.contactTitle} onChange={e => setContentData({...contentData, contactTitle: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (EN)</label>
                              <input value={contentData.contactTitleEn} onChange={e => setContentData({...contentData, contactTitleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Contact Intro (RU)</label>
                            <textarea rows={3} value={contentData.contactIntro} onChange={e => setContentData({...contentData, contactIntro: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink resize-none font-serif" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Contact Intro (EN)</label>
                            <textarea rows={3} value={contentData.contactIntroEn} onChange={e => setContentData({...contentData, contactIntroEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink resize-none font-serif" />
                          </div>

                          <h4 className="font-serif text-xl border-b border-ink/20 pb-2 pt-4">Methodology Section</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (RU)</label>
                              <input value={contentData.methodologyClass || ''} onChange={e => setContentData({...contentData, methodologyClass: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Category Header (EN)</label>
                              <input value={contentData.methodologyClassEn || ''} onChange={e => setContentData({...contentData, methodologyClassEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (RU)</label>
                              <input value={contentData.methodologyTitle || ''} onChange={e => setContentData({...contentData, methodologyTitle: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-ink/60 font-bold">Title (EN)</label>
                              <input value={contentData.methodologyTitleEn || ''} onChange={e => setContentData({...contentData, methodologyTitleEn: e.target.value})} className="w-full bg-parchment border border-ink/30 px-4 py-3 outline-none focus:border-ink font-serif" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-ink/20">
                            {isComparing && draftContent ? (
                              <div className="p-4 bg-ink/5 border border-ink/20 space-y-4 mb-4">
                                <h5 className="font-serif font-bold text-lg border-b border-ink/20 pb-2 flex justify-between items-center">
                                  {lang === 'ru' ? 'Сравнение (Черновик vs Текущая)' : 'Compare (Draft vs Live)'}
                                  <button type="button" onClick={() => setIsComparing(false)} className="text-sm border border-ink/30 px-3 py-1 hover:bg-ink hover:text-parchment transition-colors">
                                    <X size={14} />
                                  </button>
                                </h5>
                                <div className="max-h-64 overflow-y-auto space-y-3 text-sm text-left font-serif">
                                  {Object.keys(siteContent).map(key => {
                                    const k = key as keyof SiteContent;
                                    const draftVal = draftContent[k];
                                    const liveVal = siteContent[k];
                                    if (draftVal !== liveVal) {
                                      return (
                                        <div key={k} className="grid grid-cols-2 gap-4 border-b border-ink/10 pb-3">
                                          <div>
                                            <span className="opacity-50 text-xs block uppercase tracking-widest">{k} (Live)</span>
                                            <div className="text-stamp line-through opacity-70 mt-1 whitespace-pre-wrap">{liveVal || '(empty)'}</div>
                                          </div>
                                          <div>
                                            <span className="opacity-50 text-xs block uppercase tracking-widest">{k} (Draft)</span>
                                            <div className="text-green-800 font-medium mt-1 whitespace-pre-wrap">{draftVal || '(empty)'}</div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    return null;
                                  })}
                                  {Object.keys(siteContent).every(k => draftContent[k as keyof SiteContent] === siteContent[k as keyof SiteContent]) && (
                                    <div className="italic opacity-70 py-4 text-center">
                                      {lang === 'ru' ? 'Нет различий.' : 'No differences.'}
                                    </div>
                                  )}
                                </div>
                                <button type="button" onClick={(e) => { e.preventDefault(); onUpdateSiteContent(draftContent); showToast(lang === 'ru' ? 'Черновик опубликован' : 'Draft published'); setIsComparing(false); }} className="w-full bg-ink text-parchment py-3 font-serif uppercase tracking-widest text-xs font-bold hover:bg-ink-light transition-colors">
                                  {lang === 'ru' ? 'Опубликовать черновик' : 'Publish Draft'}
                                </button>
                              </div>
                            ) : null}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <button type="button" onClick={handleSaveDraft} className="border border-ink py-3 hover:bg-ink hover:text-parchment transition-colors font-serif uppercase tracking-widest text-xs font-bold">
                                {lang === 'ru' ? 'Сохранить черновик' : 'Save Draft'}
                              </button>
                              <button type="button" onClick={handleLoadDraft} disabled={!draftContent} className="border border-ink py-3 disabled:opacity-30 disabled:border-ink/30 disabled:hover:bg-transparent disabled:hover:text-ink hover:bg-ink hover:text-parchment transition-colors font-serif uppercase tracking-widest text-xs font-bold">
                                {lang === 'ru' ? 'Загрузить черновик' : 'Load Draft'}
                              </button>
                              <button type="button" onClick={(e) => { e.preventDefault(); setIsComparing(!isComparing); }} disabled={!draftContent} className="border border-ink py-3 disabled:opacity-30 disabled:border-ink/30 disabled:hover:bg-transparent disabled:hover:text-ink hover:bg-ink hover:text-parchment transition-colors font-serif uppercase tracking-widest text-xs font-bold">
                                {lang === 'ru' ? 'Сравнить' : 'Compare'}
                              </button>
                              <button type="submit" className="border border-ink py-3 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-xs font-bold shadow-md">
                                {lang === 'ru' ? 'Опубликовать' : 'Publish'}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeTab === 'system' && (
                      <div className="w-full max-w-2xl space-y-8 flex flex-col items-center pt-8">
                        {lastUpdated && (
                          <div className="text-center font-serif text-sm italic opacity-70 mb-4 border-b border-ink/20 pb-4 w-full">
                            {t('lastUpdated')}: {new Date(lastUpdated).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                          </div>
                        )}
                        <p className="font-serif italic text-ink/80 text-center mb-4">
                          {lang === 'ru' 
                            ? 'Здесь вы можете сохранить резервную копию, экспортировать портфолио для работодателей или сбросить все изменения к первоначальному виду.' 
                            : 'Save backups, export your portfolio for employers, or reset all your changes to their initial defaults.'}
                        </p>

                        <div className="w-full space-y-4">
                          <button 
                            onClick={() => setPreviewMode('json')}
                            className="w-full border border-ink py-4 hover:bg-ink/5 transition-colors font-serif uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
                          >
                            <Eye size={18} /> {t('adminExportJson')}
                          </button>

                          <button 
                            onClick={() => setPreviewMode('pdf')}
                            className="w-full border border-ink py-4 bg-ink text-parchment hover:bg-ink-light transition-colors font-serif uppercase tracking-widest text-sm font-bold shadow-md flex items-center justify-center gap-2"
                          >
                            <Eye size={18} /> {t('adminExportPdf')}
                          </button>
                        </div>

                        <div className="w-full h-px bg-ink/20 my-4" />

                        <button 
                          onClick={onResetDefaults}
                          className="px-8 border border-stamp text-stamp hover:bg-stamp hover:text-parchment py-3 transition-colors font-serif uppercase tracking-widest text-xs font-bold"
                        >
                          {t('adminResetBtn')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-parchment w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              <div className="p-4 md:p-6 border-b border-ink/20 flex justify-between items-center">
                <h3 className="font-serif text-2xl text-ink font-light flex items-center gap-2">
                  <Eye size={24} /> {t('adminPreviewTitle')} - {previewMode.toUpperCase()}
                </h3>
                <button onClick={() => setPreviewMode(null)} className="text-ink/60 hover:text-ink p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col">
                <p className="font-serif italic text-ink/80 mb-6 border-l-2 border-ink/40 pl-4 py-1">
                  {previewMode === 'json' ? t('adminPreviewDescJson') : t('adminPreviewDescPdf')}
                </p>

                {previewMode === 'json' ? (
                  <pre className="bg-ink text-parchment p-6 overflow-auto text-sm w-full outline-none select-all font-mono shadow-inner rounded-sm">
                    {JSON.stringify({ projects, contactSettings, siteContent }, null, 2)}
                  </pre>
                ) : (
                  <div id="pdf-content" className="bg-white border shadow-md w-full aspect-[1/1.4] p-8 md:p-12 text-ink transform scale-100 origin-top overflow-y-auto overflow-x-hidden relative">
                    <div className="text-center mb-8 border-b border-ink/20 pb-8">
                       <h1 className="font-serif text-5xl mb-2 font-light">
                          {lang === 'ru' ? 'Александр' : 'Alexander'}
                       </h1>
                       <p className="font-serif text-sm opacity-70 italic max-w-md mx-auto">
                          {lang === 'ru' ? siteContent.heroSubtitle : siteContent.heroSubtitleEn}
                       </p>
                    </div>
                    
                    <div className="font-serif mb-8 text-sm max-w-2xl mx-auto leading-relaxed text-center">
                      {lang === 'ru' ? siteContent.heroIntro : siteContent.heroIntroEn}
                    </div>
                    
                    
                    <div className="grid grid-cols-2 gap-8 text-sm mb-8">
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-ink/20 inline-block">
                          {lang === 'ru' ? siteContent.skillsClass : siteContent.skillsClassEn}
                        </h4>
                        <div className="flex flex-wrap gap-2 opacity-80">
                          {skills.map(skill => (
                            <span key={skill.id} className="border border-ink/30 px-2 py-1 rounded-sm text-xs">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-ink/20 inline-block">
                          {lang === 'ru' ? 'Ключевые Проекты' : 'Key Projects'}
                        </h4>
                        <ul className="space-y-4 opacity-80">
                          {projects.slice(0, 3).map(p => (
                             <li key={p.id}>
                               <strong className="block font-serif text-base">{lang === 'ru' ? p.title : (p.titleEn || p.title)}</strong>
                               <span className="text-xs opacity-80">{lang === 'ru' ? p.shortDescription : (p.shortDescriptionEn || p.shortDescription)}</span>
                             </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-sm">
                      <h4 className="font-bold uppercase tracking-widest text-xs mb-4 border-b border-ink/20 inline-block">
                        {lang === 'ru' ? 'Контакты' : 'Contacts'}
                      </h4>
                      <ul className="space-y-2 opacity-80 flex gap-6">
                        <li>Email: {contactSettings.email}</li>
                        {contactSettings.github && <li>GitHub: {contactSettings.github.replace('https://', '')}</li>}
                        {contactSettings.telegram && <li>Telegram: {contactSettings.telegram.replace('https://', '')}</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-ink/20 flex justify-end gap-4 bg-ink/5">
                <button 
                  onClick={() => setPreviewMode(null)}
                  className="px-6 py-2 border border-ink/30 hover:border-ink transition-colors font-serif tracking-widest text-sm"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => {
                    setPreviewMode(null);
                    if (previewMode === 'json') handleExportJson();
                    if (previewMode === 'pdf') handleExportPdf();
                  }}
                  className="px-8 py-2 bg-ink text-parchment transition-colors font-serif tracking-widest text-sm font-bold shadow-md hover:bg-ink-light flex items-center justify-center"
                >
                  {t('adminConfirmExport')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vintage Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] pointer-events-none"
          >
            <div className="bg-parchment border border-ink/40 shadow-lg px-6 py-4 flex items-center gap-4 relative overflow-hidden">
              {/* Decorative side border */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-stamp opacity-90" />
              <div className="text-ink font-serif italic text-lg tracking-wide pl-2 pr-4">
                {toastMessage}
              </div>
              <div className="opacity-90">
                <WaxSeal initial="✓" size="sm" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-parchment border border-ink/30 shadow-xl max-w-sm w-full p-6 text-center relative vintage-border"
            >
              <h4 className="font-serif text-2xl italic mb-4 text-ink">
                {lang === 'ru' ? 'Удалить проект?' : 'Delete project?'}
              </h4>
              <p className="font-serif text-ink/80 mb-8 leading-relaxed">
                {lang === 'ru' ? 'Вы уверены, что хотите удалить проект из портфолио?' : 'Are you sure you want to delete the project?'}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 border border-ink py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold text-ink hover:bg-ink hover:text-parchment"
                >
                  {lang === 'ru' ? 'Нет' : 'No'}
                </button>
                <button
                  onClick={() => {
                    onDeleteProject(projectToDelete);
                    setProjectToDelete(null);
                  }}
                  className="flex-1 bg-stamp text-parchment hover:bg-stamp/80 py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold border border-stamp"
                >
                  {lang === 'ru' ? 'Да' : 'Yes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Skill Confirmation Modal */}
      <AnimatePresence>
        {skillToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-parchment border border-ink/30 shadow-xl max-w-sm w-full p-6 text-center relative vintage-border"
            >
              <h4 className="font-serif text-2xl italic mb-4 text-ink">
                {lang === 'ru' ? 'Удалить навык?' : 'Delete skill?'}
              </h4>
              <p className="font-serif text-ink/80 mb-8 leading-relaxed">
                {lang === 'ru' ? 'Вы уверены, что хотите удалить навык из списка?' : 'Are you sure you want to delete the skill?'}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSkillToDelete(null)}
                  className="flex-1 border border-ink py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold text-ink hover:bg-ink hover:text-parchment"
                >
                  {lang === 'ru' ? 'Не удалять' : 'Do not delete'}
                </button>
                <button
                  onClick={() => {
                    onDeleteSkill(skillToDelete);
                    setSkillToDelete(null);
                  }}
                  className="flex-1 bg-stamp text-parchment hover:bg-stamp/80 py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold border border-stamp"
                >
                  {lang === 'ru' ? 'Да, удалить' : 'Yes, delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Review Confirmation Modal */}
      <AnimatePresence>
        {reviewToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-parchment border border-ink/30 shadow-xl max-w-sm w-full p-6 text-center relative vintage-border"
            >
              <h4 className="font-serif text-2xl italic mb-4 text-ink">
                {lang === 'ru' ? 'Удалить отзыв?' : 'Delete review?'}
              </h4>
              <p className="font-serif text-ink/80 mb-8 leading-relaxed">
                {lang === 'ru' ? 'Вы уверены, что хотите удалить отзыв из портфолио без возможности восстановления?' : 'Are you sure you want to delete the review without the ability to restore it?'}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setReviewToDelete(null)}
                  className="flex-1 border border-ink py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold text-ink hover:bg-ink hover:text-parchment"
                >
                  {lang === 'ru' ? 'Не удалять' : 'Do not delete'}
                </button>
                <button
                  onClick={() => {
                    onDeleteReview(reviewToDelete);
                    setReviewToDelete(null);
                  }}
                  className="flex-1 bg-stamp text-parchment hover:bg-stamp/80 py-2 transition-colors font-serif uppercase tracking-widest text-xs font-bold border border-stamp"
                >
                  {lang === 'ru' ? 'Да, удалить' : 'Yes, delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
