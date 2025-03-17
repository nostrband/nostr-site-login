import { EventNeedAuth } from './types'
import { ModalLogin } from './components/ns-modal-login'
import { BannerConfirmEmail } from './components/ns-login-banner'
import { ModalWelcome } from './components/ns-modal-welcome'
import './components'
import './fonts.css'

const currentScript = document.currentScript
const accentColor = currentScript.getAttribute('data-accent-color')
const textColor = currentScript.getAttribute('data-text-color')

async function initListeners() {
  document.addEventListener('nlNeedAuth', (e: EventNeedAuth) => {
    const { nostrconnect = '' } = e.detail
    if (!nostrconnect.startsWith('nostrconnect://')) return
    const modal = document.createElement('ns-modal-login') as ModalLogin
    if (!document.body) return
    document.body.append(modal)
    modal.show()
    modal.nostrconnect = nostrconnect
    modal.accentColor = accentColor || '#8b5cf6'
    modal.textColor = textColor || '#ffffff'
  })

  document.addEventListener('nlAuth', async (e: CustomEvent) => {
    if (e.detail.type === 'logout') {
      document.querySelector('ns-login-banner')?.remove()
    } else {
      if (document.querySelector('ns-login-banner')) return

      const ns = window.nostrSite!
      await ns.tabReady
      const profiles = await ns.renderer.fetchProfiles([e.detail.pubkey])
      // console.log('login profile', profiles)
      if (profiles.length) {
        const p = profiles[0]
        const c = p.event.tags.find((t) => t.length > 1 && t[0] === 'created')?.[1]
        const r = p.event.tags.find((t) => t.length > 1 && t[0] === 'r')?.[1]
        // console.log({ c, r })
        // user signed up recently on our site with email
        if (c && r && Number(c) * 1000 > Date.now() - 7 * 24 * 3600 * 1000 && r === window.location.origin) {
          const label = await ns.renderer.fetchEvent(
            { authors: [p.pubkey], kinds: [1985], '#l': ['complete', 'app.nsec'] },
            { outboxRelays: true }
          )
          if (!label) {
            const banner = document.createElement('ns-login-banner') as BannerConfirmEmail
            document.body.append(banner)
          }
        }
      }
    }
  })
}

const SIGN_UP_COMPLETE_HASH_KEY = '#email-signup-complete'

function initWelcomeModal() {
  try {
    const hashParams = new URLSearchParams(window.location.hash)
    const isSignUpCompelete = hashParams.get(SIGN_UP_COMPLETE_HASH_KEY) === 'true'
    if (!isSignUpCompelete) return
    const urlWithoutHash = `${window.location.pathname}${window.location.search}`
    history.replaceState(null, '', urlWithoutHash)
    const modal = document.createElement('ns-modal-welcome') as ModalWelcome
    modal.show()
    modal.accentColor = accentColor || '#8b5cf6'
    modal.textColor = textColor || '#ffffff'
    document.body.append(modal)
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  initListeners()
  initWelcomeModal()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init())
else init()
