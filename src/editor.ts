/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { LocalConditionalCardConfig, TranslatableString } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';
import { DEFAULT_ID, HIDE, SHOW } from './const';
import { localizeWithHass } from './localize/localize';

@customElement('local-conditional-card-editor')
export class LocalConditionalCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: LocalConditionalCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: LocalConditionalCardConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _id(): string {
    return this._config?.id ?? DEFAULT_ID;
  }

  get _default(): string {
    return this._config?.default ?? SHOW;
  }

  private localize(ts: TranslatableString): string {
    return localizeWithHass(ts, this.hass);
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="values">
          <mwc-textfield
            label=${this.localize('editor.labels.id')}
            .value=${this._id}
            .configValue=${'id'}
            @input=${this._valueChanged}
          ></mwc-textfield>
        </div>

        <div class="values">
          <mwc-formfield
            class="switch-wrapper"
            .label=${`${this.localize('editor.labels.default_state.prefix')}${this.localize(
              'editor.labels.default_state.value.' + (this._default === SHOW ? 'shown' : 'hidden'),
            )}${this.localize('editor.labels.default_state.suffix')}`}
          >
            <mwc-switch
              .checked=${this._default === SHOW}
              .configValue=${'default'}
              @change=${this._valueChanged}
            ></mwc-switch>
          </mwc-formfield>
        </div>
        <div class="values">${this.localize('editor.labels.card')}</div>
      </div>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    const newValue = target.configValue === 'default' ? (target.checked ? SHOW : HIDE) : target.value;
    if (this[`_${target.configValue}`] === newValue) {
      return;
    }
    if (target.configValue) {
      if (newValue === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: newValue,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles: CSSResultGroup = css`
    .card-config {
      position: relative;
    }

    .values {
      padding-left: 16px;
      margin: 8px;
      display: grid;
    }

    .switch-wrapper {
      padding: 8px;
    }

    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
  `;
}
