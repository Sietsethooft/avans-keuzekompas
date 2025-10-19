import { Module } from './module.entity.js';

export abstract class ModuleRepository {
    abstract getAll(): Promise<Module[]>;
    abstract getById(id: string): Promise<Module | null>;
    abstract deleteById(id: string): Promise<void>;
    abstract findOne(criteria: Partial<Module>): Promise<Module | null>;
    abstract updateById(id: string, updateData: Partial<Module>): Promise<Module | null>;
    abstract create(moduleData: Partial<Module>): Promise<Module>;
}