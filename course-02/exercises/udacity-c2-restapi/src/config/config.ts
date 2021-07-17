export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgres",
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWSMEDIABUCKET,
    "okta_issuer": process.env.OKTA_ISSUER,
    "okta_client_id": process.env.OKTA_CLIENT_ID,
    "okta_client_secret": process.env.OKTA_CLIENT_SECRET,
    "okta_scope": process.env.OKTA_SCOPE
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }, 
  "jwt": {
    "secret": process.env.JWT_SECRET
  }
}
