[![HACS Default][hacs_shield]][hacs]
[![GitHub Latest Release][releases_shield]][latest_release]
[![GitHub All Releases][downloads_total_shield]][releases]
[![Community Forum][community_forum_shield]][community_forum]
[![Ko-Fi][ko_fi_shield]][ko_fi]
[![buycoffee.to][buycoffee_to_shield]][buycoffee_to]
[![PayPal.Me][paypal_me_shield]][paypal_me]


[hacs_shield]: https://img.shields.io/static/v1.svg?label=HACS&message=Default&style=popout&color=green&labelColor=41bdf5&logo=HomeAssistantCommunityStore&logoColor=white
[hacs]: https://hacs.xyz/docs/default_repositories

[latest_release]: https://github.com/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card/releases/latest
[releases_shield]: https://img.shields.io/github/release/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card.svg?style=popout

[releases]: https://github.com/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card/releases
[downloads_total_shield]: https://img.shields.io/github/downloads/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card/total

[community_forum_shield]: https://img.shields.io/static/v1.svg?label=%20&message=Forum&style=popout&color=41bdf5&logo=HomeAssistant&logoColor=white
[community_forum]: https://community.home-assistant.io/t/lovelace-local-conditional-card/145145

[ko_fi_shield]: https://img.shields.io/static/v1.svg?label=%20&message=Ko-Fi&color=F16061&logo=ko-fi&logoColor=white
[ko_fi]: https://ko-fi.com/piotrmachowski

[buycoffee_to_shield]: https://shields.io/badge/buycoffee.to-white?style=flat&labelColor=white&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpaIVh1YQcchQnayIijhKFYtgobQVWnUweemP0KQhSXFxFFwLDv4sVh1cnHV1cBUEwR8QVxcnRRcp8b6k0CLGC4/3cd49h/fuA4R6malmxzigapaRisfEbG5FDLzChxB6MIZ+iZl6Ir2QgWd93VM31V2UZ3n3/Vm9St5kgE8knmW6YRGvE09vWjrnfeIwK0kK8TnxqEEXJH7kuuzyG+eiwwLPDBuZ1BxxmFgstrHcxqxkqMRTxBFF1ShfyLqscN7irJarrHlP/sJgXltOc53WEOJYRAJJiJBRxQbKsBClXSPFRIrOYx7+QcefJJdMrg0wcsyjAhWS4wf/g9+zNQuTE25SMAZ0vtj2xzAQ2AUaNdv+PrbtxgngfwautJa/UgdmPkmvtbTIEdC3DVxctzR5D7jcAQaedMmQHMlPSygUgPcz+qYcELoFulfduTXPcfoAZGhWSzfAwSEwUqTsNY93d7XP7d+e5vx+AIahcq//o+yoAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wETCy4vFNqLzwAAAVpJREFUOMvd0rFLVXEYxvHPOedKJnKJhrDLuUFREULE7YDCMYj+AydpsCWiaKu29hZxiP4Al4aWwC1EdFI4Q3hqEmkIBI8ZChWXKNLLvS0/Qcza84V3enm/7/s878t/HxGkeTaIGziP+EB918nawu7Dq1d0e1+2J2bepnk2jFEUVVF+qKV51o9neBCaugfge70keoxxUbSWjrQ+4SUyzKZ5NlnDZdzGG7w4DIh+dtZEFntDA98l8S0MYwctNGrYz9WqKJePFLq80g5Sr+EHlnATp+NA+4qLaZ7FfzMrzbMBjGEdq8GrJMZnvAvFC/8wfAwjWMQ8XmMzaW9sdevNRgd3MFhvNpbaG1u/Dk2/hOc4gadVUa7Um425qii/7Z+xH9O4jwW8Cqv24Tru4hyeVEU588cfBMgpPMI9nMFe0BkFzVOYrYqycyQgQJLwTC2cDZCPeF8V5Y7jGb8BUpRicy7OU5MAAAAASUVORK5CYII=
[buycoffee_to]: https://buycoffee.to/piotrmachowski

[buy_me_a_coffee_shield]: https://img.shields.io/static/v1.svg?label=%20&message=Buy%20me%20a%20coffee&color=6f4e37&logo=buy%20me%20a%20coffee&logoColor=white
[buy_me_a_coffee]: https://www.buymeacoffee.com/PiotrMachowski

[paypal_me_shield]: https://img.shields.io/static/v1.svg?label=%20&message=PayPal.Me&logo=paypal
[paypal_me]: https://paypal.me/PiMachowski

# Lovelace Local Conditional card

This card can show and hide a specific card on current device while not affecting other windows. It does not require any integration to run.

## Installation

### HACS (recommended)

- Open HACS
- Go to "Frontend" section
- Click button with "+" icon
- Search for "Local conditional card"
- Install repository in HACS
- Make sure you have added this card to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/)
  ```yaml
  url: /hacsfiles/local-conditional-card/local-conditional-card.js
  type: module
  ```
- Refresh your browser

### Manual

- Download `local-conditional-card.js` file from the [latest release](https://github.com/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card/releases/latest)
- Save downloaded file somewhere in `<ha config>/www/` directory, e.g. `/config/www/custom_lovelace/local-conditional-card.js`
- Add saved file to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/)
  ```yaml
  url: /local/custom_lovelace/local-conditional-card.js
  type: module
  ```
- Restart HA if you had to create `www` directory
- Refresh your browser

## Configuration options

| Key             | Type      | Required | Default | Description                                                                     |
|-----------------|-----------|----------|---------|---------------------------------------------------------------------------------|
| `id`            | `string`  | `true`   | -       | Identifier of a card, used in service calls. **Must be unique!**                |
| `card`          | `card`    | `true`   | -       | Configuration of a nested card                                                  |
| `default`       | `string`  | `false`  | `hide`  | Default card behaviour. Possible values: [`show`, `hide`].                      |
| `persist_state` | `boolean` | `false`  | `false` | Enables storing card's state in local storage to restore it after page refresh. |

## Usage

This card utilises `fire-dom-event` actions to change its state:

```yaml
tap_action:
  action: fire-dom-event
  local_conditional_card:
    action: show
    ids:
      - id_1
```

There are 4 available actions
 - `show` - shows specified cards
 - `hide` - hides specified cards
 - `toggle` - changes visibility of specified cards
 - `set` - sets visibility of specified cards
 
Each of these services requires a parameter `ids` that should contain a list:
```yaml
tap_action:
  action: fire-dom-event
  local_conditional_card:
    action: show
    ids:
      - id_1
      - id_2
```
```yaml
tap_action:
  action: fire-dom-event
  local_conditional_card:
    action: hide
    ids:
      - id_1
      - id_2
```
```yaml
tap_action:
  action: fire-dom-event
  local_conditional_card:
    action: toggle
    ids:
      - id_1
      - id_2
```
```yaml
tap_action:
  action: fire-dom-event
  local_conditional_card:
    action: set
    ids:
      - id_1: show
      - id_2: hide
      - id_3: toggle
```

## Example configuration

![Example](https://github.com/PiotrMachowski/Home-Assistant-Lovelace-Local-Conditional-card/raw/master/s1.gif)

```yaml
views:
- name: Example
  cards:
  - type: 'custom:local-conditional-card'
    default: show
    id: sun1
    card:
      entities:
        - sun.sun
      title: Sun 1
      type: entities
  - type: 'custom:local-conditional-card'
    id: sun2
    card:
      entities:
        - sun.sun
      title: Sun 2
      type: entities
  - title: Click test
    type: entities
    entities:
      - action_name: Toggle
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: toggle
            ids:
              - sun1
        type: button
      - action_name: Show
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: show
            ids:
              - sun1
        type: button
      - action_name: Hide
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: hide
            ids:
              - sun1
        type: button
      - action_name: Hide All
        icon: mdi:power
        name: Suns
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: hide
            ids:
              - sun1
              - sun2
        type: button
      - action_name: Toggle
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: toggle
            ids:
              - sun2
        type: button
      - action_name: Show
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: show
            ids:
              - sun2
        type: button
      - action_name: Hide
        icon: mdi:power
        name: Sun1
        tap_action:
          action: fire-dom-event
          local_conditional_card:
            action: hide
            ids:
              - sun2
        type: button
```

<a href='https://ko-fi.com/piotrmachowski' target='_blank'><img height='35px' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />
<a href="https://buycoffee.to/piotrmachowski" target="_blank"><img src="https://buycoffee.to/btn/buycoffeeto-btn-primary.svg" height="35px" alt="Postaw mi kawę na buycoffee.to"></a>
<a href="https://paypal.me/PiMachowski" target="_blank"><img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" border="0" alt="PayPal Logo" height="35px" style="height: auto !important;width: auto !important;"></a>
