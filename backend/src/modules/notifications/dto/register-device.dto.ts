import { IsOptional, IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'AtLeastOneToken', async: false })
class AtLeastOneTokenConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const obj = args.object as RegisterDeviceDto;
    return !!(obj.fcmToken || obj.apnsToken);
  }

  defaultMessage(): string {
    return 'At least one of fcmToken or apnsToken must be provided';
  }
}

export class RegisterDeviceDto {
  @ApiPropertyOptional({ description: 'Firebase Cloud Messaging token' })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiPropertyOptional({ description: 'Apple Push Notification Service token' })
  @IsOptional()
  @IsString()
  @Validate(AtLeastOneTokenConstraint)
  apnsToken?: string;
}
