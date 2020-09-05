import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';
import csurf from 'csurf';
import cookieSession from 'cookie-session';

let secret = 'secret';

if(process.env.APP_SECRET) {
    secret = process.env.APP_SECRET;
}

const session = cookieSession({
    name: 'qapass_session',
    keys: [secret],
    maxAge: 3153600000000
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
