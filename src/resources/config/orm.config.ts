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
    // url: env.get<string>('DATABASE_URL'),
    host: env.get<string>('POSTGRES_HOST'),
    port: env.get<number>('POSTGRES_PORT'),
    username: env.get<string>('POSTGRES_USER'),
    password: env.get<string>('POSTGRES_PASSWORD'),
    database: env.get<string>('POSTGRES_DB'),
    entities: [__dirname + '/domain/*.entity.{ts,js}'],
    synchronize: env.get('DATABASE_SYNCRONIZE', { infer: true }),
    autoLoadEntities: true,
  };

  return ormconfig;
}

export { ormConfig };
