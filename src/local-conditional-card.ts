/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import { HomeAssistant, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from "custom-card-helpers";
import type { LocalConditionalCardConfig, LovelaceCardFixed, LovelaceDomEvent } from "./types";
import { CARD_VERSION, SHOW, EVENT_LOVELACE_DOM, EVENT_LOVELACE_DOM_DETAIL, HIDE, DEFAULT_ID, TOGGLE } from "./const";

/* eslint no-console: 0 */
const line1 = "   LOCAL-CONDITIONAL-CARD";
const line2 = `   version: ${CARD_VERSION}`;
const length = Math.max(line1.length, line2.length) + 3;
const pad = (text: string, length: number) => text + " ".repeat(length - text.length);
/* eslint no-console: 0 */
console.info(
    `%c${pad(line1, length)}\n%c${pad(line2, length)}`,
    "color: orange; font-weight: bold; background: black",
    "color: white; font-weight: bold; background: dimgray",
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "local-conditional-card",
    name: "Local Conditional Card",
    description: "A conditional card that works only for current view",
});
const cardHelpers = await (window as any).loadCardHelpers();

@customElement("local-conditional-card")
export class LocalConditionalCard extends LitElement {
    public static async getConfigElement(): Promise<LovelaceCardEditor> {
        await import("./editor");
        return document.createElement("local-conditional-card-editor");
    }

    public static getStubConfig(): Record<string, unknown> {
        return {
            id: DEFAULT_ID,
            default: SHOW,
            card: {},
        };
    }

    @property({ attribute: false }) public _hass!: HomeAssistant;

    @property({ type: Boolean }) public preview = false;

    @state() private config!: LocalConditionalCardConfig;
    @state() private show!: boolean;
    private card!: LovelaceCardFixed;
    public connectedWhileHidden = true;

    public async setConfig(config: LocalConditionalCardConfig): Promise<void> {
        if (!config) {
            throw new Error("Missing configuration");
        }
        this.config = config;
        this.show = config.default === "show";
        if (config.persist_state) {
            const lastSaved = localStorage.getItem(this._getStorageKey(config));
            if (lastSaved) {
                this.show = lastSaved === "true";
            }
        }
        if (!config.card) {
            throw new Error("No card configured");
        }
        if (config.card) await this.createCard(config.card);
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

    public get hidden(): boolean {
        return !this.isVisible();
    }

    constructor() {
        super();
        this._handleLovelaceDomEvent = this._handleLovelaceDomEvent.bind(this);
    }

    protected render(): TemplateResult | void {
        const visible = this.isVisible();
        this.style.setProperty("display", visible ? "" : "none");
        if (visible) {
            return html`${this.card}`;
        }
        return;
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
            "ids" in lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL] &&
            "action" in lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL] &&
            Array.isArray(lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]["ids"])
        ) {
            const ids = lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]["ids"] as Array<string | never>;
            let action = lovelaceEvent.detail[EVENT_LOVELACE_DOM_DETAIL]["action"] as string;
            if (action === "set") {
                const found = ids.find(id => typeof id === "object" && this.config.id in id);
                if (found && typeof found === "object") {
                    action = found[this.config.id];
                }
            } else {
                action = ids.includes(this.config.id) ? action : "none";
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
            if (this.config.persist_state) {
                localStorage.setItem(this._getStorageKey(), `${this.show}`);
            }
            this.dispatchEvent(
                new Event("card-visibility-changed", { bubbles: true, cancelable: true })
            );
        }
    }

    private _getStorageKey(config?: LocalConditionalCardConfig): string {
        return `local_conditional_card_state_${(config ?? this.config).id}`;
    }

    private isVisible(): boolean {
        return this.preview || this.show || (this.card && this.card.localName === "hui-error-card");
    }

    public async getCardSize(): Promise<number> {
        return this.isVisible() ? ("getCardSize" in this.card ? await this.card.getCardSize() : 1) : 0;
    }

    private async createCard(config: LovelaceCardConfig): Promise<void> {
        this.card = await this._createCard(config);
    }

    private async _createCard(cardConfig: LovelaceCardConfig): Promise<LovelaceCard> {
        const el = cardHelpers.createCardElement(cardConfig);
        el.addEventListener("ll-rebuild", (ev: Event) => {
            ev.stopPropagation();
            this._rebuildCard(el, cardConfig);
        });
        el.hass = this.hass;
        return el;
    }

    private async _rebuildCard(el: LovelaceCard, cardConfig: LovelaceCardConfig): Promise<void> {
        const newEl = await this._createCard(cardConfig);
        if (el.parentElement) {
            el.parentElement.replaceChild(newEl, el);
        }
        this.card = newEl;
    }
}
