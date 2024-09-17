import { Query, Resolver } from '@nestjs/graphql'
import { CategoryService } from './category.service'
import { Category } from './models/category.model'

@Resolver()
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryService.getAll()
  }
}
