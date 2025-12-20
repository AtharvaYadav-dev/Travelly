import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    planner: 'Planner',
    saved: 'Saved Trips',
    profile: 'Profile',

    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',

    // Planner
    planYourTrip: 'Plan Your Dream Trip',
    destination: 'Destination',
    budget: 'Budget',
    duration: 'Duration',
    travelers: 'Travelers',
    tripType: 'Trip Type',
    generateItinerary: 'Generate Itinerary',

    // Features
    compareTrips: 'Compare Trips',
    myPassport: 'My Passport',
    bucketList: 'Bucket List',
    analytics: 'Analytics',
    mergeTrips: 'Merge Trips',
    preferences: 'Preferences',
    referral: 'Referral',
    versions: 'Versions',
    journal: 'Journal',
    duplicate: 'Duplicate',
  },
  es: {
    // Navigation
    home: 'Inicio',
    planner: 'Planificador',
    saved: 'Viajes Guardados',
    profile: 'Perfil',

    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',

    // Planner
    planYourTrip: 'Planifica Tu Viaje Soñado',
    destination: 'Destino',
    budget: 'Presupuesto',
    duration: 'Duración',
    travelers: 'Viajeros',
    tripType: 'Tipo de Viaje',
    generateItinerary: 'Generar Itinerario',

    // Features
    compareTrips: 'Comparar Viajes',
    myPassport: 'Mi Pasaporte',
    bucketList: 'Lista de Deseos',
    analytics: 'Análisis',
    mergeTrips: 'Combinar Viajes',
    preferences: 'Preferencias',
    referral: 'Referidos',
    versions: 'Versiones',
    journal: 'Diario',
    duplicate: 'Duplicar',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    planner: 'Planificateur',
    saved: 'Voyages Sauvegardés',
    profile: 'Profil',

    // Common
    loading: 'Chargement...',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',

    // Planner
    planYourTrip: 'Planifiez Votre Voyage de Rêve',
    destination: 'Destination',
    budget: 'Budget',
    duration: 'Durée',
    travelers: 'Voyageurs',
    tripType: 'Type de Voyage',
    generateItinerary: 'Générer Itinéraire',

    // Features
    compareTrips: 'Comparer Voyages',
    myPassport: 'Mon Passeport',
    bucketList: 'Liste de Souhaits',
    analytics: 'Analytique',
    mergeTrips: 'Fusionner Voyages',
    preferences: 'Préférences',
    referral: 'Parrainage',
    versions: 'Versions',
    journal: 'Journal',
    duplicate: 'Dupliquer',
  },
  de: {
    // Navigation
    home: 'Startseite',
    planner: 'Planer',
    saved: 'Gespeicherte Reisen',
    profile: 'Profil',

    // Common
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',

    // Planner
    planYourTrip: 'Planen Sie Ihre Traumreise',
    destination: 'Reiseziel',
    budget: 'Budget',
    duration: 'Dauer',
    travelers: 'Reisende',
    tripType: 'Reiseart',
    generateItinerary: 'Reiseplan Erstellen',

    // Features
    compareTrips: 'Reisen Vergleichen',
    myPassport: 'Mein Reisepass',
    bucketList: 'Wunschliste',
    analytics: 'Analytik',
    mergeTrips: 'Reisen Zusammenführen',
    preferences: 'Einstellungen',
    referral: 'Empfehlung',
    versions: 'Versionen',
    journal: 'Tagebuch',
    duplicate: 'Duplizieren',
  },
  ja: {
    // Navigation
    home: 'ホーム',
    planner: 'プランナー',
    saved: '保存された旅行',
    profile: 'プロフィール',

    // Common
    loading: '読み込み中...',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    close: '閉じる',

    // Planner
    planYourTrip: '夢の旅行を計画',
    destination: '目的地',
    budget: '予算',
    duration: '期間',
    travelers: '旅行者',
    tripType: '旅行タイプ',
    generateItinerary: '旅程を作成',

    // Features
    compareTrips: '旅行を比較',
    myPassport: 'マイパスポート',
    bucketList: 'バケットリスト',
    analytics: '分析',
    mergeTrips: '旅行を統合',
    preferences: '設定',
    referral: '紹介',
    versions: 'バージョン',
    journal: '日記',
    duplicate: '複製',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved) return saved;

    // Auto-detect browser language
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;

    // Set RTL for Arabic, Hebrew, etc.
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
