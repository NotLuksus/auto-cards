import { GAME_VERSION } from '@/game/config'
import { createSeed } from '@/game/seed'
import { createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { schema } from './schema-export'

const seed = z.string().default(() => createSeed())

export const User = createSelectSchema(schema.users)
export type User = z.infer<typeof User>

export const LoadoutData = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      count: z.number().optional(),
    }),
  ),
})
export type LoadoutData = z.infer<typeof LoadoutData>

export const Loadout = createSelectSchema(schema.loadout, {
  data: LoadoutData,
})
export type Loadout = z.infer<typeof Loadout>

export const GameData = z.object({
  version: z.number().default(GAME_VERSION),
  seed,
  roundNo: z.number().default(0),
  gold: z.number().default(0),
  shopRerolls: z.number().default(0),
  shopItems: z.array(
    z.object({
      name: z.string(),
      isOnSale: z.boolean().optional(),
      isReserved: z.boolean().optional(),
      isSold: z.boolean().optional(),
    }),
  ),
  currentLoadout: LoadoutData,
})
export type GameData = z.infer<typeof GameData>

export const Game = createSelectSchema(schema.game, {
  data: GameData,
})
export type Game = z.infer<typeof Game>

export const MatchData = z.object({
  seed,
})
export type MatchData = z.infer<typeof MatchData>

export const Match = createSelectSchema(schema.match, {
  data: MatchData,
})
export type Match = z.infer<typeof Match>

export const MatchParticipationData = z.object({})
export type MatchParticipationData = z.infer<typeof MatchParticipationData>

export const MatchParticipation = createSelectSchema(
  schema.matchParticipation,
  {
    data: MatchParticipationData,
  },
)
export type MatchParticipation = z.infer<typeof MatchParticipation>

export const LiveMatchStatus = z.enum(['open', 'locked'])
export type LiveMatchStatus = z.infer<typeof LiveMatchStatus>

export const LiveMatchData = z.object({
  seed,
})
export type LiveMatchData = z.infer<typeof LiveMatchData>

export const LiveMatch = createSelectSchema(schema.liveMatch, {
  data: LiveMatchData,
  status: LiveMatchStatus,
})
export type LiveMatch = z.infer<typeof LiveMatch>

export const LiveMatchParticipationData = z.object({
  ready: z.boolean().default(false),
  isHost: z.boolean().default(false),
})
export type LiveMatchParticipationData = z.infer<
  typeof LiveMatchParticipationData
>

export const LiveMatchParticipation = createSelectSchema(
  schema.liveMatchParticipation,
  {
    data: LiveMatchParticipationData,
  },
)
export type LiveMatchParticipation = z.infer<typeof LiveMatchParticipation>
