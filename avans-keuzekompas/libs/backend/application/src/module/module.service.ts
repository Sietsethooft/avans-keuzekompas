import { Injectable } from '@nestjs/common';
import { ModuleRepository } from '@avans-keuzekompas/domain';
import { Module } from '@avans-keuzekompas/domain';

@Injectable()
export class ModuleService {
    constructor(private readonly moduleRepository: ModuleRepository) {}

    async getAllModules(): Promise<Module[]> {
        return this.moduleRepository.getAll();
    }
}