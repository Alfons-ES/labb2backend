Detta repository innehåller kod för ett enklare REST API byggt med Express. APIet är byggt för att hantera olika arbetslivserfarenheter jag har haft. Grundläggande funktionalitet för CRUD (Create, Read, Update, Delete) är implementerad.

APIet använder sqlite3, Kör installations-skriptet setup.js och det kommer skapa databastabellen nedan:
workexperience (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    companyname TEXT NOT NULL,
    jobtitle TEXT NOT NULL,
    location TEXT NOT NULL,
    startdate DATE,
    enddate DATE,
    description TEXT
)

Man kan nå APIet på följande vis:
GET | /workexperience
GET | /workexperience/:id
POST | /workexperience
DELETE | /workexperience

Ett kurs-objekt returneras/skickas som JSON med följande struktur:

{
  "companyname": "KFUM Örebro",
  "jobtitle": "Föreståndare",
  "location": "Örebro",
  "startdate": "2023-01-01",
  "enddate": "2023-08-01",
  "description": "Som föreståndare bestod mina arbetsuppgifter..."
}