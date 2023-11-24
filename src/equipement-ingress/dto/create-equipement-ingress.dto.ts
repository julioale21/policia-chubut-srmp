import { IsUUID } from 'class-validator';

export class CreateEquipementIngressDto {
  @IsUUID()
  equipementId: string;

  @IsUUID()
  ingressId: string;
}
