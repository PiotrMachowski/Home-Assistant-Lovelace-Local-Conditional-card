/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { fireEvent, HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import { HuiCardElementEditor, LocalConditionalCardConfig, TranslatableString } from "./types";
import { customElement, property, state, query } from "lit/decorators";
import { CARD_VERSION, DEFAULT_ID, HIDE, SHOW } from "./const";
import { localizeWithHass } from "./localize/localize";

@customElement("local-conditional-card-editor")
export class LocalConditionalCardEditor extends LitElement implements LovelaceCardEditor {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @property() lovelace;

    @state() private _config?: LocalConditionalCardConfig;

    @state() private _helpers?: any;

    @state() private _cardTab = false;

    @state() private _GUImode = true;

    @state() private _guiModeAvailable? = true;

    @query("hui-card-element-editor")
    private _cardEditorEl?: HuiCardElementEditor;

    private _initialized = false;

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

    get _persist_state(): boolean {
        return this._config?.persist_state ?? false;
    }

    get _hide_in_preview(): boolean {
        return this._config?.hide_in_preview ?? false;
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
                <div class="toolbar">
                    <ha-tab-group @wa-tab-show=${this._selectTab}>
                        <ha-tab-group-tab slot="nav" panel="conditions" .active=${!this._cardTab}>
                            ${this.hass?.localize("ui.panel.lovelace.editor.card.conditional.conditions")}
                        </ha-tab-group-tab>
                        <ha-tab-group-tab slot="nav" panel="card" .active=${this._cardTab}>
                            ${this.hass?.localize("ui.panel.lovelace.editor.card.conditional.card")}
                        </ha-tab-group-tab>
                    </ha-tab-group>
                </div>
                <div id="editor">${this._cardTab ? this._renderCardChooser() : this._renderCardConfig()}</div>
            </div>
        `;
    }

    private _renderCardConfig(): TemplateResult {
        return html`
            <div class="card-config">
                <div class="values">${this.localize("editor.labels.description")}</div>
                <div class="values">
                    <ha-textfield
                        label=${this.localize("editor.labels.id")}
                        .value=${this._id}
                        .configValue=${"id"}
                        @input=${this._valueChanged}></ha-textfield>
                </div>
                <div class="values">
                    <ha-formfield
                        class="switch-wrapper"
                        .label=${`${this.localize("editor.labels.default_state.prefix")}${this.localize(
                            "editor.labels.default_state.value." + (this._default === SHOW ? "shown" : "hidden"),
                        )}${this.localize("editor.labels.default_state.suffix")}`}>
                        <ha-switch
                            .checked=${this._default === SHOW}
                            .configValue=${"default"}
                            @change=${this._valueChanged}></ha-switch>
                    </ha-formfield>
                </div>
                <div class="values">
                    <ha-formfield class="switch-wrapper" .label=${this.localize("editor.labels.persist_state")}>
                        <ha-switch
                            .checked=${this._persist_state}
                            .configValue=${"persist_state"}
                            @change=${this._valueChanged}></ha-switch>
                    </ha-formfield>
                </div>
                <div class="values">
                    <ha-formfield class="switch-wrapper" .label=${this.localize("editor.labels.hide_in_preview")}>
                        <ha-switch
                            .checked=${this._hide_in_preview}
                            .configValue=${"hide_in_preview"}
                            @change=${this._valueChanged}></ha-switch>
                    </ha-formfield>
                </div>
                <div class="version">${this.localize("editor.labels.version")} ${CARD_VERSION}</div>
            </div>
        `;
    }

    private _renderCardChooser(): TemplateResult {
        return html` <div class="card">
            ${this._config?.card?.type !== undefined
                ? html`
                      <div class="card-options">
                          <mwc-button
                              @click=${this._toggleMode}
                              .disabled=${!this._guiModeAvailable}
                              class="gui-mode-button">
                              ${this.hass?.localize(
                                  !this._cardEditorEl || this._GUImode
                                      ? "ui.panel.lovelace.editor.edit_card.show_code_editor"
                                      : "ui.panel.lovelace.editor.edit_card.show_visual_editor",
                              )}
                          </mwc-button>
                          <mwc-button @click=${this._handleReplaceCard}
                              >${this.hass?.localize("ui.panel.lovelace.editor.card.conditional.change_type")}
                          </mwc-button>
                      </div>
                      <hui-card-element-editor
                          .hass=${this.hass}
                          .value=${this._config.card}
                          .lovelace=${this.lovelace}
                          @config-changed=${this._handleCardChanged}
                          @GUImode-changed=${this._handleGUIModeChanged}></hui-card-element-editor>
                  `
                : html`
                      <hui-card-picker
                          .hass=${this.hass}
                          .lovelace=${this.lovelace}
                          @config-changed=${this._addCard}></hui-card-picker>
                  `}
        </div>`;
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
        let newValue;
        switch (target.configValue) {
            case "default":
                newValue = target.checked ? SHOW : HIDE;
                break;
            case "persist_state":
                newValue = target.checked;
                break;
            case "hide_in_preview":
                newValue = target.checked ? true : "";
                break;
            default:
                newValue = target.value;
        }
        if (this[`_${target.configValue}`] === newValue) {
            return;
        }
        if (target.configValue) {
            if (newValue === "") {
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
        fireEvent(this, "config-changed", { config: this._config });
    }

    private _selectTab(ev): void {
        this._cardTab = ev.detail.name === "card";
    }

    private _toggleMode(): void {
        this._cardEditorEl?.toggleMode();
    }

    private _handleReplaceCard(): void {
        if (!this._config) {
            return;
        }
        this._config = { ...this._config, card: undefined };
        fireEvent(this, "config-changed", { config: this._config });
    }

    private _handleCardChanged(ev: any): void {
        ev.stopPropagation();
        if (!this._config) {
            return;
        }
        this._config = {
            ...this._config,
            card: ev.detail.config as LocalConditionalCardConfig,
        };
        this._guiModeAvailable = ev.detail.guiModeAvailable;
        fireEvent(this, "config-changed", { config: this._config });
    }

    private _handleGUIModeChanged(ev: any): void {
        ev.stopPropagation();
        this._GUImode = ev.detail.guiMode;
        this._guiModeAvailable = ev.detail.guiModeAvailable;
    }

    private _addCard(ev: CustomEvent) {
        ev.stopPropagation();
        if (this._config) {
            this._config.card = ev.detail.config;
        }
        fireEvent(this, "config-changed", { config: this._config });
    }

    static styles: CSSResultGroup = css`
        ha-tab {
            flex: 1;
        }

        ha-tab::part(base) {
            width: 100%;
            justify-content: center;
        }

        .card-config {
            position: relative;
            padding-bottom: 1em;
        }

        .values {
            padding-left: 16px;
            margin: 8px;
            display: grid;
        }

        .switch-wrapper {
            padding: 8px;
        }

        .card {
            margin-top: 8px;
            border: 1px solid var(--divider-color);
            padding: 12px;
        }

        @media (max-width: 450px) {
            .card,
            .condition {
                margin: 8px -12px 0;
            }
        }

        .card .card-options {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }

        .gui-mode-button {
            margin-right: auto;
        }

        .version {
            position: absolute;
            bottom: 0;
            right: 0;
            opacity: 30%;
        }
    `;
}
