import { Module } from './module.entity.js';

export abstract class ModuleRepository {
    abstract getAll(): Promise<Module[]>;
}