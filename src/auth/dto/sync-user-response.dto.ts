import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'firebase-uid-abc123' })
  firebaseUid: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email: string | null;

  @ApiPropertyOptional({ example: '+905551234567' })
  phoneNumber: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserProfileDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  userId: string;

  @ApiPropertyOptional({ example: 'Ayşe' })
  firstName: string | null;

  @ApiPropertyOptional({ example: 'Yılmaz' })
  lastName: string | null;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'NOT_SPECIFIED'], example: 'FEMALE' })
  gender: string;

  @ApiPropertyOptional({ example: '1995-06-15T00:00:00.000Z' })
  dateOfBirth: Date | null;

  @ApiPropertyOptional({ example: 168 })
  heightCm: number | null;

  @ApiPropertyOptional({ example: 65.5 })
  weightKg: number | null;

  @ApiProperty({ example: false })
  onboardingCompleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SyncUserResponseDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty({ type: () => UserProfileDto, nullable: true })
  profile: UserProfileDto | null;

  @ApiProperty({
    example: true,
    description: 'true if this is the first time the user logged in',
  })
  isNewUser: boolean;
}
