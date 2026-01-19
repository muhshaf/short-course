import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainResolver } from './blockchain/blockchain.resolver';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [AppController],
  providers: [AppService, BlockchainResolver],
})
export class AppModule {}
