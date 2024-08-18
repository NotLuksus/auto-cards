import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { Game, Match } from '@/db/schema-zod'
import { getBotName } from '@/game/botName'
import { generateMatch } from '@/game/generateMatch'
import { eq } from 'drizzle-orm'
import { every, orderBy } from 'lodash-es'
import { LoadoutDisplay } from './LoadoutDisplay'
import { MatchReportDisplay } from './MatchReportDisplay'
import { NextRoundButton } from './NextRoundButton'

export const MatchView = async ({
  game,
  match,
}: {
  game?: Game
  match: Match
}) => {
  let participants = await db.query.matchParticipation.findMany({
    where: eq(schema.matchParticipation.matchId, match.id),
    with: {
      loadout: true,
      user: true,
    },
  })
  participants = orderBy(participants, (p) => p.sideIdx, 'asc')
  if (participants.length !== 2) {
    throw new Error('Match must have exactly 2 participants')
  }
  if (!every(participants, (p) => p.loadout)) {
    throw new Error('All participants must have loadouts')
  }

  const matchReport = await generateMatch({
    participants: participants.map((p) => ({ loadout: p.loadout.data })),
    seed: [match.data.seed],
  })

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <div>
          {participants[1]?.user?.name ||
            participants[1]?.user?.email ||
            getBotName({ seed: participants[1].loadout.id })}
        </div>
        <div className="self-stretch flex flex-col gap-4 rotate-180">
          <LoadoutDisplay loadout={participants[1].loadout.data} />
        </div>
        <div className="max-h-96 overflow-auto rounded-lg self-stretch lg:self-center">
          <MatchReportDisplay matchReport={matchReport} />
        </div>
        <div className="self-stretch flex flex-col gap-4">
          <LoadoutDisplay loadout={participants[0].loadout.data} />
        </div>
        <div>{participants[0]?.user?.name || 'Me'}</div>
        {!!game && <NextRoundButton game={game} />}
      </div>
    </>
  )
}
