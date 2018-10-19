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
