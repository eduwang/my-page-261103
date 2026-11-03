import './style.css'

const menuButton = document.querySelector('.menu-toggle')
const navigation = document.querySelector('.main-nav')

function setMenuOpen(open) {
  menuButton.setAttribute('aria-expanded', String(open))
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
  navigation.classList.toggle('is-open', open)
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true')
})

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false)
    menuButton.focus()
  }
})

document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) setMenuOpen(false)
})

const desktop = window.matchMedia('(min-width: 761px)')
desktop.addEventListener('change', () => setMenuOpen(false))
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if ('IntersectionObserver' in window) {
  if (!reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('reveal-pending')
      revealObserver.observe(element)
    })
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      navigation.querySelectorAll('a').forEach((link) => {
        if (link.hash === `#${entry.target.id}`) {
          link.setAttribute('aria-current', 'location')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    })
  }, { rootMargin: '-15% 0px -65% 0px' })
  document.querySelectorAll('main > section').forEach((section) => sectionObserver.observe(section))
}

const scene = document.querySelector('.math-scene')
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
scene.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || !finePointer.matches) return
  const bounds = scene.getBoundingClientRect()
  scene.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 18}px`)
  scene.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 18}px`)
})
scene.addEventListener('pointerleave', () => {
  scene.style.setProperty('--pointer-x', '0px')
  scene.style.setProperty('--pointer-y', '0px')
})
