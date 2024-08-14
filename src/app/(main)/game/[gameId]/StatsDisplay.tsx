import { Stats } from '@/game/zod-schema'
import { capitalCase } from 'change-case'
import { map } from 'lodash-es'
import { Fragment } from 'react'

export const StatsDisplay = ({ stats }: { stats: Stats }) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        {map(stats, (value, key) => (
          <Fragment key={key}>
            <div className="px-2 py-1 border rounded bg-border/50 flex flex-col items-center">
              <div className="text-lg font-bold">{value}</div>
              <div>{capitalCase(key)}</div>
            </div>
          </Fragment>
        ))}
      </div>
    </>
  )
}