import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EgressService } from './egress.service';
import { CreateEgressDto } from './dto/create-egress.dto';
// import { UpdateEgressDto } from './dto/update-egress.dto';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid/parse-uuid.pipe';
import { Auth } from 'src/auth/decorators';

@Controller('egress')
@Auth()
export class EgressController {
  constructor(private readonly egressService: EgressService) {}

  @Post()
  create(@Body() createEgressDto: CreateEgressDto) {
    return this.egressService.create(createEgressDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const validPage = !isNaN(pageNumber) ? pageNumber : 0;
    const validLimit = !isNaN(limitNumber) ? limitNumber : 10;
    return this.egressService.findAll(validPage, validLimit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUuidPipe) id: string,
  //   @Body() updateEgressDto: UpdateEgressDto,
  // ) {
  //   return this.egressService.update(id, updateEgressDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.egressService.remove(id);
  }
}
