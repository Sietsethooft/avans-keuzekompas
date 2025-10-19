/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Check if module and user exist
    if (!mod) throw new NotFoundException('Module not found');
    if (!user) throw new NotFoundException('User not found');

    // Toggle favorite
    const current = (user.favorites ?? []).map(String);
    const idx = current.indexOf(String(moduleId));

    let isFavorite = false;
    if (idx >= 0) {
      current.splice(idx, 1); // Remove from favorites
      isFavorite = false;
    } else {
      current.push(String(moduleId)); // Add to favorites
      isFavorite = true;
    }

    const updated = await this.userRepository.updateById(userId, { favorites: current as User['favorites'] }); // Update favorites
    return {
      isFavorite,
      favorites: (updated?.favorites ?? current).map(String),
    };
  }

  async deleteModuleById(id: string): Promise<void> {
    await this.moduleRepository.deleteById(id);
    await this.userRepository.removeFavoriteFromAllUsers(id);
  }

  async updateModuleById(id: string, update: Partial<Module>): Promise<Module | null> {
    const current = await this.moduleRepository.getById(id);
    if (!current) return null;

    // Determine next title and location
    const nextTitle = update.title ?? current.title;
    const nextLocation = update.location ?? current.location;

    // Check for existing module with same title and location
    const existing = await this.moduleRepository.findOne({ title: nextTitle, location: nextLocation });
    if (existing && String(existing.id) !== String(id)) {
      throw new Error('Module met deze titel en locatie bestaat al');
    }

    try {
      return await this.moduleRepository.updateById(id, update);
    } catch (e: any) {
      if (e && (e.code === 11000 || e?.name === 'MongoServerError')) {
        throw new Error('Module met deze titel en locatie bestaat al');
      }
      throw e;
    }
  }

  async createModule(moduleData: Module): Promise<Module> {
    const existing = await this.moduleRepository.findOne({ title: moduleData.title, location: moduleData.location });
    if (existing) {
      throw new Error('Module met deze titel en locatie bestaat al');
    }
    try {
      return await this.moduleRepository.create(moduleData);
    } catch (e: any) {
      if (e && (e.code === 11000 || e?.name === 'MongoServerError')) {
        throw new Error('Module met deze titel en locatie bestaat al');
      }
      throw e;
    }
  }
}