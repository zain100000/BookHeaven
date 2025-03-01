# MediLink Backend

## Description

The **MediLink Backend** is a Node.js-based RESTful API designed to support a full-featured doctor appointment and healthcare management platform. This backend provides endpoints for managing users, doctors, appointments, specialties, reviews, and schedules. It includes robust user authentication and role-based access control (RBAC), allowing admins and superadmins to manage the platform effectively.

---

## Features

- **User Management**:

  - User registration, login, and authentication.
  - Role-based access control: `patient`, `doctor`, and `superadmin`.
  - Profile management for patients and doctors.

- **Doctor Management:**:

  - Add, update, delete, and view doctor profiles.
  - Associate doctors with specialties and availability schedules.
  - Average ratings calculated from patient reviews.
  - Categorize doctors by medical specialties (e.g., Cardiology, Dermatology, Neurology).

- **Appointments:**:

  - Patients can book, reschedule, or cancel appointments.
  - Doctors can manage their appointment schedules.

- **Reviews & Ratings:**:

  - Patients can leave ratings and comments for doctors.

- **Role Based Accessed Control(RBAC):**:

  - Only superadmins will be able to manage.

---
