create table if not exists imgurs(
    imgur text unique,
    link text,
    r_id integer,
    dhash text
);

create table if not exists users(
    email text unique,
    tstamp integer,
    name text,
    code text
);
