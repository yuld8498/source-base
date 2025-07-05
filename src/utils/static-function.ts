import { phone } from 'phone'
import fs from 'fs'
import axios from 'axios'
import crypto, { randomInt } from 'crypto'

require('dotenv').config()

export class ShareFunction {
  private static readonly processENV: any = process.env

  public static env() {
    return this.processENV
  }

  public static getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }

  public static async getSha256(data: any) {
    try {
      const hash = crypto
        .createHmac('sha256', 'someThing')
        .update(JSON.stringify(data))
        .digest('base64')
      return hash
    } catch (e) {
      console.log('getSha256', e)
      return ''
    }
  }

  public static replaceMiddle(str: string, n: number = 0) {
    const rest = str.length - n
    return (
      str.slice(0, Math.ceil(rest / 2) + 1) + '*'.repeat(n) + str.slice(-Math.floor(rest / 2) + 1)
    )
  }

  public static async getPublicIP() {
    try {
      const response = await axios('https://checkip.amazonaws.com/')
      return response.data.trim()
    } catch (e) {
      console.log('getPublicIP catch', e.toString())
      return '0.0.0.0'
    }
  }

  public static async httpPOST(url: string, data: any, options?: any) {
    try {
      const rs = await axios.post(url, data, options || {})
      return rs
    } catch (e) {
      console.log('httpPOST catch', url, e.toString())
    }
  }

  public static async httpPOSTThrow(url: string, data: any, options?: any) {
    return await axios.post(url, data, options || {})
  }

  public static async httpGET(url: string, options?: any) {
    try {
      const rs = await axios.get(url, options || {})
      return rs
    } catch (e) {
      console.log('httpGET catch', url, e.toString())
    }
  }

  public static async httpGETThrow(url: string, options?: any) {
    return await axios.get(url, options || {})
  }

  public static async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  static otpCharset = '0123456789'

  // eslint-disable-next-line max-len
  static emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

  public static checkVariableHasValue(key: any) {
    return key !== undefined && key !== null && key !== ''
  }

  public static isConfigRedisDefaultEnv(): boolean {
    return ShareFunction.checkVariableHasValue(ShareFunction.env().REDIS_URL)
  }

  public static isConfigRedis(settingMap: Map<string, any>): boolean {
    return settingMap.get('redisURL')
  }

  public static isConfigWebsocketDefaultEnv(): boolean {
    return ShareFunction.checkVariableHasValue(ShareFunction.env().ENABLE_WEBSOCKET)
  }

  public static isConfigWebsocket(settingMap: Map<string, any>): boolean {
    return settingMap.get('redisURL') && settingMap.get('websocketEnable')
  }

  public static randomInt(min = 0, max = 10) {
    return randomInt(min, max)
  }

  public static isEmailValid(email?: string) {
    if (!email) return false

    if (email.length > 254) return false

    const valid = ShareFunction.emailRegex.test(email)
    if (!valid) return false

    // Further checking of some things regex can't handle
    const parts = email.split('@')
    if (parts[0].length > 64) return false

    const domainParts = parts[1].split('.')
    if (
      domainParts.some((part) => {
        return part.length > 63
      })
    )
      return false

    return true
  }

  public static isPhoneValid(phoneNumber?: string, country?: string | undefined) {
    if (!phoneNumber || !country) return false

    if (country.length > 10) return false
    if (phoneNumber.length > 30) return false

    const resultPhoneValidate = phone(`${phoneNumber}`, { country })
    if (!resultPhoneValidate) return false
    return resultPhoneValidate.isValid
  }

  public static checkVariableIsNotNullOrEmpty(variable: any) {
    return variable !== undefined && variable != null && variable !== ''
  }

  public static isConfigMongoDB(): boolean {
    const mongodbURL = ShareFunction.env().MONGODB_URL
    return ShareFunction.checkVariableIsNotNullOrEmpty(mongodbURL)
  }

  public static isConfigMailerSendgrid(settingMap?: Map<string, any>): boolean {
    if (!settingMap) {
      const mailerServer = ShareFunction.env().MAIL_SERVER
      const mailerSendgridApiKey = ShareFunction.env().MAILER_SENDGRID_API_KEY
      const mailerFromName = ShareFunction.env().MAILER_FROM_NAME
      const mailerFromEmail = ShareFunction.env().MAILER_FROM_EMAIL

      return (
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerServer) &&
        mailerServer === 'sendgrid' &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerSendgridApiKey) &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerFromName) &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerFromEmail)
      )
    }

    return (
      settingMap.get('emailServer') === 'sendgrid' &&
      settingMap.get('emailFromName') &&
      settingMap.get('emailFromAddress') &&
      settingMap.get('sendgridAPIKey')
    )
  }

  public static isConfigMailerGmail(settingMap?: Map<string, any>): boolean {
    if (!settingMap) {
      const mailerServer = ShareFunction.env().MAIL_SERVER
      const mailerGmailUsername = ShareFunction.env().MAILER_GMAIL_USERNAME
      const mailerGmailPassword = ShareFunction.env().MAILER_GMAIL_PASSWORD
      const mailerFromName = ShareFunction.env().MAILER_FROM_NAME
      const mailerFromEmail = ShareFunction.env().MAILER_FROM_EMAIL

      return (
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerServer) &&
        mailerServer === 'gmail' &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerGmailUsername) &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerGmailPassword) &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerFromName) &&
        ShareFunction.checkVariableIsNotNullOrEmpty(mailerFromEmail)
      )
    }
    return (
      settingMap.get('emailServer') === 'gmail' &&
      settingMap.get('emailFromName') &&
      settingMap.get('emailFromAddress') &&
      settingMap.get('gmailUsername') &&
      settingMap.get('gmailPassword')
    )
  }

  public static isConfigS3DefaultEnv(): boolean {
    return (
      ShareFunction.checkVariableHasValue(ShareFunction.env().STORAGE_SERVER) &&
      ShareFunction.env().STORAGE_SERVER === 's3' &&
      ShareFunction.checkVariableHasValue(ShareFunction.env().S3_ACCESS_KEY_ID) &&
      ShareFunction.checkVariableHasValue(ShareFunction.env().S3_ACCESS_KEY_SECRET) &&
      ShareFunction.checkVariableHasValue(ShareFunction.env().S3_REGION) &&
      ShareFunction.checkVariableHasValue(ShareFunction.env().S3_BUCKET_NAME)
    )
  }

  public static isConfigS3(settingMap: Map<string, any>): boolean {
    return (
      settingMap.get('storageServer') === 's3' &&
      settingMap.get('storageS3AccessKeyID') &&
      settingMap.get('storageS3AccessKeySecret') &&
      settingMap.get('storageS3Region') &&
      settingMap.get('storageS3BucketName')
    )
  }

  public static getConfigFCMJSONServer(jsonFilePath: string, settingMap?: Map<string, any>): any {
    // console.log('getConfigFCMJSONServer')
    // console.log('getConfigFCMJSONServer settingMap', settingMap?.get('fcmJSONServer'))
    let fcmJSONServerString = ''
    let serviceAccountObj = ''
    if (!settingMap || !settingMap.get('fcmJSONServer')) {
      if (ShareFunction.isFileExist(jsonFilePath)) {
        fcmJSONServerString = ShareFunction.readFileSync(jsonFilePath).toString()
      }
    } else {
      fcmJSONServerString = settingMap.get('fcmJSONServer').toString()
    }
    try {
      serviceAccountObj = JSON.parse(
        String.raw`${fcmJSONServerString
          .replace(/\\\\n/g, '\n')
          .replace(/\\\n/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\n/g, '\\n')}`,
      )
    } catch (e) {
      console.log('JSON.parse fcm json replace error, retry parse without replace')
      serviceAccountObj = JSON.parse(fcmJSONServerString)
    }
    return serviceAccountObj
  }

  public static isFileExist(filePath: string): boolean {
    return fs.existsSync(filePath)
  }

  public static readFileSync(filePath: string): any {
    return fs.readFileSync(filePath)
  }

  public static isEnableSwagger(): boolean {
    const enableSwagger = ShareFunction.env().IS_ENABLE_SWAGGER
    return ShareFunction.checkVariableIsNotNullOrEmpty(enableSwagger) && enableSwagger === 'true'
  }

  public static toSlug(str: string, char: string = '-'): string {
    if (!str) return ''
    let _str = str
    _str = _str.replace(/(\++)/g, char)
    _str = _str.replace(/(_+)/g, char)
    _str = _str.toLowerCase()
    _str = _str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
    _str = _str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
    _str = _str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
    _str = _str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
    _str = _str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
    _str = _str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
    _str = _str.replace(/(đ)/g, 'd')
    _str = _str.replace(/([^0-9a-z-\s])/g, '-')
    _str = _str.replace(/(\s+)/g, char)
    const regexRemvoeDuplicate = new RegExp(`${char}+`, 'g')
    _str = _str.replace(regexRemvoeDuplicate, char)
    return _str
  }

  public static convertLatinStringViettelPost(str: string) {
    if (!str) return ''
    let _str = str
    _str = _str.replace(/(\u00D0)/g, 'Đ')
    return _str
  }

  public static removeHTMLTag(str: string): string {
    if (str === null || str === '') return ''
    // eslint-disable-next-line no-param-reassign
    str = str.toString()
    return str.replace(/(<([^>]+)>)/gi, '')
  }

  public static isNull(variable: any): boolean {
    return variable === undefined || variable === null
  }

  public static isNullOrEmpty(variable: any): boolean {
    return variable === undefined || variable === null || variable === '' || variable.length === 0
  }

  public static refactorRouterByResource(paths: any): any[] {
    let routerByResource: any = {}
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const itemPathKey in paths) {
      const itemPath = paths[itemPathKey]
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const itemPathMethodKey in itemPath) {
        const itemPathMethod = itemPath[itemPathMethodKey]
        const endpointObject = {
          method: itemPathMethodKey.toUpperCase(),
          endpoint: itemPathKey,
          tags: itemPathMethod.tags,
        }
        routerByResource = ShareFunction.checkEndpointResourceExist(
          endpointObject,
          routerByResource,
        )
      }
    }

    const routerMapArray = []
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const routerMapKey in routerByResource) {
      routerMapArray.push(routerByResource[routerMapKey])
    }
    return routerMapArray
  }

  public static checkEndpointResourceExist(endpoint: any, routeMap: any): any {
    const _routeMap = routeMap
    let resourceName = 'Undefined'
    if (
      !ShareFunction.isNullOrEmpty(endpoint) &&
      !ShareFunction.isNullOrEmpty(endpoint.tags) &&
      !ShareFunction.isNullOrEmpty(endpoint.tags[0])
    ) {
      ;[resourceName] = endpoint.tags
    }

    if (ShareFunction.isNullOrEmpty(routeMap[resourceName])) {
      _routeMap[resourceName] = {
        name: resourceName,
        route: [
          {
            method: endpoint.method,
            endpoint: ShareFunction.convertTemplateToExpressEndpoint(endpoint.endpoint),
            auto: true,
          },
        ],
      }
    } else {
      _routeMap[resourceName].route.push({
        method: endpoint.method,
        endpoint: ShareFunction.convertTemplateToExpressEndpoint(endpoint.endpoint),
        auto: true,
      })
    }
    return _routeMap
  }

  public static convertTemplateToExpressEndpoint(endpoint: string): any {
    return endpoint.replace('{', ':').replace('}', '')
  }

  public static formatResourceName(resourceName: string): string {
    const _word1 = resourceName.split(' ')
    const word1 = _word1
      .map((item) => {
        return item[0].toUpperCase() + item.substring(1)
      })
      .join('-')
    const _word2 = word1.split('_')
    const word2 = _word2
      .map((item) => {
        return item[0].toUpperCase() + item.substring(1)
      })
      .join('-')
    return word2
  }

  public static upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  public static joinPathResourceUser(resourceName: any[]): string {
    const tempArray = resourceName.map((item) => item.path)
    const temp = tempArray.join('/')
    return temp
  }

  public static joinPathResourceMobile(resourceName: any[]): string {
    const tempArray = resourceName.map((item) => item.path)
    const temp = tempArray.join('/')
    return temp
  }

  public static joinPathResourceAdmin(resourceName: any[]): string {
    const tempArray = resourceName.map((item) => item.path)
    const temp = tempArray.join('/')
    return temp
  }

  public static joinPathResourceUi(resourceName: any[]): string {
    const tempArray = resourceName.map((item) => item.path)
    const temp = tempArray.join('/')
    return temp
  }

  public static toNumber(anyNumber: any, fault: number = 0): number {
    let result = fault
    try {
      result = Number(anyNumber)
    } catch (e) {
      console.log('Parse number error', e)
    }
    return result
  }

  public static toPascalCase(str: string) {
    if (!str) return ''
    return ` ${str}`.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
      return chr.toUpperCase()
    })
  }

  public static getVideoDuration(buffer: Buffer) {
    const header = Buffer.from('mvhd')

    const start = buffer.indexOf(header) + 17
    const timeScale = buffer.readUInt32BE(start)
    const duration = buffer.readUInt32BE(start + 4)

    const audioLength = Math.floor((duration / timeScale) * 1000) / 1000

    console.log(buffer, header, start, timeScale, duration, audioLength)
    return audioLength
  }

  public static randomCode(length: any, pre: string = '') {
    let result = ''
    for (let i = 0; i < length; i += 1) {
      result += ShareFunction.randomInt(0, 10)
    }
    return `${pre}${result}`
  }

  public static convertToCapitalizedCase(str: string) {
    const words = str.toLowerCase().split(' ')
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
    }
    return words.join(' ')
  }

  public static replaceSpecialCharacters(inputString: string): string {
    const specialCharactersRegex = /[!@%^&*(){}[\]:;<>,?~\\/]/g
    const resultString = inputString.replace(specialCharactersRegex, '')
    return resultString
  }

  public static generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomBytes = crypto.randomBytes(length)
    let code = ''

    for (let i = 0; i < length; i += 1) {
      const randomIndex = randomBytes[i] % chars.length
      code += chars[randomIndex]
    }

    return code
  }
}
export default new ShareFunction()
