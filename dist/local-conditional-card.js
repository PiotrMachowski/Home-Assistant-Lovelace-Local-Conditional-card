const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;

class LocalConditionalCard extends LitElement {

    static get properties() {
        return {
            _config: {},
            _hass: {},
        };
    }

    getCardSize() {
        return this._show ? ('getCardSize' in this._card ? this._card.getCardSize() : 1) : 0;
    }

    set hass(hass) {
        const thisDomain = "local_conditional_card";
        if (!this._config || !hass) return;
        this._hass = hass;
        if (this.hassPatched) return;
        const callService = hass.callService;
        hass.callService = (domain, service, serviceData) => {
            const methods = ["toggle", "show", "hide"];
            if (domain === thisDomain && serviceData && serviceData.id === this._config.id && methods.includes(service)) {
                if (service === "toggle")
                    this._show = !this._show;
                if (service === "show")
                    this._show = true;
                if (service === "hide")
                    this._show = false;
                this.requestUpdate();
                return Promise.resolve();
            }
            return callService(domain, service, serviceData);
        };

        this.hassPatched = true;
        document.querySelector("home-assistant").hassChanged(hass, hass);
        this._card.hass = hass;
    }

    shouldUpdate(changedProps) {
        return !this._card || this._card.shouldUpdate(changedProps);
    }

    setConfig(config) {
        if (!config.id) {
            throw new Error("You need to define 'id' in your configuration.");
        }
        if (!config.card) {
            throw new Error("You need to define 'card' in your configuration.");
        }
        this._config = config;
        this._card = this.createCard(config.card);
        this._show = config.default === "show";
    }

    createCard(config) {
        let tag = config.type;
        if (tag.startsWith("custom:"))
            tag = tag.substr("custom:".length);
        else
            tag = `hui-${tag}-card`;
        let element = document.createElement(tag);
        try {
            element.setConfig(config);
        } catch (err) {
            console.error(tag, err);
            return this.createCard({type: "error", error: err.message, origConfig: this._config});
        }
        return element;
    }

    render() {
        if (this._show === true || this._card.localName === "hui-error-card")
            return html`${this._card}`;
        return html``;
    }
}

customElements.define('local-conditional-card', LocalConditionalCard);