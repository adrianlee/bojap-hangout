### User.login
If login and password is correct a temporary session token will be created. Use this token to authenticate other API calls. This method does not require a token for authentication. Store this token on client side.
```js
endpoint: '/user.login'
method: 'POST'
input: { email: 'jun.irok@gmail.com', password: 'omg' }
succcess: { success: 200, payload: [profile], token: [token] }
```

### User.logout
Authenicated call. Logs user out.
```js
endpoint: '/user.logout'
method: 'GET'
header: [token]
```
