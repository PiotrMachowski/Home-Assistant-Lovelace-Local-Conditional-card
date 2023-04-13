/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';
import type { LocalConditionalCardConfig, LovelaceCardFixed, LovelaceDomEvent } from './types';
import { CARD_VERSION, SHOW, EVENT_LOVELACE_DOM, EVENT_LOVELACE_DOM_DETAIL, HIDE, DEFAULT_ID, TOGGLE } from './const';

/* eslint no-console: 0 */
const line1 = '   LOCAL-CONDITIONAL-CARD';
const line2 = `   version: ${CARD_VERSION}`;
const length = Math.max(line1.length, line2.length) + 3;
const pad = (text: string, length: number) => text + ' '.repeat(length - text.length);
/* eslint no-console: 0 */
console.info(
  `%c${pad(line1, length)}\n%c${pad(line2, length)}`,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'local-conditional-card',
  name: 'Local Conditional Card',
  description: 'A conditional card that works only for current view',
});

@customElement('local-conditional-card')
export class LocalConditionalCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('local-conditional-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      id: DEFAULT_ID,
      default: SHOW,
      card: {},
    };
  }

  @property({ attribute: false }) public _hass!: HomeAssistant;

  @state() private config!: LocalConditionalCardConfig;
  @state() private show!: boolean;
  private card!: LovelaceCardFixed;

  public async setConfig(config: LocalConditionalCardConfig): Promise<void> {
    if (!config) {
      throw new Error('Missing configuration');
    }
    this.config = config;
    this.show = config.default === 'show';
    if (!config.card) {
      throw new Error("No card configured");
    }
    if(config.card)
      await this.createCard(config.card).then(() => this.requestUpdate());
  }

  public get hass(): HomeAssistant {
    return this._hass;
  }

  public set hass(hass: HomeAssistant) {
    if (!this.config || !hass) return;
    this._hass = hass;
    if (this.card) {
      this.card.hass = hass;
    }
  }

  constructor() {
    super();
    this._handleLovelaceDomEvent = this._handleLovelaceDomEvent.bind(this);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }
    return !this.card || (this.card.shouldUpdate?.(changedProps) ?? true);
  }

  protected render(): TemplateResult | void {
    const visible = this.isVisible();
    this.style.setProperty('display', visible ? '' : 'none');
    if (visible) {
      return html`${this.card}`;
    }
    return html``;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener(EVENT_LOVELACE_DOM, this._handleLovelaceDomEvent);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(EVENT_LOVELACE_DOM, this._handleLovelaceDomEvent);
  }

  private _handleLovelaceDomEvent(e: Event): void {
    const lovelaceEvent = e as LovelaceDomEvent;
    if (
      EVENT_LOVELACE_DOM_DETAIL in lovelaceEvent.detail &&
      'ids' in lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL] &&
      'action' in lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL] &&
      Array.isArray(lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]['ids'])
    ) {
      const ids = lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]['ids'] as Array<string | never>;
      let action = lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]['action'] as string;
      if (action === 'set') {
        const found = ids.find((id) => typeof id === 'object' && this.config.id in id);
        if (found && typeof found === 'object') {
          action = found[this.config.id];
        }
      } else {
        action = ids.includes(this.config.id) ? action : 'none';
      }
      switch (action) {
        case SHOW:
          this.show = true;
          break;
        case HIDE:
          this.show = false;
          break;
        case TOGGLE:
          this.show = !this.show;
          break;
      }
    }
  }

  private isVisible(): boolean {
    return this.show || (this.card && this.card.localName === 'hui-error-card');
  }

  public async getCardSize(): Promise<number> {
    return this.isVisible() ? ('getCardSize' in this.card ? await this.card.getCardSize() : 1) : 0;
  }

  private async createCard(config: LovelaceCardConfig): Promise<void> {
    let tag = config?.type;
    if (tag) {
      tag = tag.startsWith('custom:') ? tag.substring(7) : `hui-${tag}-card`;
      const cardCreator = (cardTag: string, cardConfig: LovelaceCardConfig): LovelaceCard => {
        const element = document.createElement(cardTag) as LovelaceCard;
        element.setConfig(cardConfig);
        element.hass = this.hass;
        return element;
      };
      try {
        this.card = customElements.get(tag)
          ? cardCreator(tag, config)
          : await customElements.whenDefined(tag).then(() => cardCreator(tag, config));
      } catch (err) {
        console.error(tag, err);
        await this.createCard({ type: 'error', error: (err as Error).message, origConfig: this.config });
      }
    } else {
      await this.createCard({
        type: 'error',
        error: 'Unable to create child card',
        origConfig: this.config.card,
      });
    }
  }
}
