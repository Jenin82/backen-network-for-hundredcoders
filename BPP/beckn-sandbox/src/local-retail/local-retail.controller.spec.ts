import { Test, TestingModule } from '@nestjs/testing';
import { LocalRetailController } from './local-retail.controller';

describe('LocalRetailController', () => {
  let controller: LocalRetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalRetailController],
    }).compile();

    controller = module.get<LocalRetailController>(LocalRetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
