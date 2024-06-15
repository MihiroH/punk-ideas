/**
 * ! Executing this script will delete all data in your database and seed it with 10 reportReason.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { parseArgs } from 'node:util'
import { createSeedClient } from '@snaplet/seed'

const options = {
  environment: { type: 'string' },
} as const

const main = async () => {
  const {
    values: { environment },
  } = parseArgs({ options })
  const baseClient = await createSeedClient()

  await baseClient.$resetDatabase()

  const { category } = await baseClient.category([
    { name: '子育て' },
    { name: '介護' },
    { name: '食品' },
    { name: '衣類' },
    { name: '日用品' },
    { name: '住居' },
    { name: '家電' },
    { name: 'IT' },
    { name: 'コスメ' },
    { name: 'スポーツ' },
    { name: '言語' },
    { name: '防犯' },
  ])

  const { reportReason } = await baseClient.reportReason([
    { reasonDescription: 'アイデアではない' },
    { reasonDescription: '単に気に入らない' },
    { reasonDescription: '暴力または危険な団体' },
    { reasonDescription: '知的財產権の侵害' },
    { reasonDescription: '違法' },
    { reasonDescription: '薬物' },
    { reasonDescription: 'その他' },
  ])

  const seed = await createSeedClient({
    connect: {
      reportReason,
      category,
    },
  })

  switch (environment) {
    case 'development': {
      const { user } = await seed.user((createMany) => createMany(10))
      const { idea: _idea } = await seed.idea(
        (createMany) =>
          createMany(35, {
            t_idea_categories: (createMany) => createMany({ min: 1, max: 3 }),
            t_idea_files: (createMany) => createMany({ min: 0, max: 5 }),
            t_comments: (createMany) => createMany({ min: 0, max: 5 }),
            t_reports: (createMany) => createMany({ min: 0, max: 5 }),
          }),
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
