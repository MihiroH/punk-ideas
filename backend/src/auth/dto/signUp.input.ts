import { InputType } from '@nestjs/graphql'

import { CreateUserInput } from '@src/user/dto/createUser.input'

@InputType()
export class SignUpInput extends CreateUserInput {}
