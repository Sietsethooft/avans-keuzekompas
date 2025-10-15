import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepository } from '@avans-keuzekompas/domain';
import { UserRepository } from '@avans-keuzekompas/domain';
import { Module } from '@avans-keuzekompas/domain';
import { User } from '@avans-keuzekompas/domain';

@Injectable()
export class ModuleService {
    constructor(
        private readonly moduleRepository: ModuleRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async getAllModules(): Promise<Module[]> {
        return this.moduleRepository.getAll();
    }

    async getModuleById(id: string): Promise<Module | null> {
        return this.moduleRepository.getById(id);
    }
    
    async toggleFavoriteForUser(
    moduleId: string,
    userId: string
  ): Promise<{ isFavorite: boolean; favorites: string[] }> {
    const [mod, user] = await Promise.all([
      this.moduleRepository.getById(moduleId),
      this.userRepository.findById(userId),
    ]);

    if (!mod) throw new NotFoundException('Module not found');
    if (!user) throw new NotFoundException('User not found');

    const current = (user.favorites ?? []).map(String);
    const idx = current.indexOf(String(moduleId));

    let isFavorite = false;
    if (idx >= 0) {
      current.splice(idx, 1);
      isFavorite = false;
    } else {
      current.push(String(moduleId));
      isFavorite = true;
    }

    const updated = await this.userRepository.updateById(userId, { favorites: current as User['favorites'] });
    return {
      isFavorite,
      favorites: (updated?.favorites ?? current).map(String),
    };
  }
}