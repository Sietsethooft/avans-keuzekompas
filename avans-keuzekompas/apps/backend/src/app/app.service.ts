import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello and welcome to the Avans Keuzekompas API!' };
  }
}
