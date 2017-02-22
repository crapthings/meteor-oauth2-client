Package.describe({
  name: 'crapthings:meteor-oauth2-client',
  summary: 'oauth2 client based on https://github.com/prime-8-consulting/meteor-oauth2',
  version: '0.0.1',
  git: 'https://github.com/crapthings/meteor-oauth2-client',
  documentation: 'README.md'
})

Npm.depends({
  'lodash': '4.17.4',
})

Package.onUse(function (api) {
  api.use('ecmascript@0.6.3')

  api.use('oauth2@1.1.11', ['client', 'server'])
  api.use('oauth@1.1.13', ['client', 'server'])
  api.use('accounts-base@1.2.14', ['client', 'server'])
  api.use('accounts-oauth@1.1.15', ['client', 'server'])
  api.use('http@1.2.11', ['client', 'server'])
  api.use('service-configuration@1.0.11', ['client', 'server'])
  api.use(['random@1.0.10'], 'client')

  api.addFiles('common.js', ['client', 'server'])
  api.addFiles('check.js', 'server')
  api.addFiles('server.js', 'server')
  api.addFiles('client.js', 'client')

  api.export('MeteorOAuth2')
})
