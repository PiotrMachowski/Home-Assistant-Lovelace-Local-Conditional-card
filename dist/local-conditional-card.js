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
        if (this._card) {
            this._card.hass = hass;
        }
        if (this.hassPatched) return;
        const callService = hass.callService;
        hass.callService = (domain, service, serviceData) => {
            const methods = ["toggle", "show", "hide", "set"];
            const getId = a => {
                if (typeof a === "object")
                    return Object.keys(a);
                return [a];
            };
            if (domain === thisDomain && methods.includes(service) && serviceData && serviceData.ids
                && serviceData.ids.flatMap(getId).includes(this._config.id)) {
                const ids = serviceData.ids.flatMap(getId);
                if (service === "toggle")
                    this._show = !this._show;
                if (service === "show")
                    this._show = true;
                if (service === "hide")
                    this._show = false;
                if (service === "set") {
                    this._show = serviceData.ids[ids.indexOf(this._config.id)][this._config.id];
                }
                this.requestUpdate();
                let new_ids = serviceData.ids.filter(ido => getId(ido)[0] !== this._config.id);
                if (new_ids.length === 0)
                    return Promise.resolve();
                serviceData.ids = new_ids;
                return callService(domain, service, serviceData);
            }
            return callService(domain, service, serviceData);
        };

        this.hassPatched = true;
        document.querySelector("home-assistant").hassChanged(hass, hass);
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
        this.createCard(config.card);
        this._show = config.default === "show";
    }

    createCard(config) {
        let tag = config.type;
        if (tag.startsWith("custom:"))
            tag = tag.substr("custom:".length);
        else
            tag = `hui-${tag}-card`;

        try {
            if (!customElements.get(tag)) {
                customElements.whenDefined(tag).then(() => {
                    let element = document.createElement(tag);
                    element.setConfig(config);
                    element.hass = this._hass;
                    this._card = element;
                });
            } else {
                let element = document.createElement(tag);
                element.setConfig(config);
                element.hass = this._hass;
                this._card = element;
            }
        } catch (err) {
            console.error(tag, err);
            this._card = this.createCard({type: "error", error: err.message, origConfig: this._config});
        }
    }

    render() {
        const visible = this._show || this._card && this._card.localName === "hui-error-card";
        this.style.setProperty("display", visible ? "" : "none");
        this.style.setProperty("margin", "0");
        if (visible) {
            return html`${this._card}`;
        }
        return html``;
    }
}

customElements.define('local-conditional-card', LocalConditionalCard);
