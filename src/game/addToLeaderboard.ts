import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { Loadout } from '@/db/schema-zod'
import { and, eq } from 'drizzle-orm'
import { LEADERBOARD_TYPE, NO_OF_ROUNDS } from './config'
import { getLeaderboard } from './getLeaderboard'
import { generateMatchByWorker } from './matchWorkerManager'

export const addToLeaderboard = async ({
  type = LEADERBOARD_TYPE,
  roundNo = NO_OF_ROUNDS - 1,
  loadout,
}: {
  type?: string
  roundNo?: number
  loadout: Loadout
}) => {
  let leaderboard = await getLeaderboard({})
  if (!loadout.userId) {
    return
  }

  const selfLeaderboardEntry = await db.query.leaderboardEntry.findFirst({
    where: and(
      eq(schema.leaderboardEntry.loadoutId, loadout.id),
      eq(schema.leaderboardEntry.type, type),
      eq(schema.leaderboardEntry.roundNo, roundNo),
    ),
  })

  if (selfLeaderboardEntry) {
    leaderboard = leaderboard.filter(
      (entry) => entry.id !== selfLeaderboardEntry.id,
    )
  }

  const results = await Promise.all(
    leaderboard.map(async (entry) => {
      const result = await generateMatchByWorker({
        participants: [
          {
            loadout: loadout.data,
          },
          {
            loadout: entry.loadout.data,
          },
        ],
        seed: ['addToLeaderboard', type, roundNo, loadout.id, entry.id],
      })

      const win = result.winner.sideIdx === 0

      return {
        win,
      }
    }),
  )

  const matchCount = results.length || 1
  const winCount = results.filter((result) => result.win).length
  const winRate = winCount / matchCount
  let score = winRate * 100

  score = Math.round(score * 100) / 100

  if (selfLeaderboardEntry) {
    await db
      .update(schema.leaderboardEntry)
      .set({
        score,
      })
      .where(eq(schema.leaderboardEntry.id, selfLeaderboardEntry.id))
  } else {
    await db.insert(schema.leaderboardEntry).values({
      loadoutId: loadout.id,
      type,
      roundNo,
      score,
      userId: loadout.userId,
    })
  }
}