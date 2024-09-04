import {
  getThemeDefinition,
  PLACEHOLDER_ITEM_PROMPT,
  ThemeId,
} from '@/game/themes'
import { capitalCase } from 'change-case'

export const getItemAiImagePrompt = async ({
  name,
  themeId,
}: {
  name: string
  themeId: ThemeId
}) => {
  const theme = await getThemeDefinition(themeId)
  let prompt = theme.prompt
  const itemPrompt = capitalCase(name)
  prompt = prompt.replace(PLACEHOLDER_ITEM_PROMPT, itemPrompt)
  return prompt
}
