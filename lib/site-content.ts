import type { Locale } from '@/lib/i18n';
import { sanityFetch } from '@/lib/sanity';

export const localeMeta = {
  tr: {
    languageTag: 'tr-TR',
    openGraphLocale: 'tr_TR',
    keywords: [
      'web tasarım',
      'web geliştirme',
      'performans optimizasyonu',
      'seo',
      'yaratıcı web stüdyosu',
      'İstanbul web stüdyosu',
      'next.js',
    ],
  },
  en: {
    languageTag: 'en-US',
    openGraphLocale: 'en_US',
    keywords: [
      'web design',
      'web development',
      'performance optimization',
      'seo',
      'creative web studio',
      'istanbul web studio',
      'next.js',
    ],
  },
} as const;

export const siteContent = {
  tr: {
    meta: {
      homeTitle: 'Agenzion Web Studio | Performans Odaklı Web Tasarım ve Geliştirme',
      homeDescription:
        'Agenzion; performans, SEO ve yaratıcı etkileşimi birlikte ele alan İstanbul merkezli butik web tasarım ve geliştirme stüdyosudur.',
      blogTitle: 'Blog | Agenzion Web Studio',
      blogDescription:
        'Performans, SEO, modern web tasarım ve dijital ürün geliştirme üzerine Agenzion notları ve teknik içerikler.',
      contactTitle: 'İletişim | Agenzion Web Studio',
      contactDescription:
        'Agenzion ile yeni web projenizi, performans iyileştirmelerinizi veya yaratıcı dijital deneyim ihtiyacınızı konuşmak için iletişime geçin.',
      notFoundTitle: 'Sayfa Bulunamadı | Agenzion Web Studio',
      notFoundDescription:
        'İstediğiniz sayfa bulunamadı. Agenzion Web Studio ana sayfasına dönerek gezinmeye devam edebilirsiniz.',
    },
    navigation: {
      about: 'Hakkımızda',
      blog: 'Blog',
      contact: 'İletişim',
      openMenu: 'Menüyü aç',
      closeMenu: 'Menüyü kapat',
      socialLabel: 'Sosyal Medya',
      socialLinks: ['INSTAGRAM', 'LINKEDIN', 'BEHANCE'],
      mobileCopyright: 'AGENZION WEB STUDIO',
    },
    hero: {
      primaryTitle: 'Hazır mısınız?',
      secondaryTitle: 'Zamanı geldi.',
      scrollLabel: 'Kaydırın',
    },
    about: {
      paragraphs: [
        'Her güçlü marka, dijitalde aynı etkiyi yaratamaz. Çünkü gerçek fark; tasarımda değil, deneyimin bütününde ortaya çıkar.',
        'Dijitalde var olmak yeterli değildir. Asıl etki, deneyim başladığı anda hissedilir.',
        'Agenzion; tasarım, yazılım ve etkileşimi bir araya getirerek markaları sıradan yapılardan çıkarır, yaşayan dijital deneyimlere dönüştürür.',
      ],
    },
    services: {
      heading: 'Hizmetler',
      items: [
        {
          id: 1,
          title: 'Web Tasarım',
          description:
            'Markanıza ve hedef kitlenize uygun, modern ve kullanıcı odaklı web siteleri tasarlıyoruz. Tasarım sürecinde performans, erişilebilirlik ve çoklu cihaz uyumluluğunu temel alıyoruz.',
          gradient: 'from-blue-600 to-cyan-400',
        },
        {
          id: 2,
          title: 'Uygulama Geliştirme',
          description:
            'İş ihtiyaçlarınıza yönelik mobil ve web tabanlı uygulamalar geliştiriyoruz. Tüm projelerde ölçeklenebilir altyapı, güvenlik ve sürdürülebilir performansı önceliklendiriyoruz.',
          gradient: 'from-[#4592AF] to-[#E3C4A8]',
        },
        {
          id: 3,
          title: 'UI/UX Tasarım',
          description:
            'Kullanıcı davranışlarını analiz ederek sezgisel ve akıcı arayüz deneyimleri tasarlıyoruz. Bilgi mimarisi, kullanılabilirlik ve görsel tutarlılığı tasarım sürecinin merkezine alıyoruz.',
          gradient: 'from-orange-600 to-red-500',
        },
        {
          id: 4,
          title: 'Özel Yazılım Çözümleri',
          description:
            'Operasyonel süreçlerinize özel, ihtiyaca göre şekillenen yazılım çözümleri geliştiriyoruz. Mevcut sistemlerle entegre çalışabilen, esnek ve yönetilebilir altyapılar kurguluyoruz.',
          gradient: 'from-emerald-600 to-green-400',
        },
        {
          id: 5,
          title: 'Headless E-Ticaret',
          description:
            'Modern teknolojilerle güçlü ve ölçeklenebilir e-ticaret sistemleri geliştiririz. Tasarım ve performansı dengeli şekilde ele alarak sürdürülebilir bir yapı oluştururuz.',
          gradient: 'from-amber-500 to-yellow-300',
        },
      ],
    },
    headlessCommerce: {
      sections: [
        {
          title: 'HEADLESS E-TİCARET',
          text: 'Headless mimari ile içerik, ürün ve kullanıcı deneyimini tek bir hız çizgisinde buluşturuyoruz.',
        },
        {
          title: 'HIZ ODAKLI ALTYAPI',
          text: 'Ön yüz ve ticaret motorunu ayrıştırarak kampanya dönemlerinde bile hızlı kalan, ölçeklenebilir bir yapı kuruyoruz.',
        },
        {
          title: 'ÖZGÜR DENEYİM TASARIMI',
          text: 'Şablon sınırlarını kaldırıp markaya özel alışveriş akışları, esnek içerik blokları ve yüksek dönüşüm odaklı etkileşimler tasarlıyoruz.',
        },
        {
          title: 'SÜRDÜRÜLEBİLİR BÜYÜME',
          text: 'Analitik, SEO ve performansı aynı sistemde yöneterek e-ticaret ürününüzü uzun vadede ölçülebilir şekilde büyütüyoruz.',
        },
      ],
      indicatorLabel: 'Bölüme git',
    },
    showcase: {
      heading: 'Projeler',
      voyagerLabel: 'Voyager 1',
      reviewLabel: 'Projeyi İncele',
      emptyLabel: 'Henüz proje eklenmedi.',
      projects: [
        {
          id: 1,
          title: 'Cyber Dust',
          category: 'Sürükleyici Web',
          description:
            'Dijital hafızanın kırılganlığını keşfeden parçacık tabanlı 3D ortam. Kullanıcılar, parçalanan veri kümeleri arasında gerçek zamanlı olarak gezinir.',
          img: '/images/project-placeholder.jpg',
          color: '#06b6d4',
          tags: ['WebGL', 'Three.js', 'Shaders'],
        },
        {
          id: 2,
          title: 'Void Runner',
          category: 'Oyun Deneyimi',
          description:
            'Prosedürel olarak oluşturulmuş brutalist bir boşlukta geçen yüksek kaliteli tarayıcı tabanlı yarış deneyimi. Post-processing overdrive ile sıfır gecikmeli giriş.',
          img: '/images/project-placeholder.jpg',
          color: '#ef4444',
          tags: ['Physics', 'React Three Fiber', 'Audio API'],
        },
        {
          id: 3,
          title: 'Neo Genesis',
          category: 'Yapay Zeka Arayüzü',
          description:
            'Kullanıcının web kamerası aracılığıyla duygusal analizine dayalı olarak düzenini ve renk teorisini uyarlayan deneysel bir üretken arayüz.',
          img: '/images/project-placeholder.jpg',
          color: '#8b5cf6',
          tags: ['TensorFlow.js', 'Generative UI', 'Affectiva'],
        },
        {
          id: 4,
          title: 'Aether Mind',
          category: 'Uzamsal Bilişim',
          description:
            'Karmaşık sinir ağlarını keşfedilebilir takımyıldızlar olarak görselleştirme. Veri bilimcilerin VRda karar ağaçları arasında dolaşması için bir araç.',
          img: '/images/project-placeholder.jpg',
          color: '#3b82f6',
          tags: ['WebXR', 'Data Viz', 'Spatial Audio'],
        },
        {
          id: 5,
          title: 'Solstice',
          category: 'E-Ticaret',
          description:
            'Zamanın aydınlatmayı kontrol ettiği lüks bir saat yapılandırıcısı. Tamamen tarayıcıda raytracing kalitesinde gölgelerle işlenmiştir.',
          img: '/images/project-placeholder.jpg',
          color: '#f59e0b',
          tags: ['R3F', 'PBR Materials', 'Commerce.js'],
        },
      ],
    },
    codeEditor: {
      heading: 'Sınırları Olmayan Bir Yapı',
      description: 'Hazır bir siteden, markaya özel bir deneyime.',
      closingMessage: 'Bu bölüm, sınırsız ihtimallerden yalnızca biri.',
      codeFileName: 'Anasayfa.tsx',
      previewUrl: '/',
      previewLabel: 'localhost:3000',
      backToCode: 'Koda Dön',
      runButton: 'Çalıştır',
      componentsLabel: 'Bileşenler',
      terminalLabel: 'TERMINAL',
      buildCommand: '> npm run build',
      compiling: 'i tsc derleniyor...',
      syntaxError: "x TypeScript Hatası: 'Anasayfa.tsx' dosyasında sözdizimi hatası.",
      buildFailed: '! Derleme başarısız.',
      typeCheckSuccess: 'v Tür kontrolü başarılı.',
      optimizing: 'i Dosyalar optimize ediliyor...',
      buildComplete: 'v Derleme tamamlandı (1.8sn)',
      generatingPreview: 'i Önizleme oluşturuluyor...',
      lineLabel: 'Ln',
      columnLabel: 'Col',
      homepageComponentName: 'Anasayfa',
      homeLabel: 'Anasayfa',
      heroComment: 'Hero Bölümü',
      servicesComment: 'Hizmetler Bölümü',
      showcaseComment: 'Projeler Bölümü',
      codeComment: 'Kod Editörü Bölümü',
      footerComment: 'Footer',
      legacyEditor: {
        codeFileName: 'tema-kurulum.php',
        previewUrl: 'https://agenzion.com/',
        previewLabel: 'agenzion.com',
        backToCode: 'Kuruluma Dön',
        runButton: 'Kur',
        componentsLabel: 'Kurulum',
        terminalLabel: 'WORDPRESS CLI',
        buildCommand: '> wp theme install premium-theme.zip --activate',
        compiling: 'i WordPress çekirdeği ve tema dosyaları hazırlanıyor...',
        syntaxError:
          "x Kurulum Hatası: 'tema-kurulum.php' dosyasında yapılandırma uyuşmazlığı.",
        buildFailed: '! Kurulum başarısız.',
        typeCheckSuccess: 'v Tema paketi doğrulandı.',
        optimizing: 'i Elementor kit ve demo içerik içe aktarılıyor...',
        buildComplete: 'v Eski yöntem kurulumu tamamlandı (4.2sn)',
        generatingPreview: 'i Dış site önizlemesi hazırlanıyor...',
        lineLabel: 'Ln',
        columnLabel: 'Col',
        statusLanguage: 'PHP',
        siteLabel: 'Agenzion Web Studio',
        themeComment: 'WordPress dosyaları sunucuya yüklenir',
        pluginComment: 'Veritabanı bağlantısı ve içerik yapısı hazırlanır',
        contentComment: 'Tema seçilir ve gerekli eklentiler etkinleştirilir',
        deployComment: 'Kalıcı bağlantılar ayarlanır ve site yayına alınır',
        installTitle: 'WordPress Tema Kurulumu',
        installDescription:
          'Hazır tema, Elementor kiti ve demo içerik klasik yöntemle kurulur; kurulum bitince dış site önizlemesi açılır.',
        packageLabel: 'Tema Paketi',
        builderLabel: 'Sayfa Kurucu',
        hostingLabel: 'Sunucu',
        progressLabel: 'Kurulum İlerlemesi',
        readyLabel: 'Hazır',
        navigationItems: ['Kurulum', 'Görünüm', 'Eklentiler', 'Elementor', 'Araçlar'],
      },
    },
    contact: {
      homeHeadingLine1: 'PROJENİZE',
      homeHeadingLine2: 'BAŞLAYALIM',
      successTitle: 'Mesaj Alındı!',
      successBody:
        'Proje detaylarını görüşmek için 24 saat içinde size dönüş yapacağız.',
      sendAnother: 'Yeni bir mesaj gönder',
      pageIntro:
        'İstanbul ofisimizden başlayıp tüm süreci uzaktan birlikte yönetiyoruz.',
      formHelper:
        'Kapsamı netleştirmek için projenizi kısa ve net bir cümleyle özetleyin.',
      nameLabel: 'Ad Soyad',
      namePlaceholder: 'Ali Veli',
      emailLabel: 'E-posta Adresi',
      emailPlaceholder: 'ornek@gmail.com',
      messageLabel: 'Proje Detayları',
      messagePlaceholder: 'Projenizden bahsedin...',
      errorMessage:
        'Mesaj şu anda gönderilemedi. Lütfen tekrar deneyin veya studio@agenzion.com adresine doğrudan yazın.',
      submittingLabel: 'GÖNDERİLİYOR...',
      submitLabel: 'Gönder',
      addressLine1:
        'Ataköy 7-8-9-10. Kısım Mah. Çobançeşme E-5, Yan Yol No: 14/A, İKÜ TEKMER',
      addressLine2: '34158 Bakırköy/İstanbul - TÜRKİYE',
      emailValue: 'studio@agenzion.com',
      emailHint: 'Proje talepleri ve iş birlikleri',
      phoneValue: '+90 (540) 455 34 44',
      phoneHint: 'Pzt - Cum / 09:00 - 18:00',
      pageTitle: 'İletişim',
    },
    blog: {
      title: 'Blog',
      description:
        'Güncel web tasarımı, performans ve dijital ürün geliştirme notları.',
      loading: 'Yükleniyor...',
      emptyDate: 'TARİH YOK',
      categoryFallback: 'GENEL',
      postNotFoundTitle: 'Yazı Bulunamadı',
      backToBlog: "Blog'a geri dön",
      shareLabel: 'Paylaş',
      backLabel: 'Geri Dön',
      allPostsLabel: 'Tüm Yazılar',
      tagsLabel: 'Etiketler',
      shortReadLabel: 'Kısa',
      readSuffix: 'Okuma',
      unspecifiedDate: 'Tarih Belirtilmedi',
      noImage: 'Görsel Yok',
      teamLabel: 'Agenzion Ekibi',
      authorFallback: 'Yazar',
      nextArticleLabel: 'Sıradaki Yazı',
    },
    footer: {
      copyrightName: 'Agenzion Web Studio',
    },
    notFound: {
      code: '404',
      description: 'Aradığınız sayfa bulunamadı.',
      cta: 'Ana Sayfaya Dön',
    },
  },
  en: {
    meta: {
      homeTitle: 'Agenzion Web Studio | Performance-Focused Web Design and Development',
      homeDescription:
        'Agenzion is an Istanbul-based boutique web design and development studio combining performance, SEO, and creative interaction.',
      blogTitle: 'Blog | Agenzion Web Studio',
      blogDescription:
        'Agenzion notes and technical writing on performance, SEO, modern web design, and digital product development.',
      contactTitle: 'Contact | Agenzion Web Studio',
      contactDescription:
        'Talk to Agenzion about your next website, performance improvements, or a new creative digital experience.',
      notFoundTitle: 'Page Not Found | Agenzion Web Studio',
      notFoundDescription:
        'The page you are looking for could not be found. Return to the Agenzion Web Studio homepage to keep browsing.',
    },
    navigation: {
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      socialLabel: 'Social',
      socialLinks: ['INSTAGRAM', 'LINKEDIN', 'BEHANCE'],
      mobileCopyright: 'AGENZION WEB STUDIO',
    },
    hero: {
      primaryTitle: 'Ready?',
      secondaryTitle: 'The time has come.',
      scrollLabel: 'Scroll',
    },
    about: {
      paragraphs: [
        'Not every strong brand creates the same impact online. The real difference appears not in design alone, but in the total experience.',
        'Simply being present in digital is not enough. Real impact is felt the moment the experience begins.',
        'Agenzion brings design, development, and interaction together to move brands beyond ordinary builds and into living digital experiences.',
      ],
    },
    services: {
      heading: 'Services',
      items: [
        {
          id: 1,
          title: 'Web Design',
          description:
            'We design modern, user-focused websites aligned with your brand and audience. Performance, accessibility, and multi-device compatibility stay central throughout the design process.',
          gradient: 'from-blue-600 to-cyan-400',
        },
        {
          id: 2,
          title: 'Application Development',
          description:
            'We build mobile and web applications around your operational needs. Across every project, we prioritize scalable architecture, security, and sustainable performance.',
          gradient: 'from-[#4592AF] to-[#E3C4A8]',
        },
        {
          id: 3,
          title: 'UI/UX Design',
          description:
            'We design intuitive, fluid interfaces by analyzing user behavior in detail. Information architecture, usability, and visual consistency stay at the center of the process.',
          gradient: 'from-orange-600 to-red-500',
        },
        {
          id: 4,
          title: 'Custom Software Solutions',
          description:
            'We develop software tailored to your workflows and operational model. The result is flexible, manageable infrastructure that integrates cleanly with the systems you already use.',
          gradient: 'from-emerald-600 to-green-400',
        },
        {
          id: 5,
          title: 'Headless E-Commerce',
          description:
            'We build robust, scalable e-commerce systems with modern technologies. By balancing design and performance together, we create an architecture that stays sustainable over time.',
          gradient: 'from-amber-500 to-yellow-300',
        },
      ],
    },
    headlessCommerce: {
      sections: [
        {
          title: 'HEADLESS E-COMMERCE',
          text: 'With a headless architecture, we connect content, products, and user experience into a single high-speed flow.',
        },
        {
          title: 'SPEED-DRIVEN INFRASTRUCTURE',
          text: 'By decoupling the storefront from the commerce engine, we build scalable systems that stay fast even during campaign peaks.',
        },
        {
          title: 'EXPERIENCE WITHOUT LIMITS',
          text: 'We remove template constraints and craft brand-specific shopping journeys, flexible content blocks, and conversion-focused interactions.',
        },
        {
          title: 'SUSTAINABLE GROWTH',
          text: 'We align analytics, SEO, and performance in one system so your commerce product grows with measurable, long-term momentum.',
        },
      ],
      indicatorLabel: 'Go to section',
    },
    showcase: {
      heading: 'Projects',
      voyagerLabel: 'Voyager 1',
      reviewLabel: 'View Project',
      emptyLabel: 'No projects added yet.',
      projects: [
        {
          id: 1,
          title: 'Cyber Dust',
          category: 'Immersive Web',
          description:
            'A particle-based 3D environment exploring the fragility of digital memory. Users move through fragmented data clusters in real time.',
          img: '/images/project-placeholder.jpg',
          color: '#06b6d4',
          tags: ['WebGL', 'Three.js', 'Shaders'],
        },
        {
          id: 2,
          title: 'Void Runner',
          category: 'Game Experience',
          description:
            'A high-fidelity browser racing experience set inside a procedurally generated brutalist void, with post-processing overdrive and zero-latency input.',
          img: '/images/project-placeholder.jpg',
          color: '#ef4444',
          tags: ['Physics', 'React Three Fiber', 'Audio API'],
        },
        {
          id: 3,
          title: 'Neo Genesis',
          category: 'AI Interface',
          description:
            'An experimental generative interface that adapts layout and color theory according to emotional analysis from the user camera feed.',
          img: '/images/project-placeholder.jpg',
          color: '#8b5cf6',
          tags: ['TensorFlow.js', 'Generative UI', 'Affectiva'],
        },
        {
          id: 4,
          title: 'Aether Mind',
          category: 'Spatial Computing',
          description:
            'A neural-network visualization system turned into navigable constellations. Built for data scientists moving through decision trees inside VR.',
          img: '/images/project-placeholder.jpg',
          color: '#3b82f6',
          tags: ['WebXR', 'Data Viz', 'Spatial Audio'],
        },
        {
          id: 5,
          title: 'Solstice',
          category: 'E-Commerce',
          description:
            'A luxury watch configurator where time controls the lighting. Rendered fully in-browser with ray-traced quality shadows.',
          img: '/images/project-placeholder.jpg',
          color: '#f59e0b',
          tags: ['R3F', 'PBR Materials', 'Commerce.js'],
        },
      ],
    },
    codeEditor: {
      heading: 'Sınırları Olmayan Bir Yapı',
      description: 'Hazır bir siteden, markaya özel bir deneyime.',
      closingMessage: 'Bu bölüm, sınırsız ihtimallerden yalnızca biri.',
      codeFileName: 'Home.tsx',
      previewUrl: '/en',
      previewLabel: 'localhost:3000/en',
      backToCode: 'Back to Code',
      runButton: 'Run',
      componentsLabel: 'Components',
      terminalLabel: 'TERMINAL',
      buildCommand: '> npm run build',
      compiling: 'i compiling tsc...',
      syntaxError: "x TypeScript Error: syntax error in 'Home.tsx'.",
      buildFailed: '! Build failed.',
      typeCheckSuccess: 'v Type check passed.',
      optimizing: 'i optimizing files...',
      buildComplete: 'v Build completed (1.8s)',
      generatingPreview: 'i generating preview...',
      lineLabel: 'Ln',
      columnLabel: 'Col',
      homepageComponentName: 'Home',
      homeLabel: 'Home',
      heroComment: 'Hero Section',
      servicesComment: 'Services Section',
      showcaseComment: 'Projects Section',
      codeComment: 'Code Editor Section',
      footerComment: 'Footer',
      legacyEditor: {
        codeFileName: 'theme-install.php',
        previewUrl: 'https://agenzion.com/',
        previewLabel: 'agenzion.com',
        backToCode: 'Back to Install',
        runButton: 'Install',
        componentsLabel: 'Setup',
        terminalLabel: 'WORDPRESS CLI',
        buildCommand: '> wp theme install premium-theme.zip --activate',
        compiling: 'i preparing WordPress core and theme files...',
        syntaxError:
          "x Install Error: configuration mismatch in 'theme-install.php'.",
        buildFailed: '! Install failed.',
        typeCheckSuccess: 'v Theme package verified.',
        optimizing: 'i importing Elementor kit and demo content...',
        buildComplete: 'v Legacy setup completed (4.2s)',
        generatingPreview: 'i preparing external site preview...',
        lineLabel: 'Ln',
        columnLabel: 'Col',
        statusLanguage: 'PHP',
        siteLabel: 'Agenzion Web Studio',
        themeComment: 'WordPress files are uploaded to the server',
        pluginComment: 'Database connection and content structure are prepared',
        contentComment: 'The theme is selected and required plugins are enabled',
        deployComment: 'Permalinks are configured and the site goes live',
        installTitle: 'WordPress Theme Setup',
        installDescription:
          'A ready-made theme, Elementor kit, and demo content are installed through the legacy workflow; the external preview opens when setup finishes.',
        packageLabel: 'Theme Package',
        builderLabel: 'Page Builder',
        hostingLabel: 'Hosting',
        progressLabel: 'Setup Progress',
        readyLabel: 'Ready',
        navigationItems: ['Setup', 'Appearance', 'Plugins', 'Elementor', 'Tools'],
      },
    },
    contact: {
      homeHeadingLine1: 'LET US START',
      homeHeadingLine2: 'YOUR PROJECT',
      successTitle: 'Message Received!',
      successBody:
        'We will get back to you within 24 hours to talk through the project details.',
      sendAnother: 'Send another message',
      pageIntro:
        'We coordinate the entire process from our Istanbul office and run delivery closely with you, remotely when needed.',
      formHelper:
        'Summarize your project in one clear sentence so we can align on scope quickly.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Jane Doe',
      emailLabel: 'Email Address',
      emailPlaceholder: 'example@email.com',
      messageLabel: 'Project Details',
      messagePlaceholder: 'Tell us about your project...',
      errorMessage:
        'Your message could not be sent right now. Please try again or email studio@agenzion.com directly.',
      submittingLabel: 'SENDING...',
      submitLabel: 'Send',
      addressLine1:
        'Atakoy 7-8-9-10. Kisim Mah. Cobancesme E-5, Side Road No: 14/A, IKU TEKMER',
      addressLine2: '34158 Bakirkoy / Istanbul - TURKEY',
      emailValue: 'studio@agenzion.com',
      emailHint: 'Project requests and partnerships',
      phoneValue: '+90 (540) 455 34 44',
      phoneHint: 'Mon - Fri / 09:00 - 18:00',
      pageTitle: 'Contact',
    },
    blog: {
      title: 'Blog',
      description:
        'Notes on contemporary web design, performance, and digital product development.',
      loading: 'Loading...',
      emptyDate: 'NO DATE',
      categoryFallback: 'GENERAL',
      postNotFoundTitle: 'Post Not Found',
      backToBlog: 'Back to Blog',
      shareLabel: 'Share',
      backLabel: 'Back',
      allPostsLabel: 'All Posts',
      tagsLabel: 'Tags',
      shortReadLabel: 'Short',
      readSuffix: 'Read',
      unspecifiedDate: 'Date Not Specified',
      noImage: 'No Image',
      teamLabel: 'Agenzion Team',
      authorFallback: 'Author',
      nextArticleLabel: 'Next Article',
    },
    footer: {
      copyrightName: 'Agenzion Web Studio',
    },
    notFound: {
      code: '404',
      description: 'The page you are looking for could not be found.',
      cta: 'Back to Home',
    },
  },
} as const;

export type SiteContent = (typeof siteContent)[Locale];

const SITE_CONTENT_QUERY = /* groq */ `
  *[_type == "siteContent" && language == $locale][0]{
    meta,
    navigation,
    hero,
    about,
    services,
    headlessCommerce,
    showcase,
    codeEditor,
    contact,
    blog,
    footer,
    notFound
  }
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function mergeContent<T>(fallback: T, override: unknown): T {
  if (override === null || override === undefined) {
    return fallback;
  }

  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T;
  }

  if (isRecord(fallback) && isRecord(override)) {
    const merged: Record<string, unknown> = { ...fallback };

    for (const [key, value] of Object.entries(override)) {
      merged[key] = mergeContent(merged[key], value);
    }

    return merged as T;
  }

  return override as T;
}

export function getStaticLocaleContent(locale: Locale) {
  return siteContent[locale];
}

export async function getLocaleContent(locale: Locale): Promise<SiteContent> {
  const content = await sanityFetch<Partial<SiteContent>>(SITE_CONTENT_QUERY, { locale });
  return mergeContent(siteContent[locale], content);
}
