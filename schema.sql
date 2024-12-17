CREATE DATABASE TPCYCCE;

USE TPCYCCE;

CREATE TABLE coordinator (
    cID INT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE SubAdmin (
    sID INT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE Student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Branch VARCHAR(255),
    Section CHAR(1),
    `College ID` INT Not null UNIQUE,
    `Name of Student` VARCHAR(255),
    Gender ENUM('Male', 'Female', 'Other'),
    DoB VARCHAR(255),
    `SSC YOP` YEAR,
    `SSC %age` DECIMAL(5,2),
    `HSC YoP` YEAR,
    `HSSC %age` DECIMAL(5,2),
    `DIPLOMA YOP` YEAR,
    `DIPLOMA %` DECIMAL(5,2),
    SGPA1 DECIMAL(4,2),
    SGPA2 DECIMAL(4,2),
    SGPA3 DECIMAL(4,2),
    SGPA4 DECIMAL(4,2),
    SGPA5 DECIMAL(4,2),
    SGPA6 DECIMAL(4,2),
    SGPA7 DECIMAL(4,2),
    `Avg. SGPA` DECIMAL(5,2),
    mobile VARCHAR(15),
    `Personal Email Address` VARCHAR(255),
    `College MailID` VARCHAR(255),
     password varchar(100),
     FCMToken VARCHAR(1000),
     `Your career choice` Varchar(100),
);



CREATE TABLE Campus (
    CampusID INT PRIMARY KEY AUTO_INCREMENT,
    CampusName VARCHAR(255) NOT NULL,
    Message VARCHAR(10000),
    package VARCHAR(255),
    Date DATE,
    Location VARCHAR(255),
    status enum("Pending","Complated"),
    eligibleStudents INT,
    placedStudents INT
);


CREATE TABLE Placement(
    placementID INT Auto_Increment PRIMARY key,
    CampusID INT,
    StudentID INT,
    Foreign key (CampusID) REFERENCES Campus(CampusID),
    Foreign Key (StudentID) REFERENCES Student(id)
)


CREATE TABLE Round (
    RoundID INT PRIMARY KEY AUTO_INCREMENT,
    CampusID INT NOT NULL,
    RoundName VARCHAR(255) NOT NULL,
    RoundDate DATE NOT NULL,
    FOREIGN KEY (CampusID) REFERENCES Campus(CampusID)
);


CREATE TABLE Attendances (
    AttendanceID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    RoundID INT NOT NULL,
    AttendanceStatus ENUM('None','Present', 'Absent') NOT NULL,
    AttendanceDate DATE,
    FOREIGN KEY (StudentID) REFERENCES Student(id),
    FOREIGN KEY (RoundID) REFERENCES Round(RoundID),
    UNIQUE (StudentID, RoundID) 
);


CREATE TABLE Skills(
    SkillID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    Skill VARCHAR(100),
    Level INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(id)
);

CREATE TABLE CodePYQ (
    CodeID INT PRIMARY KEY AUTO_INCREMENT,
    Question VARCHAR(1000) NOT NULL,
    SampleInput VARCHAR(1000),
    SampleOutput VARCHAR(1000),
    Explanation VARCHAR(1000),
    Code TEXT,
    CampusID INT,
    FOREIGN KEY (CampusID) REFERENCES Campus(CampusID)
);


CREATE TABLE AptiLRPYQ(
    AptiLRID INT PRIMARY KEY AUTO_INCREMENT,
    Question VARCHAR(1000) NOT NULL,
    Option1 VARCHAR(1000),
    Option2 VARCHAR(1000),
    Option3 VARCHAR(1000),
    Option4 VARCHAR(1000),
    Explanation VARCHAR(1000),
    Answer VARCHAR(1000),
    CampusID INT,
    FOREIGN KEY (CampusID) REFERENCES Campus(CampusID)
);

CREATE TABLE InterviewQuestion(
    CodeID INT PRIMARY KEY AUTO_INCREMENT,
    Question VARCHAR(1000) NOT NULL,
    Answer VARCHAR(1000),
    CampusID INT,
    FOREIGN KEY (CampusID) REFERENCES Campus(CampusID)
);


CREATE TABLE Seen(
    SeenID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    PYQ ENUM('Coding','AptiLR','Interview') NOT NULL,
    CampusID INT NOT NULL,
    FOREIGN key (StudentID) REFERENCES Student(id),
    FOREIGN key (CampusID) REFERENCES Campus(CampusID)
);


CREATE TABLE Notification(
    nID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100),
    ShortLine VARCHAR(200)

);


CREATE TABLE NotificationDetails(
    ndID INT PRIMARY KEY AUTO_INCREMENT,
    nID INT,
    message TEXT,
    FOREIGN KEY (nID) REFERENCES Notification(nID)
);


CREATE TABLE Employer(
    employerID INT PRIMARY KEY AUTO_INCREMENT,
    employerName VARCHAR(100),
    employerEmail VARCHAR(100),
    employerPassword VARCHAR(100),
    status ENUM("Pending","Approved")
);

CREATE TABLE EmployerRequest(
    employerRequestID INT PRIMARY KEY AUTO_INCREMENT,
    skill TEXT,
    skillLevel INT,
    cgpa INT,
    branch TEXT,
    hasSkillCertificate VARCHAR(10),
    status VARCHAR(50),
    employerID INT,
    FOREIGN KEY (employerID) REFERENCES Employer(employerID)
);

CREATE TABLE Jobs(
    jobId int auto_increment Primary Key,
    employerRequestID Int,
    StudentID int,
    FOREIGN key (employerRequestID) REFERENCES EmployerRequest(employerRequestID),
    Foreign key StudentID REFERENCES Student(id)
)


CREATE TABLE Certificate(
    certificateID int AUTO_INCREMENT PRIMARY KEY,
    certificateName Varchar(200),
    certificateOrgnization Varchar(500),
    studentID INT,
    FOREIGN key (studentID) REFERENCES Student(id)
);

CREATE TABLE Resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    resume_type ENUM('pdf', 'video') NOT NULL,
    resume_data LONGBLOB NOT NULL,  
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN key (studentID) REFERENCES Student(id)
);
