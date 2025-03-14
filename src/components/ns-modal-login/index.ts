import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { TWStyles } from '../../modules/tw/twlit'
import { Icons } from '../../assets/icons'

const NSEC_APP_URL = 'http://dev.nsec.app'

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
  @state() isError = false
  @state() popupWatcher = null

  show(): void {
    this.open = true
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('nlAuth', () => {
      if (this.popupWatcher) clearInterval(this.popupWatcher)
      this.popupWatcher = null
      this.remove()
    })
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
    this.isError = false
    document.body.style.overflow = 'initial'
  }

  private _handleCloseModal() {
    if (this.isPending) return
    document.body.style.overflow = 'initial'
    this.remove()

    // stop the nostr-connect listener
    document.dispatchEvent(new CustomEvent('nlNeedAuthCancel'))
  }

  private _handleBackdrop(e: Event) {
    if (e.target === this.dialog) this._handleCloseModal()
  }

  private _handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const enteredEmail = this.emailField.value.trim()
    if (!enteredEmail) return
    const link = `${NSEC_APP_URL}/${this.nostrconnect}#email=${enteredEmail}`
    const popup = window.open(link, '_blank', 'width=400,height=700')
    if (!popup) console.error('Popup blocked!')
    // watch if popup closes before we're authed
    this.popupWatcher = setInterval(() => {
      if (popup.closed) {
        this.isPending = false
        this.isError = true
        console.log('popup closed error')
        clearInterval(this.popupWatcher)
        this.popupWatcher = null
      }
    }, 100)

    this.isPending = true
  }

  private _handleAdvancedSignIn(e: MouseEvent) {
    e.preventDefault()
    document.dispatchEvent(new CustomEvent('nlLaunch', { detail: "default" }))
    this.remove()
  }

  private renderForm() {
    return html` <form class="ns_email_form" @submit=${this._handleSubmit}>
      <div class="ns_email_field_container">
        <!--label class="ns_email_label" for="ns-email-field">E-mail address</label-->
        <input class="ns_email_input" type="email" id="ns-email-field" placeholder="E-mail or Nostr address" />
      </div>
      <button class="ns_email_submit" type"submit">Sign in</button>
      <a href="/" @click=${this._handleAdvancedSignIn} class="ns_advanced_sign_in">Advanced</a>
    </form>`
  }

  private renderLoading() {
    return html`<div class="ns_login_loading_container">
      <div class="py-[12px]">${Icons.LoadingSpinner}</div>
      <span class="text-[18px]">Signing in...</span>
    </div>`
  }

  private renderError() {
    return html`<div class="ns_login_loading_container">
      <span class="text-[18px] py-[12px]">Error: failed to complete sign-in</span>
      <button class="ns_login_close_btn" type"button" @click=${this._handleCloseModal}>Close</button>
    </div>`
  }

  private renderContent() {
    if (this.isError) return this.renderError()
    if (this.isPending) return this.renderLoading()
    return this.renderForm()
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
          ${this.renderContent()}
        </div>
      </dialog>
    `
  }
}
