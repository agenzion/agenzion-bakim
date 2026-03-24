import type { Locale } from '@/lib/i18n';

export const localeMeta = {
  tr: {
    languageTag: 'tr-TR',
    openGraphLocale: 'tr_TR',
    keywords: [
      'web tasarim',
      'web gelistirme',
      'performans optimizasyonu',
      'seo',
      'yaratici web studyosu',
      'istanbul web studyosu',
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
      homeTitle: 'Agenzion Web Studio | Performans Odakli Web Tasarim ve Gelistirme',
      homeDescription:
        'Agenzion; performans, SEO ve yaratici etkilesimi birlikte ele alan Istanbul merkezli butik web tasarim ve gelistirme studyosudur.',
      aboutTitle: 'Hakkimizda | Agenzion Web Studio',
      aboutDescription:
        'Agenzion; strateji, tasarim, hareket ve gelistirmeyi tek akista birlestiren butik web studyosudur.',
      blogTitle: 'Blog | Agenzion Web Studio',
      blogDescription:
        'Performans, SEO, modern web tasarim ve dijital urun gelistirme uzerine Agenzion notlari ve teknik icerikler.',
      contactTitle: 'Iletisim | Agenzion Web Studio',
      contactDescription:
        'Agenzion ile yeni web projenizi, performans iyilestirmelerinizi veya yaratici dijital deneyim ihtiyacinizi konusmak icin iletisime gecin.',
      notFoundTitle: 'Sayfa Bulunamadi | Agenzion Web Studio',
      notFoundDescription:
        'Istediginiz sayfa bulunamadi. Agenzion Web Studio ana sayfasina donerek gezinmeye devam edebilirsiniz.',
    },
    navigation: {
      about: 'Hakkimizda',
      blog: 'Blog',
      contact: 'Iletisim',
      openMenu: 'Menuyu ac',
      closeMenu: 'Menuyu kapat',
      socialLabel: 'Sosyal Medya',
      socialLinks: ['INSTAGRAM', 'LINKEDIN', 'BEHANCE'],
      mobileCopyright: 'AGENZION WEB STUDIO',
    },
    hero: {
      primaryTitle: 'Hazir misiniz?',
      secondaryTitle: 'Zamani geldi.',
      scrollLabel: 'Kaydirin',
    },
    about: {
      paragraphs: [
        'Her guclu marka, dijitalde ayni etkiyi yaratamaz. Cunku gercek fark; tasarimda degil, deneyimin butununde ortaya cikar.',
        'Dijitalde var olmak yeterli degildir. Asil etki, deneyim basladigi anda hissedilir.',
        'Agenzion; tasarim, yazilim ve etkilesimi bir araya getirerek markalari siradan yapilardan cikarir, yasayan dijital deneyimlere donusturur.',
      ],
    },
    services: {
      heading: 'Hizmetler',
      items: [
        {
          id: 1,
          title: 'Web Tasarim',
          description:
            'Markaniza ve hedef kitlenize uygun, modern ve kullanici odakli web siteleri tasarliyoruz. Tasarim surecinde performans, erisilebilirlik ve coklu cihaz uyumlulugunu temel aliyoruz.',
          gradient: 'from-blue-600 to-cyan-400',
        },
        {
          id: 2,
          title: 'Uygulama Gelistirme',
          description:
            'Is ihtiyaclariniza yonelik mobil ve web tabanli uygulamalar gelistiriyoruz. Tum projelerde olceklenebilir altyapi, guvenlik ve surdurulebilir performansi onceliklendiriyoruz.',
          gradient: 'from-[#4592AF] to-[#E3C4A8]',
        },
        {
          id: 3,
          title: 'UI/UX Tasarim',
          description:
            'Kullanici davranislarini analiz ederek sezgisel ve akici arayuz deneyimleri tasarliyoruz. Bilgi mimarisi, kullanilabilirlik ve gorsel tutarliligi tasarim surecinin merkezine aliyoruz.',
          gradient: 'from-orange-600 to-red-500',
        },
        {
          id: 4,
          title: 'Ozel Yazilim Cozumleri',
          description:
            'Operasyonel sureclerinize ozel, ihtiyaca gore sekillenen yazilim cozumleri gelistiriyoruz. Mevcut sistemlerle entegre calisabilen, esnek ve yonetilebilir altyapilar kurguluyoruz.',
          gradient: 'from-emerald-600 to-green-400',
        },
      ],
    },
    showcase: {
      heading: 'Projeler',
      voyagerLabel: 'Voyager 1',
      projects: [
        {
          id: 1,
          title: 'Cyber Dust',
          category: 'Surukleyici Web',
          description:
            'Dijital hafizanin kirilganligini kesfeden parcacik tabanli 3D ortam. Kullanicilar, parcalanan veri kumeleri arasinda gercek zamanli olarak gezinir.',
          img: 'https://picsum.photos/seed/cyber/1200/1200',
          color: '#06b6d4',
          tags: ['WebGL', 'Three.js', 'Shaders'],
        },
        {
          id: 2,
          title: 'Void Runner',
          category: 'Oyun Deneyimi',
          description:
            'Prosedurel olarak olusturulmus brutalist bir boslukta gecen yuksek kaliteli tarayici tabanli yaris deneyimi. Post-processing overdrive ile sifir gecikmeli giris.',
          img: 'https://picsum.photos/seed/void/1200/1200',
          color: '#ef4444',
          tags: ['Physics', 'React Three Fiber', 'Audio API'],
        },
        {
          id: 3,
          title: 'Neo Genesis',
          category: 'Yapay Zeka Arayuzu',
          description:
            'Kullanicinin web kamerasi araciligiyla duygusal analizine dayali olarak duzenini ve renk teorisini uyarlayan deneysel bir uretken arayuz.',
          img: 'https://picsum.photos/seed/neo/1200/1200',
          color: '#8b5cf6',
          tags: ['TensorFlow.js', 'Generative UI', 'Affectiva'],
        },
        {
          id: 4,
          title: 'Aether Mind',
          category: 'Uzamsal Bilisim',
          description:
            'Karmasik sinir aglarini kesfedilebilir takimyildizlar olarak gorsellestirme. Veri bilimcilerin VRda karar aglari arasinda dolasmasi icin bir arac.',
          img: 'https://picsum.photos/seed/aether/1200/1200',
          color: '#3b82f6',
          tags: ['WebXR', 'Data Viz', 'Spatial Audio'],
        },
        {
          id: 5,
          title: 'Solstice',
          category: 'E-Ticaret',
          description:
            'Zamanin aydinlatmayi kontrol ettigi luks bir saat yapilandiricisi. Tamamen tarayicida raytracing kalitesinde golgelerle islenmistir.',
          img: 'https://picsum.photos/seed/solstice/1200/1200',
          color: '#f59e0b',
          tags: ['R3F', 'PBR Materials', 'Commerce.js'],
        },
      ],
    },
    codeEditor: {
      heading: 'IC MEKANIZMA BIZDE',
      description:
        'Projelerde kullanilan tum arayuz ve sistem bilesenleri, kendi gelistirme sureclerimizden gecer. Bu yaklasim, daha kontrollu, optimize ve olceklenebilir urunler ortaya cikarir.',
      codeFileName: 'Anasayfa.tsx',
      previewUrl: '/',
      previewLabel: 'localhost:3000',
      backToCode: 'Koda Don',
      runButton: 'Calistir',
      componentsLabel: 'Bilesenler',
      terminalLabel: 'TERMINAL',
      folderName: 'agenzion-ui-kit',
      buildCommand: '> npm run build',
      compiling: 'i tsc derleniyor...',
      syntaxError: "x TypeScript Hatasi: 'Anasayfa.tsx' dosyasinda sozdizimi hatasi.",
      buildFailed: '! Derleme basarisiz.',
      typeCheckSuccess: 'v Tur kontrolu basarili.',
      optimizing: 'i Dosyalar optimize ediliyor...',
      buildComplete: 'v Derleme tamamlandi (1.8sn)',
      generatingPreview: 'i Onizleme olusturuluyor...',
      lineLabel: 'Ln',
      columnLabel: 'Col',
      homepageComponentName: 'Anasayfa',
      homeLabel: 'Anasayfa',
      heroComment: 'Hero Bolumu',
      servicesComment: 'Hizmetler Bolumu',
      showcaseComment: 'Projeler Bolumu',
      codeComment: 'Kod Editoru Bolumu',
      footerComment: 'Footer',
    },
    contact: {
      homeHeadingLine1: 'PROJENIZE',
      homeHeadingLine2: 'BASLAYALIM',
      successTitle: 'Mesaj Alindi!',
      successBody:
        'Proje detaylarini gorusmek icin 24 saat icinde size donus yapacagiz.',
      sendAnother: 'Yeni bir mesaj gonder',
      pageIntro:
        'Istanbul ofisimizden baslayip tum sureci uzaktan birlikte yonetiyoruz.',
      formHelper:
        'Kapsami netlestirmek icin projenizi kisa ve net bir cumleyle ozetleyin.',
      nameLabel: 'Ad Soyad',
      namePlaceholder: 'Ali Veli',
      emailLabel: 'E-posta Adresi',
      emailPlaceholder: 'ornek@gmail.com',
      messageLabel: 'Proje Detaylari',
      messagePlaceholder: 'Projenizden bahsedin...',
      submittingLabel: 'GONDERILIYOR...',
      submitLabel: 'TEKLIF AL',
      addressLine1:
        'Atakoy 7-8-9-10. Kisim Mah. Cobancesme E-5, Yan Yol No: 14/A, IKU TEKMER',
      addressLine2: '34158 Bakirkoy/Istanbul - TURKIYE',
      emailValue: 'info@agenzion.com',
      emailHint: 'Proje talepleri ve is birlikleri',
      phoneValue: '+90 (540) 455 34 44',
      phoneHint: 'Pzt - Cum / 09:00 - 18:00',
      pageTitle: 'Iletisim',
    },
    aboutManifesto: {
      sections: [
        {
          title: 'agenzion',
          text: 'Agenzion, strateji, tasarim ve gelistirmeyi tek akista bulusturarak markalar icin kalici dijital deneyimler kurgulayan butik bir web studyosudur.',
        },
        {
          title: 'DIJITALIN MIMARLARI',
          text: 'Agenzion Web Studio olarak, markanizin dijital evrendeki kalici kimligini insa ediyoruz. Estetik ve fonksiyonelligi kusursuz bir dengeyle bulusturarak, siradanligin otesine gecen web deneyimleri tasarliyoruz.',
        },
        {
          title: 'SINIRLARIN OTESINDE',
          text: 'Her pikselde bir hikaye, her satir kodda bir amac gizli. Sablonlari reddediyor, markaniza ozel, yenilikci ve akilda kalici dijital sanat eserleri yaratiyoruz. Bizim icin web tasarimi, bir vizyon meselesidir.',
        },
        {
          title: 'GELECEGI KODLUYORUZ',
          text: 'Teknolojinin hizina ayak uydurmakla kalmiyor, ona yon veriyoruz. Agenzion ile dijital donusumunuzu baslatin, sektorunuzde her zaman bir adim onde olun ve gelecegin standartlarini bugunden belirleyin.',
        },
        {
          title: 'BIRLIKTE BASLAYALIM',
          text: 'Yeni bir lansman, yeniden konumlanan bir marka ya da sifirdan kurgulanacak bir dijital deneyim... Net strateji, guclu tasarim ve calisan bir urun icin dogru baslangici birlikte kuralim.',
          showsFooter: true,
        },
      ],
      indicatorLabel: 'Bolume git',
    },
    blog: {
      title: 'Blog',
      description:
        'Guncel web tasarim, performans ve dijital urun gelistirme notlari.',
      loading: 'Yukleniyor...',
      emptyDate: 'TARIH YOK',
      categoryFallback: 'GENEL',
      postNotFoundTitle: 'Yazi Bulunamadi',
      backToBlog: "Blog'a geri don",
      shareLabel: 'Paylas',
      backLabel: 'Geri Don',
      allPostsLabel: 'Tum Yazilar',
      tagsLabel: 'Etiketler',
      shortReadLabel: 'Kisa',
      readSuffix: 'Okuma',
      unspecifiedDate: 'Tarih Belirtilmedi',
      noImage: 'Gorsel Yok',
      teamLabel: 'Agenzion Ekibi',
      authorFallback: 'Yazar',
      nextArticleLabel: 'Siradaki Yazi',
    },
    footer: {
      copyrightName: 'Agenzion Web Studyosu',
    },
    notFound: {
      code: '404',
      description: 'Aradiginiz sayfa bulunamadi.',
      cta: 'Ana Sayfaya Don',
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
      projects: [
        {
          id: 1,
          title: 'Cyber Dust',
          category: 'Immersive Web',
          description:
            'A particle-based 3D environment exploring the fragility of digital memory. Users move through fragmented data clusters in real time.',
          img: 'https://picsum.photos/seed/cyber/1200/1200',
          color: '#06b6d4',
          tags: ['WebGL', 'Three.js', 'Shaders'],
        },
        {
          id: 2,
          title: 'Void Runner',
          category: 'Game Experience',
          description:
            'A high-fidelity browser racing experience set inside a procedurally generated brutalist void, with post-processing overdrive and zero-latency input.',
          img: 'https://picsum.photos/seed/void/1200/1200',
          color: '#ef4444',
          tags: ['Physics', 'React Three Fiber', 'Audio API'],
        },
        {
          id: 3,
          title: 'Neo Genesis',
          category: 'AI Interface',
          description:
            'An experimental generative interface that adapts layout and color theory according to emotional analysis from the user camera feed.',
          img: 'https://picsum.photos/seed/neo/1200/1200',
          color: '#8b5cf6',
          tags: ['TensorFlow.js', 'Generative UI', 'Affectiva'],
        },
        {
          id: 4,
          title: 'Aether Mind',
          category: 'Spatial Computing',
          description:
            'A neural-network visualization system turned into navigable constellations. Built for data scientists moving through decision trees inside VR.',
          img: 'https://picsum.photos/seed/aether/1200/1200',
          color: '#3b82f6',
          tags: ['WebXR', 'Data Viz', 'Spatial Audio'],
        },
        {
          id: 5,
          title: 'Solstice',
          category: 'E-Commerce',
          description:
            'A luxury watch configurator where time controls the lighting. Rendered fully in-browser with ray-traced quality shadows.',
          img: 'https://picsum.photos/seed/solstice/1200/1200',
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
