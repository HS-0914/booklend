import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';

function mailerConfig(env: ConfigService): MailerOptions {
  const mailerconfig: MailerOptions = {
    transport: {
      host: env.get<string>('SMTP_HOST'),
      port: env.get<string>('SMTP_PORT'),
      auth: {
        user: env.get<string>('SMTP_EMAIL'),
        pass: env.get<string>('SMTP_PASS'),
      },
    },
    defaults: {
      from: `"booklend" <${env.get<string>('SMTP_EMAIL')}>`,
    },
    template: {
      dir: __dirname + '../templates',
      adapter: new EjsAdapter(),
      options: {
        strict: true,
      },
    },
  };
  return mailerconfig;
}

export { mailerConfig };
