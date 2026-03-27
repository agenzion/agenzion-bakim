import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface ContentItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  date?: string;
  category?: string;
  label?: string;
  reviewUrl?: string;
  color?: string;
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
    {
      id: '1',
      title: 'Cyber Dust',
      description:
        'Dijital hafızanın kırılganlığını keşfeden parçacık tabanlı 3D ortam. Kullanıcılar, parçalanan veri kümeleri arasında gerçek zamanlı olarak gezinir.',
      label: 'Sürükleyici Web',
      image: '/images/project-placeholder.jpg',
      reviewUrl: '',
      color: '#06b6d4',
    },
    {
      id: '2',
      title: 'Void Runner',
      description:
        'Prosedürel olarak oluşturulmuş brutalist bir boşlukta geçen yüksek kaliteli tarayıcı tabanlı yarış deneyimi. Post-processing overdrive ile sıfır gecikmeli giriş.',
      label: 'Oyun Deneyimi',
      image: '/images/project-placeholder.jpg',
      reviewUrl: '',
      color: '#ef4444',
    },
    {
      id: '3',
      title: 'Neo Genesis',
      description:
        'Kullanıcının web kamerası aracılığıyla duygusal analizine dayalı olarak düzenini ve renk teorisini uyarlayan deneysel bir üretken arayüz.',
      label: 'Yapay Zeka Arayüzü',
      image: '/images/project-placeholder.jpg',
      reviewUrl: '',
      color: '#8b5cf6',
    },
    {
      id: '4',
      title: 'Aether Mind',
      description:
        'Karmaşık sinir ağlarını keşfedilebilir takımyıldızlar olarak görselleştirme. Veri bilimcilerin VRda karar ağaçları arasında dolaşması için bir araç.',
      label: 'Uzamsal Bilişim',
      image: '/images/project-placeholder.jpg',
      reviewUrl: '',
      color: '#3b82f6',
    },
    {
      id: '5',
      title: 'Solstice',
      description:
        'Zamanın aydınlatmayı kontrol ettiği lüks bir saat yapılandırıcısı. Tamamen tarayıcıda raytracing kalitesinde gölgelerle işlenmiştir.',
      label: 'E-Ticaret',
      image: '/images/project-placeholder.jpg',
      reviewUrl: '',
      color: '#f59e0b',
    },
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

function normalizeArray<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

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
    const parsed = JSON.parse(data) as Partial<AppData>;
    return {
      concepts: normalizeArray(parsed.concepts, defaultData.concepts),
      portfolio: normalizeArray(parsed.portfolio, defaultData.portfolio),
      blog: normalizeArray(parsed.blog, defaultData.blog),
    };
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
