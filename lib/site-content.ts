import type { Locale } from '@/lib/i18n';

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
      aboutTitle: 'Hakkımızda | Agenzion Web Studio',
      aboutDescription:
        'Agenzion; strateji, tasarım, hareket ve geliştirmeyi tek akışta birleştiren butik web stüdyosudur.',
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
      ],
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
      heading: 'İÇ MEKANİZMA BİZDE',
      description:
        'Projelerde kullanılan tüm arayüz ve sistem bileşenleri, kendi geliştirme süreçlerimizden geçer. Bu yaklaşım, daha kontrollü, optimize ve ölçeklenebilir ürünler ortaya çıkarır.',
      codeFileName: 'Anasayfa.tsx',
      previewUrl: '/',
      previewLabel: 'localhost:3000',
      backToCode: 'Koda Dön',
      runButton: 'Çalıştır',
      componentsLabel: 'Bileşenler',
      terminalLabel: 'TERMINAL',
      folderName: 'agenzion-ui-kit',
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
      submittingLabel: 'GÖNDERİLİYOR...',
      submitLabel: 'TEKLİF AL',
      addressLine1:
        'Ataköy 7-8-9-10. Kısım Mah. Çobançeşme E-5, Yan Yol No: 14/A, İKÜ TEKMER',
      addressLine2: '34158 Bakırköy/İstanbul - TÜRKİYE',
      emailValue: 'info@agenzion.com',
      emailHint: 'Proje talepleri ve iş birlikleri',
      phoneValue: '+90 (540) 455 34 44',
      phoneHint: 'Pzt - Cum / 09:00 - 18:00',
      pageTitle: 'İletişim',
    },
    aboutManifesto: {
      sections: [
        {
          title: 'agenzion',
          text: 'Agenzion, strateji, tasarım ve geliştirmeyi tek akışta buluşturarak markalar için kalıcı dijital deneyimler kurgulayan butik bir web stüdyosudur.',
        },
        {
          title: 'DİJİTALİN MİMARLARI',
          text: 'Agenzion Web Studio olarak, markanızın dijital evrendeki kalıcı kimliğini inşa ediyoruz. Estetik ve fonksiyonelliği kusursuz bir dengeyle buluşturarak, sıradanlığın ötesine geçen web deneyimleri tasarlıyoruz.',
        },
        {
          title: 'SINIRLARIN ÖTESİNDE',
          text: 'Her pikselde bir hikaye, her satır kodda bir amaç gizli. Şablonları reddediyor, markanıza özel, yenilikçi ve akılda kalıcı dijital sanat eserleri yaratıyoruz. Bizim için web tasarımı, bir vizyon meselesidir.',
        },
        {
          title: 'GELECEĞİ KODLUYORUZ',
          text: 'Teknolojinin hızına ayak uydurmakla kalmıyor, ona yön veriyoruz. Agenzion ile dijital dönüşümünüzü başlatın, sektörünüzde her zaman bir adım önde olun ve geleceğin standartlarını bugünden belirleyin.',
        },
        {
          title: 'BİRLİKTE BAŞLAYALIM',
          text: 'Yeni bir lansman, yeniden konumlanan bir marka ya da sıfırdan kurgulanacak bir dijital deneyim... Net strateji, güçlü tasarım ve çalışan bir ürün için doğru başlangıcı birlikte kuralım.',
          showsFooter: true,
        },
      ],
      indicatorLabel: 'Bölüme git',
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
      copyrightName: 'Agenzion Web Stüdyosu',
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
      aboutTitle: 'About | Agenzion Web Studio',
      aboutDescription:
        'Agenzion is a boutique web studio bringing strategy, design, motion, and development into a single flow.',
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
      ],
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
      heading: 'THE ENGINE ROOM IS OURS',
      description:
        'Every interface and system component used in our projects goes through our own development process. That gives us tighter control, cleaner optimization, and more scalable products.',
      codeFileName: 'Home.tsx',
      previewUrl: '/en',
      previewLabel: 'localhost:3000/en',
      backToCode: 'Back to Code',
      runButton: 'Run',
      componentsLabel: 'Components',
      terminalLabel: 'TERMINAL',
      folderName: 'agenzion-ui-kit',
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
      submittingLabel: 'SENDING...',
      submitLabel: 'GET A QUOTE',
      addressLine1:
        'Atakoy 7-8-9-10. Kisim Mah. Cobancesme E-5, Side Road No: 14/A, IKU TEKMER',
      addressLine2: '34158 Bakirkoy / Istanbul - TURKEY',
      emailValue: 'info@agenzion.com',
      emailHint: 'Project requests and partnerships',
      phoneValue: '+90 (540) 455 34 44',
      phoneHint: 'Mon - Fri / 09:00 - 18:00',
      pageTitle: 'Contact',
    },
    aboutManifesto: {
      sections: [
        {
          title: 'agenzion',
          text: 'Agenzion is a boutique web studio that brings strategy, design, and development into a single flow to shape lasting digital experiences for brands.',
        },
        {
          title: 'ARCHITECTS OF DIGITAL',
          text: 'At Agenzion Web Studio, we build the lasting identity of your brand in the digital universe. By balancing aesthetics and function with precision, we design web experiences that move beyond the ordinary.',
        },
        {
          title: 'BEYOND LIMITS',
          text: 'Every pixel carries a story and every line of code has intent. We reject templates and craft bold, memorable digital works tailored to your brand. For us, web design is a matter of vision.',
        },
        {
          title: 'WE CODE THE FUTURE',
          text: 'We do more than keep up with technology. We help shape it. Start your digital transformation with Agenzion, stay ahead of your category, and define tomorrow standards today.',
        },
        {
          title: 'LET US BEGIN',
          text: 'A new launch, a repositioned brand, or a digital experience built from zero... We can establish the right starting point together with clear strategy, strong design, and a product that works.',
          showsFooter: true,
        },
      ],
      indicatorLabel: 'Go to section',
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

export function getLocaleContent(locale: Locale) {
  return siteContent[locale];
}
