create table if not exists Users (
    email text,
    name text not null,
    password text not null,
    token text,
    location text,
    primary key (email)
);

create table if not exists JobSeekers (
    email text primary key,
    foreign key(email) references Users(email)
);

create table if not exists Employers (
    email text primary key,
    company text,
    foreign key(email) references Users(email)
);


create table if not exists Jobs (
    id integer primary key autoincrement,
    job_title text not null,
    location text not null,
    description text not null,
    employment_type text not null check (employment_type in ('casual', 'full-time', 'part-time')),
    closing_date text not null
);

create table if not exists Posts (
    employer_email text references Employers(email),
    job_id integer references Jobs(id),
    primary key(employer_email, job_id)
);


create table if not exists Skills (
    id integer primary key autoincrement,
    skill1 text,
    skill2 text,
    skill3 text,
    job_seeker_email integer references JobSeekers(email),
    job_id integer references Jobs(id),
    primary key (id)
);


create table if not exists Matches (
    application_id integer references Applications(id),
    job_id integer references Jobs(id),
    primary key (application_id, job_id)
);


create table if not exists Offers (
    id integer primary key autoincrement,
    message text not null,
    kind text not null check (kind in ('offer', 'interview'))
);

create table if not exists Sends (
    employer_email text references Employers(email),
    offer_id integer references Offers(id),
    primary key(employer_email, offer_id)
);