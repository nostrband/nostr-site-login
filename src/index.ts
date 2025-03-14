import { EventNeedAuth } from './types'
import { ModalLogin } from './components/ns-modal-login'
import { BannerConfirmEmail } from './components/ns-login-banner'
import './components'
import './fonts.css'

const BANNER_LS_KEY = 'ns-login-banner-show'

function initBanner() {
  try {
    if (localStorage.getItem(BANNER_LS_KEY) !== 'true') return
    if (document.querySelector('ns-login-banner')) return
    const banner = document.createElement('ns-login-banner') as BannerConfirmEmail
    document.body.append(banner)
  } catch (error) {
    console.log(error)
  }
}

const currentScript = document.currentScript

async function initListeners() {
  document.addEventListener('nlNeedAuth', (e: EventNeedAuth) => {
    const { nostrconnect = '' } = e.detail
    if (!nostrconnect.startsWith('nostrconnect://')) return
    const modal = document.createElement('ns-modal-login') as ModalLogin
    if (!document.body) return
    const accentColor = currentScript.getAttribute('data-accent-color')
    const textColor = currentScript.getAttribute('data-text-color')
    document.body.append(modal)
    modal.show()
    modal.nostrconnect = nostrconnect
    modal.accentColor = accentColor || '#8b5cf6'
    modal.textColor = textColor || '#ffffff'
  })
}

const init = () => {
  initBanner()
  initListeners()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init())
else init()
