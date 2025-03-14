import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TWStyles } from '../../modules/tw/twlit'
import { Icons } from '../../assets/icons'

@customElement('ns-login-banner')
export class BannerConfirmEmail extends LitElement {
  @state() isClosing = false

  static styles = [
    TWStyles,
    css`
      :host {
        display: block;
      }
    `,
  ]

  private _handleCloseBanner() {
    this.isClosing = true
  }

  private _handleAnimationEnd() {
    if (this.isClosing) this.remove()
  }

  render() {
    return html`
      <div class="px-[16px] fixed top-[16px] left-1/2 transform -translate-x-1/2 w-full max-w-[384px]">
        <div
          id="email-banner"
          class="
            flex items-center justify-between gap-[12px]
            bg-yellow-100 border border-yellow-400 text-yellow-800 px-[16px] py-[12px]
            rounded-lg shadow
            ${this.isClosing ? 'animate-slide-out' : 'animate-slide-in'}
          "
          role="alert"
          @animationend=${this._handleAnimationEnd}
        >
          <span class="font-semibold">Please confirm your email</span>
          <button
            type="button"
            class="text-yellow-800 hover:text-yellow-900 font-bold focus:outline-none"
            aria-label="Close"
            @click=${this._handleCloseBanner}
          >
            ${Icons.Close}
          </button>
        </div>
      </div>
    `
  }
}
