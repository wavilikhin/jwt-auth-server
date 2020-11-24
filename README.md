# JWT Auth Server

Simple NodeJs server for user authentication and authorization.

## Requsets:

* [Sign in](#signin)

### Sign in user
Method | Path | Auth | Body |
|---|---|---|---|---|
| POST | /auth/signin | not required | {email: "<valid_email>", password: "123456", confirmedPassword: "123456"} |

