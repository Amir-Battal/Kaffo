<h1 align="center">
  <br>
  <a href="https://github.com/Amir-Battal">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="react.js" width="200">
  </a>
  <br>
    KAFU | كفو
  <br>
</h1>

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Responsive](https://img.shields.io/badge/responsive-design-success?style=for-the-badge)

</div>

**KAFU** is a large-scale, integrated web and mobile platform designed to organize and manage citizen complaints across Syrian ministries. The platform introduces a modern and participatory approach to handling complaints, ensuring transparency, efficiency, and community involvement.

The system is built as a multi-layered application using modern technologies and follows a structured software development lifecycle from requirements gathering to deployment and testing.

<p align="center">
  <a href="#platform-objective">Platform Objective</a> •
  <a href="#platform-architecture">Platform Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#development-process">Development Process</a> •
  <a href="#platform-sections">Platform Sections</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started-locally">Getting Started Locally</a> •
  <a href="#author">Author</a>
</p>


<br />

## Platform Objective

<p>The main goal of the platform is to redefine the complaint submission process. Citizens can submit complaints, select the relevant ministry, and categorize the issue. Complaints are delivered instantly to the concerned authority, which can then choose the most appropriate resolution path:</p>
<ul>
  <li>Resolve the complaint internally</li>
  <li>Delegate the complaint to volunteers</li>
  <li>Delegate the complaint for public donations to cover repair costs</li>
</ul>
<p>This approach encourages community participation, strengthens the culture of volunteering, and helps reduce the burden on citizens and institutions.</p>


<br />

## Platform Architecture

<p>The web and mobile system is composed of three main levels:</p>
<ul>
  <li>Citizen (Regular User)</li>
  <li>Concerned Authority</li>
  <li>Admin Panel</li>
</ul>
<p>Additionally, a Landing Page is available to introduce the platform, explain how it works, and provide frequently asked questions (FAQ).</p>


## Tech Stack

### Backend

- JAVA
- Spring Boot
- SQL
- Postgresql

### Frontend

- React + Vite
- Lucide Icons
- Shadcn
- Tailwind CSS
- Axios

<br />

## Development Process
<p>The platform was built following a structured and professional workflow:</p>
<ol>
  <li>Gathering requirements and writing a detailed functional specification</li>
  <li>Reviewing and validating the specification</li>
  <li>Designing user interfaces based on the approved specification</li>
  <li>Creating ERD diagrams and defining system architecture</li>
  <li>Parallel development across web, backend, and mobile platforms</li>
  <li>Testing and validation to ensure alignment with initial requirements</li>
</ol>

<br />

## Platform Sections
<h4>👤 Citizen (Regular User)</h4> 
<p> Citizens can create and complete their personal accounts, submit complaints, and track their status in real time. They can also participate in resolving other complaints that have been delegated for volunteering by submitting proposed solutions and estimated costs. Additionally, users can donate to complaints delegated for financial support. </p> 

<h4>🏛️ Concerned Authority</h4> 
<p> Authorities receive complaints instantly and can manage them through multiple resolution paths, including direct resolution, delegation to volunteers, or opening the complaint for public donations. </p> 

<h4>🛡️ Admin Panel</h4> 
<p> Admins have full control over the platform, including managing users, complaints, ministries, and categories. The admin panel also provides comprehensive statistics and analytics, role management, and full content control across the system. </p> 

<br/>



## Features

- 📝 Structured complaint submission system
- ⚡ Instant complaint delivery to concerned authorities
- 🤝 Volunteer-based complaint resolution
- 💰 Donation-based resolution support
- 📊 Administrative dashboard with detailed statistics
- 🔐 Role-based access control
- 🎯 Clean, scalable, and user-friendly system design


<br />

## Getting Started Locally

### Setup Backend from <a href="https://github.com/Abdulhadi-Assi/kafu">HERE</a>

### 1. Clone the Repository

```bash
git clone https://github.com/Amir-Battal/Kaffo.git
cd kaffo
```

### Create a .env file with the following content:

```
VITE_API_BASE_URL=...BASE_URL Here
VITE_S3_BASE_URL=...S3_BASE_URL Here
AWS_S3_BUCKET=...AWS_S3_BUCKET Here
```

### 2. Setup Frontend

```
npm install
npm run dev
```


<br/>

## Author

<a href="https://amirbattal.com" target="_blank">Amir Battal</a>

---

> Linkedin [Amir Battal](https://www.linkedin.com/in/amir-battal/) &nbsp;&middot;&nbsp;
> GitHub [@Amir-Battal](https://github.com/Amir-Battal) &nbsp;&middot;&nbsp;
