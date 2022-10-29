import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import StringConstant from '../constant/string.constant';

@Global()
@Module({
  providers: [
    {
      provide: StringConstant.PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [StringConstant.PUB_SUB],
})
export class GlobalModule {}
