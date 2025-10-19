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

  async deleteModuleById(id: string): Promise<void> {
    await this.moduleRepository.deleteById(id);
  }

  async updateModuleById(id: string, update: Partial<Module>): Promise<Module | null> {
    if (update.title && update.location) {
      const existing = await this.moduleRepository.findOne({ title: update.title, location: update.location });
      if (existing && String(existing.id) !== String(id)) {
        throw new Error('Module met deze titel en locatie bestaat al');
      }
    }
    return this.moduleRepository.updateById(id, update);
  }
}