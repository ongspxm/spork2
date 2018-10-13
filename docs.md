# Spork 2

## User
Each user is tied to a specific email address. The login flow of the user is split into 2 stage and utilizes the email address to verify the code for logging in.

- createUser
- changeName

### Logging n
The login system for the user provides the user with a 6 character login code through their email to verify identity. In failing to authenticate, the code will be removed and a new code will have to be generated.

The first 3 chracters of the code will be delievered to the frontend on an login attempt. This helps the user identify which code to use for their login.

