import Link from 'next/link'

const LINKS = {
  'Платформа': [
    { label: 'Знайти ментора', href: '/mentors' },
    { label: 'Стати ментором', href: '/become-mentor' },
    { label: 'Як це працює',   href: '/#how-it-works' },
    { label: 'Тарифи',         href: '/#pricing' },
  ],
  'Підтримка': [
    { label: 'FAQ',            href: '/faq' },
    { label: 'Контакти',       href: '/contact' },
    { label: 'Блог',           href: '/blog' },
  ],
  'Правове': [
    { label: 'Умови використання', href: '/terms' },
    { label: 'Конфіденційність',   href: '/privacy' },
    { label: 'Cookie',             href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7C2 4.24 4.24 2 7 2s5 2.24 5 5-2.24 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 5v4M5 7h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-serif text-white text-lg">
                Skill<em className="text-brand-400 not-italic">Bridge</em>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Миттєвий доступ до реальних фахівців. Без довгих курсів і підписок.
            </p>
            <p className="text-xs text-stone-500">Зроблено в Україні</p>
          </div>

          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-medium text-stone-300 uppercase tracking-widest mb-4">{title}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-600">
          <p>© {new Date().getFullYear()} SkillBridge. Всі права захищено.</p>
          <p>Безпечна оплата через Stripe</p>
        </div>
      </div>
    </footer>
  )
}
