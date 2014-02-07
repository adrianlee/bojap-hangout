### User.login
If user login success, api access token will be returned. Store this token on client side.
```js
input: { email: 'jun.irok@gmail.com', password: 'omg' }
succcess: { success: 200, payload: [profile], token: [token] }
```

### User.logout
Authenicated call. Logs user out.
```js
header: [token]
```
