import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config'; // Ensure this module is installed
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { ResearchGroupsModule } from './research-groups/research-groups.module';

@Module({
  imports: [
    UsersModule,
    ResearchGroupsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@uniautonoma.mewn3yv.mongodb.net/?retryWrites=true&w=majority&appName=Uniautonoma`,
    ),
    AuthModule,
    ResearchGroupsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
