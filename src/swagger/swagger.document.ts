import { DocumentBuilder } from '@nestjs/swagger';

export class SwaggerDocumentConfig {
  builder = new DocumentBuilder();

  initializeOptions() {
    return this.builder
      .setTitle('프리온보딩 인턴십 사전과제')
      .setDescription('프리온보딩 인턴십 사전과제 API 명세서')
      .setVersion('1.0.0')
      .build();
  }
}
