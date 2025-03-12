import { EventNeedAuth } from './types'
import { ModalLogin } from './components'
import './components'

function loadFonts() {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap')
  document.head.appendChild(link)
}

async function initListeners() {
  document.addEventListener('nlNeedAuth', (e: EventNeedAuth) => {
    const { nostrconnect } = e.detail
    if (!nostrconnect.startsWith('nostrconnect://')) return
    const modal = document.createElement('ns-modal-login') as ModalLogin
    if (!document.body) return
    document.body.append(modal)
    modal.show()
    modal.nostrconnect = nostrconnect
  })
}

const init = () => {
  loadFonts()
  initListeners()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init())
else init()
