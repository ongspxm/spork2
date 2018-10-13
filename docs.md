# Spork 2

## User
Each user is tied to a specific email address. The login flow of the user is split into 2 stage and utilizes the email address to verify the code for logging in.

- createUser
- changeName

### Logging in
The login system for the user provides the user with a 6 character login code through their email to verify identity. In failing to authenticate, the code will be removed and a new code will have to be generated.

The first 3 chracters of the code will be delievered to the frontend on an login attempt. This helps the user identify which code to use for their login.

## Room
Each room is tied to a generated serial `r_id`, and associated to one account, determined by the the `u_email`. One room can have multiple images, supported by imgur.

Booking details are provided by `users`. Each room also have a `vacancy`. This serves as a rough gauge for the users to see how many person the place is able to accomodate.

Future work can be done to include a booking system to tag the period a room is booked.

### Endpoints
- `POST /rooms/new?title=`
- `POST /rooms/update?rid=&title=`
- `POST /rooms/newimg?rid=`
- `POST /rooms/delimg?rid=&imgid=`
