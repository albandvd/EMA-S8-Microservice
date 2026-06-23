import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSecureData(): { message: string; status: string } {
    return {
      message:
        'Félicitations, vous accédez à des données protégées par Keycloak !',
      status: 'Authenticated',
    };
  }
}
