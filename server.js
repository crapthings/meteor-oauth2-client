OAuth.registerService(MeteorOAuth2.serviceName, 2, null, function(query) {
  const config = ServiceConfiguration.configurations.findOne({
    service: MeteorOAuth2.serviceName
  })

  const response = getTokenResponse(query, config)
  const accessToken = response.accessToken
  const identity = getIdentity(accessToken, config)

  const serviceData = {
    id: identity.id,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    accessToken,
    identity
  }

  return {
    options: {
      profile: {
        name: identity.email
      }
    },
    serviceData,
  }
})

const isJSON = function(str) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const getTokenResponse = function(query, config) {
  let responseContent
  try {
    responseContent = HTTP.post(
      config.baseUrl + '/oauth/token', {
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri(MeteorOAuth2.serviceName, config)
        }
      }
    ).content
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake\n\n" + err.message)
  }

  if (!isJSON(responseContent)) {
    throw new Error("Failed to complete OAuth handshake" + responseContent)
  }

  const parsedResponse = JSON.parse(responseContent)
  const accessToken = parsedResponse.access_token
  const expiresIn = parsedResponse.expires_in

  if (!accessToken) {
    throw new Error("Failed to complete OAuth handshake\n\
      did not receive an oauth token.\n" + responseContent)
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn
  }
}

const getIdentity = function(accessToken, config) {
  const fetchUrl = config.baseUrl + '/oauth/getIdentity'
  try {
    return HTTP.get(
      fetchUrl, {
        params: {
          access_token: accessToken
        }
      }
    ).data
  } catch (err) {
    throw new Error('Failed to fetch identity from ' + fetchUrl + '. ' + err.message)
  }
}

MeteorOAuth2.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret)
}
