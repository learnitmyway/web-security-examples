# Web security examples

## Run locally

- `npm install`

## Exercises

- User details are in plaintext
- If the user is undefined delete the session cookie manually

### 1

- `npx nodemon 1-unsigned-cookie.js`
- Change value of `username` cookie

This can be mitigated by signing the cookie (see `2-signed-cookie.js`)

### 2

- `npx nodemon 2-signed-cookie.js`

Changing the password has no effect on a compromised cookie.
For this reason it is better to use a (long) session id (see `3-sessionId-cookie.js`)

### 3

- `npx nodemon 3-sessionId-cookie.js`

The cookie can be accessed via js. For example: `document.cookie` lists cookies.
Setting `httpOnly: true` prevents this (see `4-httpOnly-cookie.js`)

### 4

- `npx nodemon 4-httpOnly-cookie.js`

There is no vulnerability to demonstrate here.

### 5

- Start `npx nodemon 5-csrf-vulnerable.js` and go to <http://localhost:3005/>
- Start `npx nodemon 5-csrf-trick.js` and go to <http://localhost:3005/>

In `5-csrf-trick` an iframe is used to transfer money to user 'att'.

This is mitigated by setting the SameSite attribute (see `5s.js`):

- Add to `/etc/hosts`: `127.0.0.1 trick.com`
- Start `npx nodemon 5s.js` and go to <http://localhost:3005/>
- Start `npx nodemon 5s-trick.js` and go to <http://trick.com:5005/>

Now the cookie now has a SameSite attribute set to 'lax'.
If it were set to 'strict' I believe it would strip the cookie even if you already had the same origin open in another tab (eg. redirecting to FB when you are already logged in)

### 6

Adds the secure attribute to the `sessionId` cookie.

- The self-signed cert was generated using `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -new -sha256 -keyout certs/key.pem -out certs/cert.pem`
- Start `npx nodemon 6.js` and go to <https://localhost> (does not work in Chrome)

This is reverted in `6-revert.js` to make it easier to use on localhost.
