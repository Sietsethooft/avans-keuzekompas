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
        title: 'Persoonlijke Effectiviteit & Growth Mindset',
        description:
          'Werk aan studie- en werkhouding met growth mindset, timemanagement en reflectie. Je maakt een persoonlijk actieplan met meetbare gewoontes.',
        location: 'Breda',
        period: 'P1',
        studentCredits: 4,
        language: 'NL',
        level: 'Jaar 1',
        duration: '4 weken',
        offeredBy: 'Informatica',
      },
      {
        title: 'Nationale Veiligheid & Crisisbeheersing',
        description:
          'Introductie in het veiligheidsdomein en crisismanagement met praktijkcasussen. Je oefent scenario’s rond openbare orde, vitale infrastructuur en dreiging.',
        location: 'Tilburg',
        period: 'P2',
        studentCredits: 6,
        language: 'NL',
        level: 'Jaar 3',
        duration: '5 weken',
        offeredBy: 'Integrale Veiligheidskunde',
      },
      {
        title: 'Meester in Crisis: Leiderschap in Noodsituaties',
        description:
          'Ontwikkel leiderschap onder druk met besluitvorming, communicatie en teamwork in crisisteams. Realistische simulaties en rollenspellen staan centraal.',
        location: 'Rotterdam',
        period: 'P3',
        studentCredits: 5,
        language: 'NL',
        level: 'Jaar 4',
        duration: '4 weken',
        offeredBy: 'Integrale Veiligheidskunde',
      },
      {
        title: 'Design Thinking & Service Design',
        description:
          'Leer via empathisch onderzoek en prototyping waardevolle diensten ontwerpen. Je test iteratief met gebruikers en onderbouwt keuzes met inzichten.',
        location: 'Den Bosch',
        period: 'P2',
        studentCredits: 5,
        language: 'NL',
        level: 'Jaar 2',
        duration: '4 weken',
        offeredBy: 'Communication & Multimedia Design',
      },
      {
        title: 'Duurzame Bedrijfsvoering & Circulariteit',
        description:
          'Verken duurzame strategie, circulariteit en impactmeting (ESG). Je maakt een verbeterplan en rekent de impact door op mens, milieu en resultaat.',
        location: 'Breda',
        period: 'P3',
        studentCredits: 6,
        language: 'NL',
        level: 'Jaar 2',
        duration: '5 weken',
        offeredBy: 'Bedrijfskunde',
      },
      {
        title: 'Data Literacy & Evidence-based Decision Making',
        description:
          'Vergroot datavaardigheden zonder te programmeren: kritisch lezen, basisstatistiek, visualisaties en heldere communicatie voor betere besluitvorming.',
        location: 'Eindhoven',
        period: 'P1',
        studentCredits: 5,
        language: 'EN',
        level: 'Jaar 1',
        duration: '4 weken',
        offeredBy: 'Business IT & Management',
      },
      {
        title: 'Digitale Ethiek, Privacy & AI Impact',
        description:
          'Verdiep je in ethiek rond data, algoritmen en AI: AVG, bias en transparantie. Je ontwikkelt een ethisch kader met praktijkcasussen.',
        location: 'Den Bosch',
        period: 'P4',
        studentCredits: 5,
        language: 'EN',
        level: 'Jaar 3',
        duration: '4 weken',
        offeredBy: 'Informatica',
      },
      {
        title: 'Interculturele Samenwerking & International Project Skills',
        description:
          'Samenwerken in internationale teams: interculturele communicatie, verwachtingen managen en conflicten oplossen. Je bouwt een professioneel portfolio.',
        location: 'Rotterdam',
        period: 'P2',
        studentCredits: 4,
        language: 'EN',
        level: 'Jaar 2',
        duration: '4 weken',
        offeredBy: 'International Business',
      },
      {
        title: 'UX Research & Usability Testing',
        description:
          'Doorloop de UX-onderzoeks­cyclus: probleem, hypothesen, onderzoek en testen. Vertaal inzichten naar concrete verbeteringen en presenteer aan stakeholders.',
        location: 'Tilburg',
        period: 'P4',
        studentCredits: 5,
        language: 'NL',
        level: 'Jaar 2',
        duration: '4 weken',
        offeredBy: 'Communication & Multimedia Design',
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