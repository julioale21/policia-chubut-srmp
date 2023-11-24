import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependenciesModule } from './dependencies/dependencies.module';
import { MechanicsModule } from './mechanics/mechanics.module';
import { CommonModule } from './common/common.module';
import { MovilesModule } from './moviles/moviles.module';
import { IngressModule } from './ingress/ingress.module';
import { EquipementsModule } from './equipements/equipements.module';
import { EquipementIngressModule } from './equipement-ingress/equipement-ingress.module';
import { EgressModule } from './egress/egress.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    DependenciesModule,

    MechanicsModule,

    CommonModule,

    MovilesModule,

    IngressModule,

    EquipementsModule,

    EquipementIngressModule,

    EgressModule,

    ProviderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
