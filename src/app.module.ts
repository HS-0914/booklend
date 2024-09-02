import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 15432,
    //   username: 'postgres',
    //   password: '3527',
    //   database: 'booklend',
    //   entities: [__dirname + '/domain/*.entity.{ts,js}'],
    //   synchronize : true  
    // })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
