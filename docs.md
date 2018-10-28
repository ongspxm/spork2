# Spork 2

## User
Each user is tied to a specific email address. The login flow of the user is split into 2 stage and utilizes the email address to verify the code for logging in.

### Exposed funcs
- `getUser(email)`: (utility) gets user object
- `changeName({email, name})`: (authenticated) update user's name
- `genAcct(email)`: (unauthenticated) creates holding acct for email, sends code out
- `chkAcct({email, code, name})`: (unathenticated) if code matches, create user

### Endpoints
- `GET genAcct?email=`: `{code}`
- `GET chkAcct?email=&code=&name`: `{}`
- `POST changeName?email=&name=`: `{}`

### Signing up
There will be a temporary holding database which will stores the email and the 6 character code. When `/genAcct` is called, the code is created and sent to the user via mailgun. On the frontend, the user is redirected to a page where they are required to insert their desired names, and the code mailed to them.

The frontend will redirect them to the api endpoint `/chkAcct` with the corresponding code, email and name. The endpoint not only creates the user account in the database, it also returns a token, just like in the login, which is then used to authenticate subsequent requests.

### Logging in
The login system for the user provides the user with a 6 character login code through their email to verify identity. In failing to authenticate, the code will be removed and a new code will have to be generated.

The first 3 chracters of the code will be delievered to the frontend on an login attempt. This helps the user identify which code to use for their login.

## Room
Each room is tied to a generated serial `r_id`, and associated to one account, determined by the the `u_email`. One room can have multiple images, supported by imgur.

Booking details are provided by `users`. Each room also have a `vacancy`. This serves as a rough gauge for the users to see how many person the place is able to accomodate.

Frontend list of rooms returns from `from` onwards (refering to `r_id` of room, exclusive of). If `from` not defined, first few rooms will be returned. Filtering currently done on frontend side. possible extension to do filtering and search on backend.

Frontend list can be used to return the rooms of a particular user as well. This is used on user display page.

Future work can be done to include a booking system to tag the period a room is booked.

### Images
Each room can be tied to multiple images and these can be added and deleted using the different endpoints.

There is the idea of cover image too, (`rms.cover`), This is the main display pic for display on the frontend. The rest of the images will be arranged randomly.

### Endpoints
- `GET /rooms?from=&email=`
- `POST /rooms/new?title=&text=&vacancy=`
- `POST /rooms/update?rid=&title=&text=&vacancy=&cover=`
- `POST /rooms/newimg?rid=`
- `POST /rooms/delimg?rid=&imgid=`
