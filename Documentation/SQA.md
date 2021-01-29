## Acronyms & Abbreviations
DB		Database <br>
JS		JavaScript <br>
UI		User Interface <br>
SQA		Software Quality Assurance <br>

# SQA Process

## SQA Records
Assertion-based testing will be handled through the Mocha node.js module, with the terminal output (containing the test results) saved to files as test logs. Our codebase is being tracked using git, with the remote repository hosted on GitHub. For quality assurance purposes, the logs from all tests that are run will be tracked in that same repository under the logs directory. Each type of test will have its own file and when a new test is run, the output will be appended to its respective file. This way everything will be available in the same location and the version history of the test logs will be saved.
For manual tests or reviews, any bugs that are found will be recorded in the GitHub repository as an issue with steps to reproduce the error by the reviewer. This will be the case for both types of walk-through, integration testing and verification testing.

## Software Documentation
Each individual working on the project will be responsible for adding comments to the functions, classes, and other code that they write according to the JS guidelines to function as internal documentation. This will be checked during the code walk-throughs done by other members of the team. For example, when reading a function, the reviewer will make sure that the comment describing its functionality and parameters match the actual functionality and parameters that they can see in the code.
For formal external documentation, each individual will be responsible for writing about the features that they worked on in the user manual. The manual will then be checked in the design walk-through, where reviewers outside of the team will give feedback on how accurately it matches their experience of the project to ensure accuracy. It will also be reviewed internally, each team member reading other members' entries, prior to submitting the final product at the end of the development and production phase.

# Formal Reviews

## Design Walk-throughs
A design walk-through will be conducted in the week of January 11th-15th. A link to the website will be sent to peers who are not part of the development team so that they can try out the product and test its functionality independently. Any problems that they find will be raised as issues in the GitHub repository so that they are recorded and their progress can be tracked.

## Code Walk-throughs
Code walk-throughs will be conducted internally by team members who are working on different parts of the project. This way the reviewer will not be familiar with the particular code they are reading, but also knowledgeable enough about the project at large to identify integration issues that may come up in the future. These code walk-throughs will occur twice throughout the process. The first walk-through is planned to be completed during the winter break, and the second for one week before submission (Jan 20-22). Any concerns will be raised as issues in the GitHub repository so that they are recorded and their progress can be tracked.

# Formal Testing

## Unit Tests
Through Mocha, unit tests will be designed to ensure that each unit of code is working effectively. Using assertions, the return values of each method will be tested using random user data and the state of data within classes will be tested using similar assertions. The records from these unit tests will be recorded in log files as described in the SQA Records section (page 4). Each team member will be individually responsible for designing and running tests for the classes and functions that they write, and this will be confirmed in the code walk-throughs.

## Integration Testing
Integration testing will also partially be done through unit testing. Tests will be written and then executed by Mocha, but the integration tests will be larger in scope and involve passing data between multiple classes or functions written by different team members. This way, if the assertions pass, then we can be confident that the units will integrate smoothly with one another, at least in the use cases that were tested. 
The integration of different components will also be tested manually by team members. When a new component is merged into the main project branch, testers will run the website and try out a variety of different use cases in attempts to break the project, looking for any new bugs that have arisen. An issue will then be raised on the GitHub repository to track these bugs, with instructions on how to reproduce the error so that other developers can do their own testing and help in the fixing process.
There will only be one product made for this project so performing tests to determine integration issues between different applications is not necessary.

## Validation testing
Validation testing will be conducted manually by team members as well as external participants in the design walk-through. Testers will use the product, attempting to find edge cases that may break the logic, UI, or DB interactions, and then record any bugs they find in an issue on the project’s GitHub repository. When raising an issue, testers will describe the process they used to produce the error so that it can be reproduced for bug fixing. Once testing is complete, the team members will review the issues that have been filed by testers, both internal and external, and then use the steps to reproduce the error and troubleshoot from there.
