import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import type { Env } from 'src/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Env>) {
        const secret = config.get('JWT_SECRET', { infer: true })

        return {
          secret,
        }
      },
    }),
  ],
})
export class AuthModule {}
