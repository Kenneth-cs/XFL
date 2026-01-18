import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ServiceTrackService } from './service-track.service';
import { CreateServiceTrackDto, UpdateServiceTrackDto } from './dto/create-service-track.dto';

@Controller('service-tracks')
@UseGuards(JwtAuthGuard)
export class ServiceTrackController {
  constructor(private readonly serviceTrackService: ServiceTrackService) {}

  @Post()
  create(@Body() createDto: CreateServiceTrackDto, @Request() req) {
    const user = req.user as any;
    if (!user.storeId) user.storeId = 'XFL001'; // Fallback
    return this.serviceTrackService.create(createDto, user);
  }

  @Get()
  findAll(@Query() query: any, @Request() req) {
    const user = req.user as any;
    if (!user.storeId) user.storeId = 'XFL001'; // Fallback
    return this.serviceTrackService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceTrackService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceTrackDto, @Request() req) {
    const user = req.user as any;
    return this.serviceTrackService.update(id, updateDto, user);
  }
}
