import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class IdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = +value;
    if (!this.isInteger(value) || !this.isPositive(value))
      throw new BadRequestException(`유효하지 않은 id`);
    return +value;
  }

  private isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  private isPositive(value: any): boolean {
    return value > 0;
  }
}
