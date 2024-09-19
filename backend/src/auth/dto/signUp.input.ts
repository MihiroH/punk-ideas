import { InputType } from '@nestjs/graphql'

import { UserCreateInput } from '@src/user/dto/userCreate.input'

@InputType()
export class SignUpInput extends UserCreateInput {}
