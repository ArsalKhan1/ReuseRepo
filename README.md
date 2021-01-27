# ReuseRepo

 Website: [http://www.ReuseRepo.com](https://reuserepo.azurewebsites.net)  
 Team: [Arsal Khan](https://github.com/ArsalKhan1), [Rayhaan Tanweer](https://github.com/RayhaanT), [Vijay Patnaik](https://github.com/VijayTheGr8)  
 Repo: [https://github.com/ArsalKhan1/ReuseRepo](https://github.com/ArsalKhan1/ReuseRepo)  
  
 We created a community website that helps people find ideas to reuse items that otherwise would go in the garbage or recycling.
 
   ![demo](images/demo.gif) 

---

## How to run the code

### 1. Setup the Data Store
+ Setup a MongoDB data store locally on in cloud. We used CosmosDB in [Azure](https://portal.azure.com) with MongoDB APIs.

### 2. Start APIs
+ Navigate to [/API-NodeJS/common/config/eng.config.js](/API-NodeJS/common/config/eng.config.js) and point the DBName to your datastore. 
+ Execute following commands via command shell in [/API-NodeJS](/API-NodeJS]): 
    - `npm install` - This will pull nodepackages via npm
    - `npm start`   - This will start the web server on port 3600

+ Optionally, you can execute use following commands:
    - `npm test`    - This will run the unit and integrated tests

### 3. Start Web Site
+ Navigate to [/API-NodeJS/common/config/eng.config.js](/API-NodeJS/common/config/eng.config.js) and point the DBName to your datastore 
+ Execute following commands via command shell in [/API-NodeJS](/API-NodeJS])  
    - `npm install` - This will pull nodepackages via npm
    - `ng serve`    - This will start the website on port 4200

+ Optionally, you can use following commands:
    - `npm test`    - This will run the unit and integrated tests
    - `ng build --prod` - This will build the project for prod deployment. The build artifacts will be stored in the [dist](/UI-Angular/dist) folder
    - `ng test`     - This will execute the unit tests via [Karma](https://karma-runner.github.io)
    - `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/)

---

## Design
The application uses 3 tiers architecture
+ `Font End`: The front-end tier or user insterface layer uses Angular with Material Skin.
+ `Services`: The services or compute layer uses NodeJS and Express to host APIs.
+ `Data Store`: The data store or persistance layer uses CosmosDB with Mongo APIs.

---

## Citation and Crecitds
   + [Angular](https://angular.io/) and [Material Design](https://material.io/design) by Google
   + [Creating Secure APIs in NodeJS](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs) by [Marcos Henrique da Silva](https://github.com/makinhs)

---

## Project Plan  
   + [The project specs](TBD)
   + [The WBS along with Project Calendar](/Documentation/ProjectPlan.md) 
   + [The QA Plan](TBD)
  
 
# Progress Log -- ]to be deleted after pieces are moved to documentation folder.
### 1. UI (Angular + Material Design Skin)
   The application uses an out of the box Angular and Material Design skin. We used angular cli ng commands to spawn the project. See details in [/UI-Angular/README.md](UI-Angular/README.md)
   
   [VP] Added thumbnails for articles that have images
   ![](images/thumbnail.png) 
   
   [VP] Upgraded Home Page with dynamic navbar (now responsive to resizing)
   ![](images/homepage.gif)
   
   [VP] Added icons to the navbar
   ![](images/homepage2.0.png)
   
   [VP] Services cards to navigate (responsive to resizing)
   ![](images/cards.gif)
   
   [VP] Added footers (responsive to resizing)
   ![](images/footers.gif)
   
   [VP] Removed social media section and media icons, moved copyrights to the bottom
   ![](images/footer2.0.png)
   
   [VP] Changed the homepage image
   ![](images/homepage3.0.png)

### 2. API (NodeJS and ExpressJS)
   Created a shell API using NodeJS by following this [example](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs)  
   
    Use following commands to run it  
        - npm install  
        - npm start  
    This will start the API server on port 3600. 
 
### 3. Datastore (Cosmos DB with Mongos API)
   Created an out of the box MongoDB on azure using portal.azure.com

## Hosting
   [AK] Signed up for azure free hosting acount with $200 credit.  
   [AK] Built angular for deployment  
        ng build --prod  
        Deployed to [https://reuserepo.azurewebsites.net/#/article/search](https://reuserepo.azurewebsites.net/#/article/search)  
        Hosted the site following this [post](https://www.c-sharpcorner.com/article/easily-deploy-angular-app-to-azure-from-visual-studio-code/)         

        Hosted latest version with search and list functionality 
   ![](images/6-reuserepo-azurewebsite.png) 
   
   
# Testing
   [RT] Set up Mocha and Chai to perform unit test on the node.js API.  
   [RT] Wrote unit tests and integration tests for the user and authentication features of the API.  
        Run `npm test` in /API-NodeJS to run the tests and get output in the terminal.  
   ![](images/testing.PNG)
   

   
## Citation and Crecitds
   [VP] 
   - vector images from [unDraw](https://undraw.co/)
   - icons from [Font Awesome](https://fontawesome.com/)
   - fonts from [Google Fonts](https://fonts.google.com/specimen/Kumbh+Sans)
