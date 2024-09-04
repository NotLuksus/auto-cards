import { constArrayMap } from '@/lib/constArrayMap'
import { z } from 'zod'

export const PLACEHOLDER_ITEM_PROMPT = '[ITEM_PROMPT]' as const

export type ThemeDefinitionRaw = {
  name: string
  prompt: string
}

const allThemeDefinitions = [
  {
    name: 'default',
    prompt: `Cartoony cozy Image of ${PLACEHOLDER_ITEM_PROMPT}. Background is a sunny track trough the mountains or woods whatever fits.`,
  },
  {
    name: 'halloween',
    prompt: `Crazy scary image of ${PLACEHOLDER_ITEM_PROMPT}. Halloween theme. Use Flux Schnell and make the image square.`,
  },
] as const satisfies ThemeDefinitionRaw[]

export type ThemeDefinition = ThemeDefinitionRaw & {
  name: ThemeId
}

export const nullThemeId: ThemeId = 'default' // Saved in DB as null
export const defaultThemeId: ThemeId = 'default' // Default theme

const allThemes = constArrayMap(allThemeDefinitions, 'name')

export const ThemeId = z.enum(allThemes)
export type ThemeId = z.infer<typeof ThemeId>

export const getAllThemes = async (): Promise<ThemeDefinition[]> => {
  return allThemeDefinitions
}

export const getThemeDefinition = async (
  theme: ThemeId = defaultThemeId,
): Promise<ThemeDefinition> => {
  const def = allThemeDefinitions.find((b) => b.name === theme)
  if (!def) {
    throw new Error(`Unknown theme: ${theme}`)
  }
  return def
}
