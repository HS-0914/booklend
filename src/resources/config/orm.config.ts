import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(env: ConfigService): TypeOrmModuleOptions {
  // const commonConf = {
  //       SYNCRONIZE: false,
  //       ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
  //       MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
  //       CLI: {
  //           migrationsDir: 'src/migrations',
  //       },
  //       MIGRATIONS_RUN: false,
  //   };

  const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: env.get<string>('DATABASE_URL'),
    entities: [__dirname + '/domain/*.entity.{ts,js}'],
    synchronize: env.get('DATABASE_SYNCRONIZE', { infer: true }),
    autoLoadEntities: true,
  };

  return ormconfig;
}

export { ormConfig };
