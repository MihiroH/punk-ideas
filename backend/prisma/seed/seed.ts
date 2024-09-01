/**
 * ! Executing this script will delete all data in your database and seed it with 10 reportReason.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { parseArgs } from 'node:util'
import { faker } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'

import { OPEN_LEVELS } from '@src/idea/constants/idea.constant'

const now = new Date()

const options = {
  environment: { type: 'string' },
} as const

const {
  values: { environment },
} = parseArgs({ options })

const CATEGORY_NAMES = [
  '子育て',
  '介護',
  '食品',
  '衣類',
  '日用品',
  '住居',
  '家電',
  'IT',
  'コスメ',
  'スポーツ',
  '言語',
  '防犯',
]

const REPORT_REASON_DESCRIPTIONS = [
  'アイデアではない',
  '単に気に入らない',
  '暴力または危険な団体',
  '知的財產権の侵害',
  '違法',
  '薬物',
  'その他',
]

const main = async () => {
  const baseClient = await createSeedClient()

  await baseClient.$resetDatabase()

  const { category } = await baseClient.category(
    CATEGORY_NAMES.map((categoryName) => ({ name: categoryName, updatedAt: now })),
  )

  const { reportReason } = await baseClient.reportReason(
    REPORT_REASON_DESCRIPTIONS.map((reasonDescription) => ({ reasonDescription, updatedAt: now })),
  )

  const seed = await createSeedClient({
    connect: {
      reportReason,
      category,
    },
  })

  switch (environment) {
    case 'development': {
      const { user } = await seed.user((createMany) =>
        createMany(10, () => ({
          email: faker.internet.email(),
          nickname: faker.helpers.arrayElement([faker.person.firstName(), null]),
          age: faker.number.int({ min: 10, max: 80 }),
          emailVerifiedAt: faker.helpers.arrayElement([now, null]),
          updatedAt: now,
          deletedAt: null,
        })),
      )

      const { idea: _idea } = await seed.idea(
        (createMany) =>
          createMany(35, () => ({
            openLevel: faker.helpers.arrayElement([
              OPEN_LEVELS.private,
              OPEN_LEVELS.public,
              OPEN_LEVELS.public,
              OPEN_LEVELS.public,
              OPEN_LEVELS.public,
            ]),
            updatedAt: now,
            deletedAt: null,
            t_idea_categories: (createMany) => createMany({ min: 1, max: 3 }, { updatedAt: now }),
            t_idea_files: (createMany) => createMany({ min: 0, max: 5 }, { updatedAt: now }),
            t_comments: (createMany) => createMany({ min: 0, max: 5 }, { updatedAt: now, deletedAt: null }),
            t_reports: (createMany) => createMany({ min: 0, max: 5 }, { updatedAt: now }),
          })),
        { connect: { user } },
      )
      break
    }
    default:
      break
  }

  console.log('Database seeded successfully!')

  process.exit()
}

main()
