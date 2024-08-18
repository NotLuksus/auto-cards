import { throwIfNotAdmin } from '@/auth/getIsAdmin'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { cn } from '@/lib/utils'
import { ActionButton } from '@/super-action/button/ActionButton'
import { capitalCase } from 'change-case'
import { desc, eq } from 'drizzle-orm'
import { first, orderBy } from 'lodash-es'
import { revalidatePath } from 'next/cache'
import { Fragment } from 'react'
import { AiImageProps } from './AiImage'
import { generateAiImage } from './generateAiImage.action'

export const AiImageGallery = async ({
  itemId,
  prompt,
  className,
}: AiImageProps) => {
  const aiImages = await db.query.aiImage.findMany({
    where: itemId
      ? eq(schema.aiImage.itemId, itemId)
      : eq(schema.aiImage.prompt, prompt),
    orderBy: desc(schema.aiImage.createdAt),
  })

  const active = first(orderBy(aiImages, 'updatedAt', 'desc'))

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-col flex-1">
            <h2 className="font-bold text-xl">AI Image Gallery</h2>
            <h3 className="opacity-60">
              {itemId ? capitalCase(itemId) : prompt}
            </h3>
          </div>
          <ActionButton
            action={async () => {
              'use server'
              return generateAiImage({
                prompt,
                itemId,
                force: !!aiImages.length,
              })
            }}
          >
            New Image
          </ActionButton>
        </div>
        <div className="grid grid-cols-3 gap-2 items-start">
          {aiImages.map((aiImage) => (
            <Fragment key={aiImage.id}>
              <ActionButton
                component="button"
                hideIcon
                action={async () => {
                  'use server'
                  await throwIfNotAdmin({ allowDev: true })
                  await db
                    .update(schema.aiImage)
                    .set({
                      updatedAt: new Date().toISOString(),
                    })
                    .where(eq(schema.aiImage.id, aiImage.id))
                  revalidatePath('/', 'layout')
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aiImage.url}
                  alt={prompt}
                  className={cn(
                    active === aiImage && 'ring-4 ring-primary',
                    className,
                  )}
                />
              </ActionButton>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}