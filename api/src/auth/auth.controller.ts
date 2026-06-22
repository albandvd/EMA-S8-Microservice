import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('discord/login')
  login(@Res() res: Response) {
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      this.configService.get<string>('DISCORD_CALLBACK_URL') ?? '',
    );
    const scope = encodeURIComponent('identify+email');

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    return res.redirect(discordAuthUrl);
  }

  // 2. Réception du callback et redirection finale vers le frontend
  @Get('discord/callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send("Code d'autorisation manquant.");
    }

    try {
      const accessToken = await this.authService.exchangeCodeForToken(code);
      const discordUser =
        await this.authService.fetchDiscordProfile(accessToken);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');

      const queryParams = new URLSearchParams({
        name: discordUser.username,
        email: discordUser.email || '',
        avatar: discordUser.avatarUrl || '',
        provider: 'Discord',
      }).toString();

      return res.redirect(`${frontendUrl}?${queryParams}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erreur d'authentification.";

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
    }
  }
}
