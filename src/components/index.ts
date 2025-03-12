import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { TWStyles } from '../modules/tw/twlit'
import { Icons } from '../assets/icons'

const NSEC_APP_URL = 'https://dev.nsec.app'

@customElement('ns-modal-login')
export class ModalLogin extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
    TWStyles,
  ]

  @property({ type: String }) nostrconnect = ''
  @query('#ns-login-dialog') dialog: HTMLDialogElement | undefined
  @query('#ns-email-field') emailField: HTMLInputElement | undefined
  @state() open = false
  @state() isPending = false

  show(): void {
    this.open = true
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('nlAuth', () => this.remove())
  }

  updated() {
    if (!this.open) return
    this.dialog.showModal()
    document.body.style.overflow = 'hidden'
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.open = false
    this.isPending = false
    document.body.style.overflow = 'initial'
  }

  private _handleCloseModal() {
    if (this.isPending) return
    document.body.style.overflow = 'initial'
    this.remove()
  }
  private _handleBackdrop(e: Event) {
    if (e.target === this.dialog) this._handleCloseModal()
  }

  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const enteredEmail = this.emailField.value.trim()
    if (!enteredEmail) return
    const link = `${NSEC_APP_URL}/${this.nostrconnect}#email=${enteredEmail}`
    window.open(link, '#blank')
    this.isPending = true
  }

  private renderForm() {
    return html` <form class="ns_email_form" @submit=${this.handleSubmit}>
      <div class="ns_email_field_container">
        <label class="ns_email_label" for="ns-email-field">E-mail address</label>
        <input class="ns_email_input" type="email" id="ns-email-field" placeholder="Enter your e-mail address" />
      </div>
      <button class="ns_email_submit" type"submit">Login</button>
    </form>`
  }

  private renderLoading() {
    return html`<div class="ns_login_loading_container">
      <div class="py-[12px]">${Icons.LoadingSpinner}</div>
      <span class="text-[18px]">Signing in...</span>
    </div>`
  }

  render() {
    return html`
      <dialog
        class="ns_login_dialog"
        aria-modal="true"
        aria-labelledby="ns-login-modal-title"
        id="ns-login-dialog"
        @close=${this._handleCloseModal}
        @click=${this._handleBackdrop}
      >
        <div class="ns_login_dialog_content">
          <h2 class="ns_login_dialog_title" id="ns-login-modal-title">Sign in to proceed</h2>
          ${this.isPending ? this.renderLoading() : this.renderForm()}
        </div>
      </dialog>
    `
  }
}
