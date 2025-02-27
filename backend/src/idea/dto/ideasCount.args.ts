import { ArgsType } from '@nestjs/graphql'

import { IdeasGetBaseArgs } from './ideasGetBase.args'

@ArgsType()
export class IdeasCountArgs extends IdeasGetBaseArgs {}
