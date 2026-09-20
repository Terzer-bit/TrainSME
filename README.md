# TrainSME

### Table of Contents
----
1. [Project Overview](#projectoverview)
2. [Getting Started](#gettingstarted)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
3. [Contact](#contact)

### <a name="projectoverview"></a>Project Overview
----
This project presents a solution to reduce and prevent cyberattack cases on Small and Medium-Sized Enterprises or SMEs. It uses a phishing training approach, adding a password management feature.

### <a name="gettingstarted"></a>Getting Started
---

#### <a name="prerequisites"></a>Prerequisites

All users should have Docker installed.
In case you don't have it, it can be downloaded from [here](https://www.docker.com/products/docker-desktop/)

#### <a name="installation"></a>Installation and Execution

1.  Clone the repository and navigate into the folder:  
	```
	git clone https://github.com/Terzer-bit/TrainSME.git
 	cd TrainSME 
	```  
2. Copy `.env.example` to `.env` (`cp .env.example .env`) and fill in your configuration variables.
3. Execute docker desktop
4. Run the following command to run the project for the first time:
```
	docker-compose up -d --build
```

*Note: In case the project was already run with the previous command, there is no need for the parameter --build anymore*

5.  To access the running project, navigate to the following address on your navigator:  
	``` 
	http://localhost
	```  
6. Run the following command to stop the service:
```
	docker-compose down
```

*Note: Use parameter -v to delete all containers*

### <a name="contact"></a>Contact
---
For any details contact the owner of the project on:
- Email: garciavinapablo@gmail.com
- LinkedIn: [pablo-garcía-viña](https://www.linkedin.com/in/pablo-garc%C3%ADa-vi%C3%B1a/)
