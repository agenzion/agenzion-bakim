'use client';

import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Plus, Trash2, Save, RefreshCw, Briefcase, BookOpen, Lightbulb, ArrowLeft, Lock, User } from 'lucide-react';
import { AppData, ContentItem } from '@/lib/db';

const projectColors = ['#06b6d4', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b'];

function createNewItem(tab: keyof AppData, count: number): ContentItem {
  if (tab === 'portfolio') {
    return {
      id: Date.now().toString(),
      title: 'Yeni Proje',
      description: 'Proje açıklaması',
      label: 'Etiket',
      reviewUrl: '',
      image: '/images/project-placeholder.jpg',
      color: projectColors[count % projectColors.length],
    };
  }

  if (tab === 'blog') {
    const title = 'Yeni Başlık';
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    return {
      id: Date.now().toString(),
      slug,
      title,
      description: 'Yeni Açıklama',
      content: '<p>Yeni içerik buraya...</p>',
      image: 'https://picsum.photos/800/600',
      date: new Date().toISOString().split('T')[0],
      category: 'Genel',
    };
  }

  return {
    id: Date.now().toString(),
    title: 'Yeni Başlık',
    description: 'Yeni Açıklama',
    image: '/images/project-placeholder.jpg',
  };
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof AppData>('portfolio');

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Hatalı kullanıcı adı veya şifre!');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert('Başarıyla kaydedildi!');
      }
    } catch (error) {
      console.error('Failed to save data', error);
      alert('Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!data) return;
    const newItem = createNewItem(activeTab, data[activeTab].length);
    setData({
      ...data,
      [activeTab]: [newItem, ...data[activeTab]],
    });
  };

  const removeItem = (id: string) => {
    if (!data) return;
    setData({
      ...data,
      [activeTab]: data[activeTab].filter((item) => item.id !== id),
    });
  };

  const updateItem = (id: string, field: keyof ContentItem, value: any) => {
    if (!data) return;
    setData({
      ...data,
      [activeTab]: data[activeTab].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const isPortfolioTab = activeTab === 'portfolio';
  const isBlogTab = activeTab === 'blog';
  const addButtonLabel = isPortfolioTab
    ? 'Yeni Proje Kartı Ekle'
    : isBlogTab
      ? 'Yeni Blog Yazısı Ekle'
      : 'Yeni Kart Ekle';
  const helperText = isPortfolioTab
    ? 'Ana sayfadaki proje kartlarını buradan düzenleyebilir, ekleyebilir ve kaldırabilirsiniz.'
    : isBlogTab
      ? 'Blog içeriklerini ve alanlarını buradan yönetebilirsiniz.'
      : 'İçerikleri buradan yönetebilirsiniz.';

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter brand-font mb-2">Admin Girişi</h1>
            <p className="text-neutral-500 text-sm">Lütfen kimlik bilgilerinizi girin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-neutral-800 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-800 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-all active:scale-[0.98]"
            >
              Giriş Yap
            </button>
          </form>

          <Link href="/" className="flex items-center justify-center gap-2 text-neutral-500 hover:text-white transition-colors mt-8 text-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Siteye Geri Dön
          </Link>
        </motion.div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="text-white animate-spin" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="pt-20 pb-20 px-8 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Siteye Geri Dön
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter brand-font mb-2">Admin Panel</h1>
            <p className="text-neutral-400">{helperText}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-neutral-500 hover:text-white text-sm font-bold transition-colors"
            >
              Çıkış Yap
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'portfolio', label: 'Projeler', icon: Briefcase },
            { id: 'concepts', label: 'Konseptler', icon: Lightbulb },
            { id: 'blog', label: 'Blog', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as keyof AppData)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-black scale-105' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="space-y-6">
          <button
            onClick={addItem}
            className="w-full py-4 border-2 border-dashed border-neutral-800 rounded-3xl flex items-center justify-center gap-2 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300 transition-all group"
          >
            <Plus size={24} className="group-hover:scale-125 transition-transform" />
            {addButtonLabel}
          </button>

          {data && data[activeTab].map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 group"
            >
              <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || '/images/project-placeholder.jpg'}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      {isPortfolioTab ? 'Proje İsmi' : 'Başlık'}
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                    />
                  </div>
                  {isPortfolioTab ? (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Etiket</label>
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                      />
                    </div>
                  ) : isBlogTab ? (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Slug</label>
                      <input
                        type="text"
                        value={item.slug || ''}
                        onChange={(e) => updateItem(item.id, 'slug', e.target.value)}
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isPortfolioTab && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Proje İnceleme URL&apos;si</label>
                      <input
                        type="url"
                        value={item.reviewUrl || ''}
                        onChange={(e) => updateItem(item.id, 'reviewUrl', e.target.value)}
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                        placeholder="https://ornek.com/proje"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Görsel URL</label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => updateItem(item.id, 'image', e.target.value)}
                      className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                    />
                  </div>
                  {isBlogTab && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Kategori</label>
                      <input
                        type="text"
                        value={item.category || ''}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Açıklama</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    rows={isPortfolioTab ? 4 : 2}
                    className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                  />
                </div>

                {isBlogTab && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">İçerik (HTML)</label>
                    <textarea
                      value={item.content || ''}
                      onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                      rows={6}
                      className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none font-mono text-sm"
                    />
                  </div>
                )}

                {isBlogTab && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Tarih (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      value={item.date || ''}
                      onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                      className="w-full bg-neutral-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-white/20 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex md:flex-col justify-end gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer copy={{ copyrightName: 'Agenzion Web Stüdyosu' }} />
    </main>
  );
}
