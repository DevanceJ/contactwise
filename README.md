# User Management Application

A comprehensive user management application built with **Next.js**, **NextAuth.js**, **Prisma ORM**, **PostgreSQL**, **Shadcn**, and **TypeScript**. This application provides essential features such as user authentication, tenant management, role-based access control (RBAC), and password management functionalities.

## Features

### 1. User Authentication
- **Registration:** Users can register with their email address. Email verification is required.
- **Login:** Users can log in using their email and password.
- **Social Authentication:** Users can log in using Google.
- **Logout:** Users can log out of the application.
- **Password Reset:** Users can request a password reset link via email. A secure reset link is sent to the user’s email.
- **Reset Process:** Users can reset their password after clicking the reset link.

### 2. Tenant Management
- **Tenant Association:** Users can be associated with one or more tenants (organizations).
- **Admin Controls:** Administrators can create, edit, and delete tenants.

### 3. Role-Based Access Control (RBAC)
- **Roles:** Defines roles such as admin, manager, and user with varying access levels.
- **Role Assignment:** Roles can be assigned to users within a tenant.
- **Access Restrictions:** Access to different parts of the application is controlled based on user roles and permissions.

## Idea
- **Role Assignment:** The "admin" role is assigned to specific users, while the "manager" and "user" roles are specific to individual tenants.
- **Administrative Privileges:** Admins have the ability to create and update tenants. They can also add or remove users from tenants and assign or modify their roles as manager or user. Only an admin can elevate another user to the admin role.
- **Managerial Privileges:** Within a tenant, managers can remove users and modify their roles.
- **Tenant Visibility:** Admins can view all tenants in the database, regardless of their ownership. Users and managers, on the other hand, can only view tenants to which they are associated.

## Technologies Used
- **Next.js:** React framework for building the frontend.
- **NextAuth.js:** Authentication library for Next.js.
- **Prisma ORM:** Type-safe database client.
- **PostgreSQL:** Relational database for storing user and tenant data.
- **Shadcn:** UI components for styling.
- **TypeScript:** Type-safe programming language for better development experience.

## Setup Requirements

1. **Next 14+**

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevanceJ/contactwise
   cd contactwise
   npm i
   npm run dev
2. **Environment Variables:**
- *.env* file shared already.
3. **Build:**
  ```bash
  npm run build
  npm start
