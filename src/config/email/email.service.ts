import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import * as sgMail from '@sendgrid/mail'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private typeTransport: string | undefined

  private nodeMailerInstance: nodemailer.Transporter | undefined

  private SUBJECT = {
    OTP: {
      ENGLISH: 'You Otp',
      FRENCH: 'Vous OTP',
    },
    ACCOUNT_INFORMATION: {
      ENGLISH: 'You Account Information: ',
      FRENCH: 'Informations sur votre compte: ',
    },
    YOUR_PASSWORD: {
      ENGLISH: 'You Password ',
      FRENCH: 'Votre mot de passe ',
    },
    YOUR_NEW_PASSWORD: {
      ENGLISH: 'You new password',
      FRENCH: 'Votre nouveau mot de passe',
    },
  }

  constructor(private readonly httpService: HttpService) {
    sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

    this.init()
  }

  async init() {
    this.typeTransport = 'gmail'
    try {
      this.nodeMailerInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.MAILER_GMAIL_USERNAME}`,
          pass: `${process.env.MAILER_GMAIL_PASSWORD}`,
        },
      })
    } catch (e) {
      //
    }
  }
}
