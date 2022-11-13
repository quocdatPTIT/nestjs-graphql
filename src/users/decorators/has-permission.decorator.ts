import { SetMetadata } from '@nestjs/common';

import MetadataConstant from '../../common/constant/metadata.constant';

export const HasPermission = (permissionName: string) =>
  SetMetadata(MetadataConstant.PERMISSION, permissionName);
