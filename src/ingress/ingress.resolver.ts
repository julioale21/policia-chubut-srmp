import { Query, Resolver } from '@nestjs/graphql';
import { Ingress } from './entities/ingress.entity';
import { IngressService } from './ingress.service';

@Resolver()
export class IngressResolver {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Ingress])
  async getAllIngress(): Promise<Ingress[]> {
    return await this.ingressService.findAll();
  }
}
