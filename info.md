This card can show and hide a specific card on current device while not affecting other windows. It does not require any integration to run.

## Configuration options

| Key | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `true` | - | Identifier of a card, used in service calls. **Must be unique!** |
| `card` | `card` | `true` | - | Configuration of a nested card |
| `default` | `string` | `false` | `hide` | Default card behaviour. Possible values: [`show`, `hide`]. |

## Services

This card adds 3 new services that can be used **ONLY** from UI:
 - `local_conditional_card.show` - shows specified card
 - `local_conditional_card.hide` - hides specified card
 - `local_conditional_card.toggle` - shows or hides specified card
 
Each of these services requires a parameter `id` that have to correspond to a existing card.

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
        icon: 'mdi:power'
        name: Sun1
        service: local_conditional_card.toggle
        service_data:
          id: sun1
        type: call-service
      - action_name: Show
        icon: 'mdi:power'
        name: Sun1
        service: local_conditional_card.show
        service_data:
          id: sun1
        type: call-service
      - action_name: Hide
        icon: 'mdi:power'
        name: Sun1
        service: local_conditional_card.hide
        service_data:
          id: sun1
        type: call-service
      - action_name: Toggle
        icon: 'mdi:power'
        name: Sun2
        service: local_conditional_card.toggle
        service_data:
          id: sun2
        type: call-service
      - action_name: Show
        icon: 'mdi:power'
        name: Sun2
        service: local_conditional_card.show
        service_data:
          id: sun2
        type: call-service
      - action_name: Hide
        icon: 'mdi:power'
        name: Sun2
        service: local_conditional_card.hide
        service_data:
          id: sun2
        type: call-service
```
