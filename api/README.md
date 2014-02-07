### User.login
If login and password is correct a temporary session token will be created. Use this token to authenticate other API calls. This method does not require a token for authentication. Store this token on client side.
```js
endpoint: '/user.login'
method: 'POST'
input: { email: 'jun.irok@gmail.com', password: 'omg' }
success: { success: 200, payload: [profile], token: [token] }
```

### User.logout
Authenicated call. Logs user out.
```js
endpoint: '/user.logout'
method: 'GET'
header: [token]
```

### User.get
Authenicated call. Fetches a user profile. If `id` is `'me'` or `undefined`, then it will return profile of logged in user.
Retrieve the details of one or many users. Use self to retrieve the authenticated user.
```js
endpoint: '/user.get'
method: 'POST'
header: [token]
input: { id: [objectId] }
success: { success: 200, payload: [profile] }
```

### User.create
Create new user account
```js
endpoint: 'user.create'
method: 'POST'
input: { email: [email], password: [password], displayName: [displayName] }
success: { success: 201, payload: [profile], token: [token] }
```

### User.save
Update an existing user. ID must be specified. Specifying only partial fields will only result in those fields being updated.
```js
endpoint: 'user.save'
method: 'POST'
input: { id: [objectId], ... }
```
