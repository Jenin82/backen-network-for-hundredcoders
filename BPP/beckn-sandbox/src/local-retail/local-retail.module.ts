import { Module } from '@nestjs/common';
import { LocalRetailController } from './local-retail.controller';
import { LocalRetailService } from './local-retail.service';

@Module({
  controllers: [LocalRetailController],
  providers: [LocalRetailService]
})
export class LocalRetailModule {}
