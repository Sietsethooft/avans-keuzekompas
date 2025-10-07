import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, User } from '@avans-keuzekompas/infrastructure'; // jouw schema

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<Module>,
    @InjectModel(User.name) private userModel: Model<User>,
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

  async seedUsers() {
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      console.log('Users already seeded');
      return;
    }

    const users = [
      {
        firstName: 'Jan',
        lastName: 'Jansen',
        email: 'jan.jansen@student.avans.nl',
        studentNumber: '123456',
        password: 'password123', // In productie altijd hashen!
        role: 'student',
        favorites: [],
      },
      {
        firstName: 'Sanne',
        lastName: 'de Vries',
        email: 'sanne.vries@student.avans.nl',
        studentNumber: '654321',
        password: 'password456',
        role: 'student',
        favorites: [],
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@avans.nl',
        studentNumber: '000001',
        password: 'adminpass',
        role: 'admin',
        favorites: [],
      },
    ];

    await this.userModel.insertMany(users);
    console.log('User seed completed!');
  }
}