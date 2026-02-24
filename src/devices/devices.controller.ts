import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PairDeviceDto } from './dto/pair-device.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';
import { SyncDeviceDto } from './dto/sync-device.dto';
import { DeviceDto, DeviceStatusDto, UnpairResponseDto } from './dto/device-response.dto';
import type { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Devices')
@Controller('devices')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(DeviceDto, DeviceStatusDto, UnpairResponseDto)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('pair')
  @ApiOperation({
    summary: 'Pair a new device',
    description:
      'Links a device by serial number to the current user. ' +
      'If the device was previously paired by this user, it re-pairs it.',
  })
  @ApiResponse({
    status: 201,
    description: 'Device paired successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DeviceDto) },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Device already paired to another user' })
  async pairDevice(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: PairDeviceDto,
  ) {
    return this.devicesService.pairDevice(user.uid, dto);
  }

  @Get('my-device')
  @ApiOperation({
    summary: 'Get current user\'s paired device',
    description: 'Returns the most recently paired device. Returns 404 if no device is paired.',
  })
  @ApiResponse({
    status: 200,
    description: 'Device retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DeviceDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'No device paired' })
  async getMyDevice(@CurrentUser() user: DecodedIdToken) {
    return this.devicesService.getMyDevice(user.uid);
  }

  @Patch(':id/settings')
  @ApiOperation({
    summary: 'Update device settings',
    description: 'Partially update device configuration. Send only the fields you want to change.',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings updated',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DeviceDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async updateSettings(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
    @Body() dto: UpdateDeviceSettingsDto,
  ) {
    return this.devicesService.updateSettings(user.uid, id, dto);
  }

  @Post(':id/sync')
  @ApiOperation({
    summary: 'Sync device telemetry',
    description: 'Update battery state, battery percentage and firmware version from device. Sets syncStatus to SYNCED.',
  })
  @ApiResponse({
    status: 200,
    description: 'Device synced',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DeviceDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async syncDevice(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
    @Body() dto: SyncDeviceDto,
  ) {
    return this.devicesService.syncDevice(user.uid, id, dto);
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Get device battery and sync status',
    description: 'Lightweight status check — battery level, charge state, sync state, firmware.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(DeviceStatusDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async getStatus(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
  ) {
    return this.devicesService.getStatus(user.uid, id);
  }

  @Delete(':id/unpair')
  @ApiOperation({
    summary: 'Unpair device',
    description: 'Removes the device record. The device can be re-paired later with the serial number.',
  })
  @ApiResponse({
    status: 200,
    description: 'Device unpaired',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: getSchemaPath(UnpairResponseDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  async unpairDevice(
    @CurrentUser() user: DecodedIdToken,
    @Param('id') id: string,
  ) {
    return this.devicesService.unpairDevice(user.uid, id);
  }
}
