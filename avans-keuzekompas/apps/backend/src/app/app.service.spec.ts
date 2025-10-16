import { AppService } from './app.service';

describe('AppService', () => {
  it('getData gives a welcome message back', () => {
    const svc = new AppService();
    expect(svc.getData()).toEqual({ message: 'Hello and welcome to the Avans Keuzekompas API!' });
  });
});