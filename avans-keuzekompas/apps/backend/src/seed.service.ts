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
        description: 'Leer de basis van TypeScript en types in JavaScript.',
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
        description: 'Diepgaande kennis van moderne webtechnologieën zoals React en Node.js.',
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
        description: 'Werken met MongoDB, Redis en andere NoSQL databases.',
        location: 'Den Bosch',
        period: 'P3',
        studentCredits: 5,
        language: 'NL',
        level: 'Intermediate',
        duration: '5 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Cloud Computing Fundamentals',
        description: 'Introductie tot cloudplatforms zoals AWS en Azure.',
        location: 'Breda',
        period: 'P1',
        studentCredits: 4,
        language: 'EN',
        level: 'Beginner',
        duration: '3 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Cybersecurity Basics',
        description: 'Leer over beveiliging van systemen en netwerken.',
        location: 'Tilburg',
        period: 'P2',
        studentCredits: 5,
        language: 'NL',
        level: 'Beginner',
        duration: '4 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Mobile App Development',
        description: 'Ontwikkel mobiele applicaties met Flutter en React Native.',
        location: 'Eindhoven',
        period: 'P3',
        studentCredits: 6,
        language: 'EN',
        level: 'Intermediate',
        duration: '5 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Data Science en Machine Learning',
        description: 'Analyseer data en bouw ML-modellen met Python.',
        location: 'Den Bosch',
        period: 'P4',
        studentCredits: 7,
        language: 'NL',
        level: 'Advanced',
        duration: '6 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'Software Testing & Quality Assurance',
        description: 'Testmethoden en tools voor betrouwbare software.',
        location: 'Breda',
        period: 'P2',
        studentCredits: 4,
        language: 'EN',
        level: 'Intermediate',
        duration: '4 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'DevOps & Continuous Integration',
        description: 'Automatiseer deployment en leer over CI/CD pipelines.',
        location: 'Rotterdam',
        period: 'P3',
        studentCredits: 5,
        language: 'NL',
        level: 'Advanced',
        duration: '5 weken',
        offeredBy: 'Avans Hogeschool',
      },
      {
        title: 'User Experience Design',
        description: 'Ontwerp gebruiksvriendelijke interfaces en doe gebruikersonderzoek.',
        location: 'Tilburg',
        period: 'P4',
        studentCredits: 5,
        language: 'EN',
        level: 'Beginner',
        duration: '4 weken',
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
        password: 'password123',
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