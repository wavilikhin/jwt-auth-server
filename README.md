# Setup:


# Requests:

* [Sign in](#signin)

## Sign in <a name ='signin'></a>
Route | Auth | Headers | Body |
|---|---|---|---|
| `/auth/signin` | Not required | [Required](#signinHeaders) | [Required](#signinBody) |

### Description: 
Sign in request to create new user

### Headers: <a name='signinHeaders'></a> 
`{ ContentType: "application/json" }`

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

:white_check_mark: **200**
#### Description:
  Provided cridentials are correct, new user successfuly created and added to DB. 
  User now cal [login](#login) using provided email and password.

:no_entry_sign: **403**
#### Description:
  Provided cridentials aren't correct. Possible causes:
  1. Request body provides additional fieleds. (only "email", "password" and "confirmedPassord" are allowed)
  2. Request body field misprinted
  3. Email's field value is not a valid email address
  4. Passowrds doesn't match

---
