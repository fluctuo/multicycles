const langs = ['fr', 'de', 'zh', 'en']

export default function getLanguage() {
  const fromStorage = localStorage.getItem('lang')
  const detected = langs.find(el => navigator.language.includes(el))

  return fromStorage || detected || 'en'
}
