import { union } from 'lodash/fp'

MeteorOAuth2.requestCredential = function(options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options
    options = {}
  }

  const config = ServiceConfiguration.configurations.findOne({
    service: MeteorOAuth2.serviceName
  })

  const credentialToken = Random.secret()

  const requiredScope = ['email']

  let scope = []
  if (options && options.scope)
    scope = options.scope || []

  scope = union(scope, requiredScope)

  const loginStyle = OAuth._loginStyle(MeteorOAuth2.serviceName, config, options)

  const loginUrl = config.loginUrl +
    '?response_type=code' +
    '&client_id=' + config.clientId +
    '&redirect_uri=' + OAuth._redirectUri(MeteorOAuth2.serviceName, config) +
    '&scope=' + scope.join(' ') +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken)

  OAuth.launchLogin({
    loginService: MeteorOAuth2.serviceName,
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
  })
}
