create table if not exists Users (
    name text not null,
    email text,
    password text not null,
    primary key (email)
);

create table if not exists JobSeekers (
    email text primary key,
    foreign key(email) references Users(email)
);

create table if not exists Employers (
    email text primary key,
    foreign key(email) references Users(email)
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


create table if not exists Applications (
    id integer primary key autoincrement,
    cover_letter text,
    resume text not null
);

create table if not exists Applies (
    job_seeker_email text references JobSeekers(email),
    application_id integer references Applications(id),
    primary key(job_seeker_email, application_id)
);


create table if not exists Skills (
    skill text,
    job_seeker_email integer,
    foreign key (job_seeker_email) references JobSeekers(email),
    primary key (job_seeker_email, skill)
);


create table if not exists Matches (
    application_id integer references Applications(id),
    job_id integer references Jobs(id),
    primary key (application_id, job_id)
);