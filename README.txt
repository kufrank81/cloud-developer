Elastic Beanstalk URL - rest api: http://udagram-frank-dev-dev.us-east-1.elasticbeanstalk.com

Elastic Beanstalk URL - filter image: http://image-filter-frank-dev-dev.us-east-1.elasticbeanstalk.com

Notes - I added Okta to both of the apis so that you must include a bearer token to the filter image url.  a postman collection is included with this file in the zip folder.
	I didn't want to rewrite the whole thing, but wanted it see how it was to add okta to node.  First send the request to /api/v0/users/auth/filterapitoken,
	this will return a JWT so that you can send the request to the filtered image endpoint.  In the Postman collection send the JWT token you received from the api/v0
	endpoint as the bearer token value.  This should get you the filtered image.  This is also why in the screenshot the image endpoint is in severe status, because the token is required 
	for all endpoints.