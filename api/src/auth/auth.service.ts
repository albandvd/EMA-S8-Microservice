import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DiscordUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async exchangeCodeForToken(code: string): Promise<string> {
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'DISCORD_CLIENT_SECRET',
    );
    const redirectUri = this.configService.get<string>('DISCORD_CALLBACK_URL');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new HttpException(
        'Discord OAuth configuration is missing.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new HttpException(
        `Échec de l'échange de jetons avec Discord: ${
          tokenResponse.statusText
        }`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };
    return tokenData.access_token;
  }

  async fetchDiscordProfile(accessToken: string): Promise<DiscordUser> {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new HttpException(
        `Échec de la récupération du profil Discord: ${
          userResponse.statusText
        }`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const userData = (await userResponse.json()) as {
      id: string;
      username: string;
      email?: string;
      avatar?: string;
    };

    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : undefined;

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      avatarUrl: avatarUrl,
      accessToken: accessToken,
    };
  }
}
