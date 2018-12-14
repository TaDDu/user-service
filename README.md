<h1 align="center">user-service</h1>
<p>Rest api with google Sign in and jwt authorization token.</p>

## ROUTES

### /api/login/googleauth
.POST
 - body:
   - email
   - firstName
   - lastName
   - googleId
   - accessToken
- Description:
  Gets tokeninfo from google apis with accessToken and matches googleId to returned user.id.
  After does find or create to db users, generates jwt token and return that in response body

### /api/users/me
 .GET
  - Headers
    - authorization: Bearer {{jwt}}
  - Description: does signature verification to jwt token and then gets user from db using userId inside token, includes meta values to   response body.
  
### /api/users/me/meta
.GET
  - Headers
    - authorization: Bearer {{jwt}}
  - Description: Gets users meta values
.POST
  - Headers
    - authorization: Bearer {{jwt}}
  -body:
    - meta: { key:value }
    - key String(255)
    - value JSON
  - Description: Adds meta key value pair for users id
## /api/users/me/meta/:metaKey
.GET
  - Headers
    - authorization: Bearer {{jwt}}
  - Description: Get meta value using meta key
.DELETE
  - Headers
    - authorization: Bearer {{jwt}}
  - Description: Delete key/value pair from database
