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
          'Versterk je studie- en werkhouding met bewezen mindset-principes. Je leert doelen stellen, reflecteren, feedback benutten en omgaan met tegenslag. We behandelen time management, concentratie, gezondheid en routines die studiesucces aantoonbaar vergroten. Je bouwt een persoonlijk actieplan met meetbare gewoontes en voortgang.',
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
          'Maak kennis met het Nederlandse veiligheidsdomein en de basis van rampen- en crisismanagement. Je oefent met scenario’s rond openbare orde, vitale infrastructuur en dreigingsinschatting. We koppelen theorie aan praktijk met casussen (bijv. overstromingen, cyberincidenten) en aandacht voor bestuurlijke afwegingen.',
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
          'Ontwikkel daadkrachtig leiderschap onder druk. Je leert besluitvorming onder onzekerheid, heldere communicatie, rolverdeling in crisisteams en samenwerken met hulpdiensten. Realistische simulaties en rollenspellen helpen je om richting te geven, prioriteiten te stellen en verantwoordelijkheid te nemen in hectische situaties.',
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
          'Leer gebruikersproblemen diepgaand te begrijpen en waardevolle diensten te ontwerpen. Je past empathisch onderzoek, journey mapping, ideation en prototyping toe. Je test meerdere iteraties met echte gebruikers en leert beslissingen te onderbouwen met kwalitatieve en kwantitatieve inzichten.',
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
          'Ontdek hoe organisaties waarde creëren met duurzaamheid als strategische kern. Onderwerpen: circular business models, impactmeting (ESG), ketensamenwerking en veranderkunde. Je werkt aan een verbeterplan voor een echte of gesimuleerde organisatie en rekent door wat de impact is op mens, milieu en resultaat.',
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
          'Vergroot je datavaardigheden zonder te programmeren. Je leert datasets kritisch lezen, basisstatistiek toepassen, visualisaties maken en conclusies verantwoord te communiceren. We gebruiken toegankelijke tools en richten ons op betrouwbare besluitvorming binnen projecten en organisaties.',
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
          'Verdiep je in ethische vraagstukken rondom data, algoritmen en AI. Je bespreekt privacywetgeving (o.a. AVG), bias en transparantie, en ontwikkelt een ethisch kader voor product- en beleidsbeslissingen. Casussen uit zorg, overheid en bedrijfsleven maken de maatschappelijke impact concreet.',
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
          'Werk effectief samen in internationale teams. Je leert communiceren over cultuurgrenzen heen, verwachtingen managen, online samenwerken en conflicten constructief oplossen. In een project met een partnerinstelling ontwikkel je een professioneel portfolio met reflecties en peer feedback.',
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
          'Leer de complete UX-onderzoeks-cyclus: probleemdefinitie, hypothesen, gebruikersonderzoek, testopzet, dataverzameling en rapportage. Je vertaalt inzichten naar concrete verbeteringen voor producten of diensten en presenteert bevindingen overtuigend aan stakeholders.',
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