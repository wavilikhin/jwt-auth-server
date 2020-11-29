# Description:

# Setup:

# Requests:

* [Sign in](#signin)
* [Log in](#login)
* [Refresh](#refresh)

## Sign in  <a name ='signin'></a>
Route | Auth | Headers | Body |
|---|---|---|---|
| `/auth/signin` | Not required | [Required](#signinHeaders) | [Required](#signinBody) |

### Description: 
Sign in request to create new user

### Headers: <a name='signinHeaders'></a> 
```javascript
{ ContentType: "application/json" }
```

### Body: <a name='signinBody'></a> 

#### Requirements:
```javascript
required: true
content:
  application/json:
    schema:
      type: object
      properties:
        email:
          type: string
          required: true
        password:
          type: string
          required: true
        confirmedPassword:
          type: string
          required: true
```

#### Example :
```javascript
{
    email: "example@mail.ru",
    password: "123456",
    confirmedPassword: "123456"
}
```

### Responses:

:white_check_mark: **201**
#### Description:
  Provided cridentials are correct, new user successfuly created and added to DB. 
  User now can [login](#login) using provided email and password.


:no_entry_sign: **403**
#### Description:
  Provided cridentials aren't correct. Possible causes:
  1. Request body provides additional fields. (only "email", "password" and "confirmedPassord" are allowed)
  2. Request body field misprinted
  3. Email's field value is not a valid email address
  4. Passowrds doesn't match

---
## Log in <a name ='login'></a>
Route | Auth | Headers | Body |
|---|---|---|---|
| `/auth/login` | Not required | [Required](#loginHeaders) | [Required](#loginBody) |

### Description: 
Login request to authenticate user

### Headers: <a name='loginHeaders'></a> 
```javascript
{ ContentType: "application/json" }
```

### Body: <a name='loginBody'></a> 

#### Requirements:
```javascript
required: true
content:
  application/json:
    schema:
      type: object
      properties:
        email:
          type: string
          required: true
        password:
          type: string
          required: true
```

#### Example :
```javascript
{
    email: "example@mail.ru",
    password: "123456",
}
```

### Responses:

:white_check_mark: **200**
#### Description:
  Provided cridential are correct.
  Returns signed *access token* with user's id(uuid4) in DB,  wich expires after **15 min** (by default) and *refresh token*    wich should be used to update *access token*
  
##### Response Body:
```javascript
content:
  application/json:
    schema:
      type: object
      properties:
        token:
          type: string
        refreshToken:
          type: string
```


:no_entry_sign: **403**
#### Description:
  Provided cridentials aren't correct. 
  
  Possible causes:
  1. Request body provides additional fields. (only "email" and "password" are allowed)
  2. Request body field misprinted
  3. Email's field value is not a valid email address
  4. Email's field value is not a valid password


:no_entry_sign: **404**
#### Description:
  Provided cridentials are correct, but user doesn't exsists. 
  
  Possible causes:
  1. Email field's value misprinted
---
## Refresh <a name ='refresh'></a>
Route | Auth | Headers | Body |
|---|---|---|---|
| `/auth/refresh` | Not required | [Required](#refreshHeaders) | [Required](#refreshBody) |

### Description: 
Requset for updating expired *access token* using provided *refresh token*

### Headers: <a name='refreshHeaders'></a> 
```javascript
{ ContentType: "application/json" }
```

### Body: <a name='refreshBody'></a> 

#### Requirements:
```javascript
 requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          refreshToken:
            type: string
            required: true
```

#### Example :
```javascript
{
    refreshToken: "16e4bd1c-0b53-452e-b4ce-1d7df202a1d6",
}
```

### Responses:

:white_check_mark: **200**
#### Description:
  Provided refresh token is valid.
  Returns new *access token* and *refresh token* pair
  
##### Response Body:
```javascript
content:
  application/json:
    schema:
      type: object
      properties:
        token:
          type: string
        refreshToken:
          type: string
```


:no_entry_sign: **403**
#### Description:
  Provided cridentials aren't correct. 
  
  Possible causes:
  1. Request body provides additional fields. (only "refreshToken" is allowed)
  2. Request body field misprinted
  3. *refreshToken* filed's value is not a valid UUID


:no_entry_sign: **404**
#### Description:
  Provided cridentials are correct, but refresh token doesnt exists in DB. 
  
  Possible causes:
  1. *refreshToken* field's value misprinted
---
