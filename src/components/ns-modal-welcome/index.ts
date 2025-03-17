import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { TWStyles } from '../../modules/tw/twlit'
import { Icons } from '../../assets/icons'

@customElement('ns-modal-welcome')
export class ModalWelcome extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
    TWStyles,
  ]

  @property({ type: String }) accentColor = '#8b5cf6'
  @property({ type: String }) textColor = '#ffffff'
  @query('#ns-welcome-dialog') dialog: HTMLDialogElement | undefined

  @state() open = false

  show(): void {
    this.open = true
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  updated() {
    if (!this.open) return
    this.dialog.showModal()
    document.body.style.overflow = 'hidden'
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.open = false
    document.body.style.overflow = 'initial'
  }

  private _handleCloseModal() {
    document.body.style.overflow = 'initial'
    this.remove()
  }

  private _handleBackdrop(e: Event) {
    if (e.target === this.dialog) this._handleCloseModal()
  }

  render() {
    return html`
      <dialog
        class="ns_login_dialog"
        aria-modal="true"
        aria-labelledby="ns-login-modal-title"
        id="ns-welcome-dialog"
        @close=${this._handleCloseModal}
        @click=${this._handleBackdrop}
      >
        <div class="ns_login_dialog_content">
          <div class="flex flex-col gap-[12px]">
            <h2 class="ns_login_dialog_title" id="ns-login-modal-title">Welcome!</h2>
            <div class="w-full flex flex-col items-center justify-center gap-[8px]">
              <div class="w-[64px] h-[64px]">${Icons.PartyPopper}</div>
              <p class="text-[18px] font-medium text-center">Thank you for completing the signup!</p>
            </div>
            <button 
              class="ns_email_submit"
              style="color: ${this.textColor}; background-color: ${this.accentColor}"
              type"button"
              @click=${this._handleCloseModal}
              >
              Continue
            </button>
          </div>
        </div>
      </dialog>
    `
  }
}
