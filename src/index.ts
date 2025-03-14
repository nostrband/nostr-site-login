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
  initBanner()
  initListeners()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init())
else init()
