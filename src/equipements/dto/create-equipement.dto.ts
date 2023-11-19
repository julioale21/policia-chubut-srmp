import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEquipementDto {
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  car_jack: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  weel_wrench: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  fire_stinguisher: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  reflective_vest: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  beacons: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  communication_equipment: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  radio_antenna: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  stereo: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  trailer_line: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  spare_wheel: boolean;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  observations: string;
}
