# ReuseRepo

 Website: [http://www.ReuseRepo.com](https://reuserepo.azurewebsites.net)  
 Team: [Arsal Khan](https://github.com/ArsalKhan1), [Rayhaan Tanweer](https://github.com/RayhaanT), [Vijay Patnaik](https://github.com/VijayTheGr8)  
 Repo: [https://github.com/ArsalKhan1/ReuseRepo](https://github.com/ArsalKhan1/ReuseRepo)  
  
 We created a community website that helps people find and create ideas to reuse items that otherwise would go in the garbage or recycling.
 
   ![demo](images/DemoSearch.gif) 

Please find detailed descritpion of the functionalities and more demos in [user manual](Documentation/UserManual.md)

---

## How to run the code

### 1. Setup the Data Store
+ Setup a MongoDB data store locally on in cloud. We used CosmosDB in [Azure](https://portal.azure.com) with MongoDB APIs.

### 2. Start APIs
+ Navigate to [API-NodeJS/common/config/env.config.js](API-NodeJS/common/config/env.config.js) and point the DBName to your datastore. 
+ Execute following commands via command shell in [API-NodeJS](API-NodeJS): 
    - `npm install` - This will pull nodepackages via npm
    - `npm start`   - This will start the web server on port 3600

+ Optionally, you can execute use following commands:
    - `npm test`    - This will run the unit and integrated tests

### 3. Start Web Site
+ Navigate to [API-NodeJS/common/config/env.config.js](API-NodeJS/common/config/env.config.js) and point the DBName to your datastore 
+ Execute following commands via command shell in [API-NodeJS](API-NodeJS)  
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
+ `Front End`: The front-end tier or user interface layer uses Angular with Material Skin.
+ `Services`: The services or compute layer uses NodeJS and Express to host APIs.
+ `Data Store`: The data store or persistance layer uses CosmosDB with Mongo APIs.

---

## Citation and Credits
   + [Angular](https://angular.io/) and [Material Design](https://material.io/design) by Google
   + [Creating Secure APIs in NodeJS](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs) by [Marcos Henrique da Silva](https://github.com/makinhs)
   + [Detect multiple objects API](https://cloud.google.com/vision/docs/object-localizer) by Google
   + vector images from [unDraw](https://undraw.co/)
   + icons from [Font Awesome](https://fontawesome.com/)
   + fonts from [Google Fonts](https://fonts.google.com/specimen/Kumbh+Sans)
---

## Project Plan  
   + [Software Scope](Documentation/SoftwareScopeDocument.pdf)
   + [The WBS along with Project Calendar](Documentation/WBS.md) 
   + [The QA Plan](TBD)   
