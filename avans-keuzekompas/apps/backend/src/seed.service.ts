import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '@avans-keuzekompas/infrastructure'; // jouw schema

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<Module>,
  ) {}

  async seedModules() {
    const count = await this.moduleModel.countDocuments();
    if (count > 0) {
      console.log('Modules already seeded');
      return;
    }

    const modules = [
      {
        title: 'Inleiding tot TypeScript',
        description: 'Leer de basis van TypeScript',
        location: 'Rotterdam',
        period: 'P1',
        studentCredits: 5,
        language: 'NL',
        level: 'Beginner',
        duration: '4 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Geavanceerde Webontwikkeling',
        description: 'Diepgaande kennis van moderne webtechnologieën',
        location: 'Eindhoven',
        period: 'P2',
        studentCredits: 6,
        language: 'EN',
        level: 'Advanced',
        duration: '6 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Databases en NoSQL',
        description: 'Werken met MongoDB en andere NoSQL databases',
        location: 'Den Bosch',
        period: 'P3',
        studentCredits: 5,
        language: 'NL',
        level: 'Intermediate',
        duration: '5 weken',
        offeredBy: 'Avans Hogeschool',
      },
    ];

    await this.moduleModel.insertMany(modules);
    console.log('Module seed completed!');
  }
}