import { Module } from '@nestjs/common';
import { ModuleService } from './module.service.js';
import { MongooseModuleRepository } from '@avans-keuzekompas/infrastructure';
import { MongooseUserRepository } from '@avans-keuzekompas/infrastructure';
import { ModuleRepository, UserRepository } from '@avans-keuzekompas/domain';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModuleModel, ModuleSchema } from '@avans-keuzekompas/infrastructure';
import { User as UserModel, UserSchema } from '@avans-keuzekompas/infrastructure';

@Module({
  imports: [
        MongooseModule.forFeature([
      { name: ModuleModel.name, schema: ModuleSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
  ],
  providers: [
    ModuleService,
    {
      provide: ModuleRepository,
      useClass: MongooseModuleRepository,
    },
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [ModuleService],
})
export class ModuleModule {}