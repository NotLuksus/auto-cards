import { ItemDefinition } from './zod-schema'

const allItems: ItemDefinition[] = [
  {
    name: 'hero',
    tags: ['hero'],
    price: 0,
    stats: {
      health: 20,
      stamina: 5,
      staminaRegen: 1,
      space: 5,
    },
  },
  {
    name: 'banana',
    tags: ['food'],
    price: 3,
    stats: {
      space: -3,
    },
    triggers: [
      {
        type: 'interval',
        cooldown: 3_000,
        statsSelf: {
          health: 3,
          stamina: 2,
        },
      },
    ],
  },
  {
    name: 'woodenSword',
    tags: ['weapon'],
    price: 3,
    stats: {
      space: -2,
    },
    triggers: [
      {
        type: 'interval',
        cooldown: 3_000,
        statsSelf: {
          stamina: -3,
        },
        attack: {
          damage: 3,
          accuracy: 70,
        },
      },
    ],
  },
  {
    name: 'leatherBag',
    tags: ['bag'],
    price: 4,
    stats: {
      space: 4,
    },
  },
  {
    name: 'woodenBuckler',
    tags: ['shield'],
    price: 4,
    stats: {
      space: -4,
    },
    triggers: [
      {
        type: 'interval',
        cooldown: 3_000,
        statsSelf: {
          block: 3,
        },
      },
    ],
  },
]

export const getAllItems = async () => allItems
export const getItemByName = async (name: string) => {
  const item = allItems.find((item) => item.name === name)
  if (!item) {
    throw new Error(`Item not found: ${name}`)
  }
  return item
}