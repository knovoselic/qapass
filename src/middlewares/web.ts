import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';
import csurf from 'csurf';

let FileStore = require('session-file-store')(expressSession);

let secret = 'secret';

if(process.env.APP_SECRET) {
    secret = process.env.APP_SECRET;
}

const session = expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    },
    store: new FileStore,
});

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser((user: any, done) => {
    done(null, user);
});

const csrf = csurf({ cookie: true });

export default [
    cookieParser(),
    session,
    passport.initialize(),
    passport.session(),
    flash(),
    csrf
];
