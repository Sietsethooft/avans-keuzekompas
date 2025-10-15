import { Injectable } from '@nestjs/common';
import { ModuleRepository } from '@avans-keuzekompas/domain';
import { Module } from '@avans-keuzekompas/domain';

@Injectable()
export class ModuleService {
    constructor(private readonly moduleRepository: ModuleRepository) {}

    async getAllModules(): Promise<Module[]> {
        return this.moduleRepository.getAll();
    }

    async getModuleById(id: string): Promise<Module | null> {
        return this.moduleRepository.getById(id);
    }
}