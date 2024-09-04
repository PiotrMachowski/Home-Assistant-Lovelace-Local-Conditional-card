import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from "custom-card-helpers";
import { PropertyValues } from "lit";

declare global {
    interface HTMLElementTagNameMap {
        "local-conditional-card-editor": LovelaceCardEditor;
        "hui-error-card": LovelaceCard;
    }
}

export interface LocalConditionalCardConfig extends LovelaceCardConfig {
    type: string;
    id: string;
    default: string;
    persist_state?: boolean;
    card?: LovelaceCardConfig;
}

export interface HuiCardElementEditor {
    toggleMode: () => void;
}

export interface LovelaceCardFixed extends LovelaceCard {
    shouldUpdate?: (changedProps: PropertyValues) => boolean;
}

export type LovelaceDomEvent = CustomEvent<Record<string, never>>;
export type TranslatableString = string | [string, string, string];
export type Language = string | undefined;
