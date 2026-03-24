import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  date?: string;
  category?: string;
  author?: {
    name: string;
    role: string;
    image: string;
  };
  tags?: string[];
  readingTime?: string;
}

export interface AppData {
  concepts: ContentItem[];
  portfolio: ContentItem[];
  blog: ContentItem[];
}

const defaultData: AppData = {
  concepts: [
    { id: '1', slug: 'gelecegin-web-deneyimi-1', title: 'Geleceğin Web Deneyimi 1', description: 'Yenilikçi arayüzler ve etkileşimli tasarım yaklaşımları.', image: 'https://picsum.photos/seed/concept1/1200/800' },
    { id: '2', slug: 'gelecegin-web-deneyimi-2', title: 'Geleceğin Web Deneyimi 2', description: 'Yenilikçi arayüzler ve etkileşimli tasarım yaklaşımları.', image: 'https://picsum.photos/seed/concept2/1200/800' },
  ],
  portfolio: [
    { id: '1', slug: 'proje-ismi-1', title: 'Proje İsmi 1', description: 'Web Tasarım & Geliştirme', image: 'https://picsum.photos/seed/port1/800/800' },
    { id: '2', slug: 'proje-ismi-2', title: 'Proje İsmi 2', description: 'Web Tasarım & Geliştirme', image: 'https://picsum.photos/seed/port2/800/800' },
  ],
  blog: [
    { 
      id: '1', 
      slug: 'modern-web-tasarim-trendleri',
      title: 'Modern Web Tasarım Trendleri', 
      description: '2024 yılında öne çıkan tasarım yaklaşımları ve teknolojik yenilikler.', 
      content: `
        <p>Web tasarımı dünyası her geçen gün evriliyor. 2024 yılına girdiğimizde, kullanıcı deneyimini merkeze alan, daha etkileşimli ve erişilebilir tasarımların ön plana çıktığını görüyoruz.</p>
        <h2>1. Minimalizm ve Maksimalizm Dengesi</h2>
        <p>Gereksiz detaylardan arındırılmış temiz arayüzler popülerliğini korurken, cesur tipografi ve canlı renklerin kullanımıyla karakter kazanan tasarımlar da yükselişte.</p>
        <h2>2. Yapay Zeka Destekli Arayüzler</h2>
        <p>AI artık sadece arka planda değil, kullanıcı arayüzlerinde de aktif rol oynuyor. Kişiselleştirilmiş içerik sunumu ve akıllı asistanlar web sitelerinin ayrılmaz bir parçası haline geliyor.</p>
        <blockquote>Tasarım sadece nasıl göründüğü değil, nasıl çalıştığıdır.</blockquote>
        <p>Sonuç olarak, teknoloji ve sanatın iç içe geçtiği bir dönemdeyiz. Agenzion olarak biz de bu trendleri projelerimize entegre ederek en iyi sonuçları hedefliyoruz.</p>
      `,
      image: 'https://picsum.photos/seed/blog1/1200/800', 
      date: '2024-02-21',
      category: 'Tasarım',
      author: {
        name: 'Arda Gök',
        role: 'Creative Director',
        image: 'https://picsum.photos/seed/arda/200/200'
      },
      tags: ['Web Tasarım', 'Trendler', 'UI/UX'],
      readingTime: '5 dk'
    },
    { 
      id: '2', 
      slug: 'hiz-ve-performansin-onemi',
      title: 'Hız ve Performansın Önemi', 
      description: 'Kullanıcı deneyimini artıran teknik optimizasyonlar ve stratejiler.', 
      content: `
        <p>Bir web sitesinin hızı, sadece kullanıcı deneyimi için değil, aynı zamanda arama motoru sıralamaları (SEO) için de hayati önem taşır.</p>
        <h2>Neden Hız?</h2>
        <p>İstatistiklere göre, 3 saniyeden uzun sürede açılan siteler kullanıcılarının %40'ını kaybediyor. Bu, doğrudan dönüşüm oranlarını etkileyen bir faktördür.</p>
        <h2>Optimizasyon Stratejileri</h2>
        <ul>
          <li>Görsel optimizasyonu ve WebP formatı kullanımı.</li>
          <li>Kod sıkıştırma (Minification) ve önbellekleme (Caching).</li>
          <li>Sunucu yanıt sürelerinin iyileştirilmesi.</li>
        </ul>
        <p>Performans odaklı bir yaklaşım, markanızın dijital dünyadaki başarısının anahtarıdır.</p>
      `,
      image: 'https://picsum.photos/seed/blog2/1200/800', 
      date: '2024-02-15',
      category: 'Teknoloji',
      author: {
        name: 'Can Yılmaz',
        role: 'Lead Developer',
        image: 'https://picsum.photos/seed/can/200/200'
      },
      tags: ['Performans', 'SEO', 'Web Geliştirme'],
      readingTime: '4 dk'
    },
  ]
};

export async function getDb(): Promise<AppData> {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    if (!data || data.trim() === '') {
      return defaultData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing db.json, returning default data:', error);
    return defaultData;
  }
}

export async function saveDb(data: AppData): Promise<void> {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
