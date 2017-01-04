# AlexaCanvasSkill

This is a really powerful [Alexa skill](https://developer.amazon.com/alexa-skills-kit), and it directly has purpose in student’s lives. Personally, I know I am checking my gradebook every few hours on my phone and this skill allows me to do that with my voice through Alexa. Students are able to connect their [Canvas](https://www.canvaslms.com/) gradebook accounts and access all their information through this Alexa skill. 

### Quickly, what does it really do?
This program allows users to use Amazon Alexa to fetch information about their school grades and calendar. It does this by first connecting them to their Canvas account via an access token. They are able to do this initial setup at the website [CanvasSkill.tk](https://canvasskill.tk). Once they have added this access token, their user and course data is fetched from Canvas’ public API. This data is then shown to the users where they are encouraged to define custom nicknames for their courses. These individualized nicknames allow Alexa to match courses based on the user’s own personal vocabulary. This in turn, allows users to speak naturally to Alexa to gather information from Canvas. 

### Technical Info
This project is split into two major components: the actual skill and then the website. The skill is hosted on AWS Lambda, the website is hosted on an AWS t2.micro instance, and I opted to use an AWS DynamoDB database to store all my users’ data. I chose DynamoDB mainly because it was a NoSQL database and I was familiar with JavaScript, it also easily integrated with the rest of the services. 

The website itself is a node server serving a mixture of [ejs]( https://github.com/mde/ejs) and [Backbone]( https://github.com/jashkenas/backbone) components (much like Angular) and providing a graphical user interface to the token store and the custom nicknames stored in the database. All endpoints are secured over SSL provided by for free by [letsencrypt](https://letsencrypt.org/) and authentication is all supported by OAuth2.0.<sup>[1](#notes)</sup>&nbsp; The domain name is provided free from [dot.tk](http://www.dot.tk/en/index.html).

Instructure Canvas has a fabulous API located [here](https://canvas.instructure.com/doc/api/index.html), the API has many examples and support. 

## Feedback received from Amazon [here](/CHANGELOG.md)

## Skill 
The actual skill was made using [Alexia](https://github.com/Accenture/alexia), it provided a good framework to begin developing the skill. The way the skill works is when a user makes a request, it checks to see if they have linked the skill in Alexa app; if they have, it looks them up in the [Database](#database). From the database a `CanvasUser` is returned, an object containing all the methods to get `Courses` and `Assignments`. 

**Alexa, ask grades:**
```
How are my grades?  

What is my grade in ______ class?  
What is my ______ grade?  
About ______.

What are my last __ assignments in ______ class?  

GetUpcomingEventsIntent what is upcoming
```

The skill has four main intents:
* getHowWellIntent
  * Returns relatively how well the student is doing based on the grades. It tallies up the letter grades and then based on the presence of a letter grade returns an appropriate adjective along with the actual letter grades and count. 
  ```   
  You are doing good with 5a's, 2b's and 1c   
  ```
* getLastAssignmentsIntent
  * Returns the last `x` assignments graded from a given course. 
    ```
    Your last three graded assignments are:
      Final Task 4 is 97.3 percent.
      Final Exam is 90.1 percent.
      Discussion Posting 12 is 100 percent.
    ```           
* getGradeIntent
  * Returns the current grade for a given course. 
    ```   
    Your current grade in Physics is 96.4 percent.   
    ```
* getUpcomingEventsIntent
  * Returns a list of upcoming assignments and events.
    ```
    You have 2 upcoming events:  
      Math discussion posting
      English meets in library today  
    ```

## Website
The purpose of the website is to provide an easy way for users to get started. This is where the users’ Canvas access token is added. This token is what allows the skill to access the Canvas API. After initial setup the primary purpose of the website is to allow the user to add and modify the custom nicknames associated with a course. 

The user logs into this website though the [Login with Amazon](https://developer.amazon.com/lwa/sp/overview.html) service and is taken to a dashboard page where they can add an access token from their Canvas Account. This is checked to see if its valid and will not let the user pass until a valid token is added.

!["Logging in"](/writeup/dologin.gif?raw=true "logging in")

Once the token is added, the dashboard refreshes showing the list of enrolled courses and drop downs. In the drop downs, the user can create custom nicknames to associate with the appropriate course. This course list and elements as well as the canvas login view were created with [Backbone]( https://github.com/jashkenas/backbone). 

This view is rather feature rich, users can click the plus button to add a new nick name, trash to remove one, double click to edit, and hit tab to edit the next or add a new nickname. 

!["Checking dashboard"](/writeup/afterlogin.gif?raw=true "Checking dashboard ")

> **Note:** 
> When adding/editing nicknames be sure to hit refresh button to save changes. 

## Canvas User
This is the main data object. This object contains all the `Courses` and `Assignments` for a user and their helper functions. This object is where all the canvas data is held. There are several functions but most notable the `User.prototype.findCourse` function.

#### findcourse()
This function is the heart of the Skill, it is what matches a user's query for a course to an actual `Course` object. The raw `Course` obtained from the Canvas API, returns the course code and a name. Sadly this name is usually just the course code, ie. "MAC2313-16Fall 0301". This does not match well to anything someone would say. There is also a nickname array that the Canvas API keeps, but it is limited to one nickname per course. This is where the database and webserver come in. In the database, there is an array of custom nicknames the user is allowed to associate for a given course. This allows them to ask about "math", "calc", "calc 3", and "calculus" and bring them to "MAC2313-16Fall 0301". It does this matching though a [fuzzy](https://github.com/krisk/fuse) search algorithm, this way the user doesn’t have to be exact in their queries. 

In the example above, "calc", "calc 3", and "calculus" are really redundant, the fuzzy search would have matched with just calculus.

## Database
The database is a simple one table DynamoDB database. In the table it puts users based on their AmazonID and stores information off of that.
!["Db list"](/writeup/dbStore.png?raw=true "Db")

As you can see here, the custom nicknames are stored in the nickname object. They keys of this object are the unique ids of the courses, and the actual nicknames are a JSON array of nicknames. 


## Running
To start on server
```sh
$ npm install
$ pm2 start "server ejs serverside.js"
```
To start locally
```sh
$ npm install
$ node "server ejs.js"
```

## Notes
> - This is still a work in progress, much of a proof of concept app
> - It was written in 19 days, solely by me
> - Because of that, there will be errors, most of which could be handled with promises. TODO: Promises.
> - Skill is currently in beta, [Beta Canvas Skill](http://alexa.amazon.com/spa/index.html#skills/beta/amzn1.ask.skill.7d33a188-6da6-4d58-aa7b-840d678adc10)
> - Support for OAuth2.0 not currently being utilized beyond access tokens. Canvas is no longer offering root level client IDs and client secrets. Will be implemented in the future. 
