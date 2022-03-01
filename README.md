# A Simple Pagination Example W/ Simple Login / Reg

I have included the modified sql file in this zip. You will need to create the database so as to be able to configure it in the server. You will then need to do the following.

## 1.

Navigate to both the server and client so as to be able to run the "yarn install" command.
```
//inside of the server folder
yarn install

//inside of the client folder
yarn install
```

## 2.

Create a .env file in the root server directory and provide the following variables, modifying them as necessary. The database here is chad to match the provided sql file. The proxy in the server's package.json will need to be adjusted as well if you change the port variable. The port variable defaults to 3000 on the server side, so you will have to run React on a different port if you do not provide variable.

```
HOST = "127.0.0.1"
USER = "mySQLDatabaseUser"
PASSWORD = "mySQLPassword"
DATABASE = "chad"
PORT = "3001"
SECRET = "supersecret"
```

## 3.

Once you have successfully installed, you can then proceed to start up both the server and the front-end.
```
//inside of the server folder
yarn start

//inside of the client folder
yarn start
```

The "yarn start" script located in the server's package.json will start up nodemon. You can also simply start the server using the classic "node index.js" command.

## 4.

Proceed to fiddle around on the pages.

### Notes

An inordinate amount of time was spent troubleshooting. Using json webtokens as a means to set up a session functionality seemed like the "React" way to go, but I opted instead to try to set up server-side persistent sessions. Upon further reading, it was not the best option to send cookies back and forth via cors. This then led me to sending a cookie in the response upon valid login / reg which would then be stored in local storage and monitored via client-side and/or removed upon logging out. The instructions listed only a few dropdown choices to sort via a user-specified category, with "ascending" order as a preset, but I went ahead and added another drop-down to toggle between ascending and descending order. I also added a number input to be able to toggle the limit on the sql query. The login was done according to specs, with a database username and password (checked with md5), and these were the same parameters used for the additional registration page. For demonstration purposes, any columns without defaults were given one via the query string and the user supplied password was stored after being hashed and salted. The salt was generated via the crypto.RandomBytes function which was purposely supplied a parameter that resulted in a string larger than the salts contained in the database to improve the "randomness" of the string. The string was then spliced to match the length of the other salts. Since the user forms only require the username and password, the only real validations are that the passwords match, the passwords exist, the username exists and the username is unique. No consideration was spent taking into account other validations, such as length, special character requirements, etc. The state is managed via Reacts own useState hooks, as this is a small app, and I opted to use javscript's built-in fetch api for the client requests. As for the sql queries, they are written out in the /server/routes files. Only simplistic styling was provided, with rudimentary css and the Component.module.css. Since the data set was so small, I only display the pagenumber of the current page, a button to skip to the last page (if applicable), a button to skip to the first page (if applicable), and next/previous buttons.