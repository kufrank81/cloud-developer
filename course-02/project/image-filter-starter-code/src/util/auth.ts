const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_ISSUER,
  clientId: process.env.OKTA_CLIENT_ID
})

module.exports = async (req: { headers: { authorization: any } }, res: any, next: (arg0: string) => void) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('You must send an Authorization header');

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

    const { claims } = await oktaJwtVerifier.verifyAccessToken(token);
    if (!claims.scp.includes(process.env.OKTA_SCOPE)) {
      throw new Error('Could not verify the proper scope');
    }
    next("");
  } catch (error) {
    next(error.message);
  }
}