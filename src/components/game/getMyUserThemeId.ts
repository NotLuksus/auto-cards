import { getMyUser } from '@/auth/getMyUser'
import { defaultThemeId } from '@/game/themes'

export const getMyUserThemeId = async () => {
  const user = await getMyUser()
  const themeId = user?.themeId ?? undefined
  return themeId
}

export const getMyUserThemeIdWithFallback = async () => {
  const themeId = await getMyUserThemeId()
  return themeId ?? defaultThemeId
}