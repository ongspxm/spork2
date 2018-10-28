create table if not exists rms(
    r_id integer primary key,
    u_email text,
    title text default 'The Room',
    vacancy integer default 1,
    cover text,
    text text
);

create table if not exists rmimgs(
    id text unique,
    url text,
    r_id integer,
    dhash text
);

create table if not exists users(
    email text unique,
    tstamp integer,
    name text,
    code text
);

create table if not exists tmpAcct(
    email text unique,
    code text
);

create table if not exists emails(
    id text unique,
    text text
);
insert into emails(id, text) values (
    'newacct_subject', 'New account signup @ Sanghaville'
);
insert into emails(id, text) values (
    'newacct_content', '<html><body><p>Thank you for signing up for Sanghaville.</p><p>Your sign up verification code is as follows:<br />{{ code }}</p></body></html>'
);
