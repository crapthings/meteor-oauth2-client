import fs from 'fs'
import { isPlainObject } from 'lodash/fp'

const configPath = `${process.env.PWD}/private/oauth.json`
const isConfigExist = fs.existsSync(configPath)

if (!isConfigExist)
  throw new Meteor.Error(`Please check you have an "oauth2.json" file in private folder.`)

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

if (isPlainObject(config)) {
  config.service = MeteorOAuth2.serviceName
  config.loginStyle = 'redirect'

  const { service, clientId, secret, baseUrl, loginUrl } = config

  if (!clientId)
    throw new Meteor.Error(`missing clientId.`)

  if (!secret)
    throw new Meteor.Error(`missing secret.`)

  if (!baseUrl)
    throw new Meteor.Error(`missing baseUrl.`)

  if (!loginUrl)
    throw new Meteor.Error(`missing loginUrl.`)

  ServiceConfiguration.configurations.upsert({ service }, { $set: config })
} else {
  throw new Meteor.Error(`config error.`)
}
