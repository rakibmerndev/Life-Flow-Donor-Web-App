# LifeFlowDonor

A MERN stack blood donation platform that connects donors with recipients, built with modern modular architecture and comprehensive API endpoints.

## Features

- User registration with role-based access (Donor, Volunteer, Admin)
- Search for blood donors by blood group and location
- Create and manage blood donation requests
- Request status tracking (Pending, In Progress, Done, Canceled)
- Secure Stripe payment integration for donations
- Admin dashboard for user and request management
- Blog system with draft and publish workflow
- User profile management with image upload
- Password visibility toggle in login/signup forms
- Responsive design with professional UI/UX
- Advanced filtering and pagination for requests and users

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, React Query
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Firebase
- **Payment**: Stripe
- **Image Hosting**: ImgBB
- **UI Components**: SweetAlert2, React Icons, React Helmet

## How It Works

1. Users sign up as donors
2. Search for available donors or create blood requests
3. Volunteers and admins manage requests and user roles
4. Users can make monetary donations through Stripe
5. Admins can create and publish blogs

## Backend Architecture

### Filtering and Pagination

The application implements **server-side filtering and pagination** for optimal performance and accurate data handling:

#### Implementation Strategy
- **Backend Filtering**: All filters are applied at the database level using MongoDB queries before pagination
- **Accurate Counts**: Total records and page counts reflect filtered results, not entire collections
- **Centralized State Management**: Filter state is managed within custom hooks, ensuring consistency across components
- **Automatic Pagination Reset**: When filters change, pagination automatically resets to page 1

#### Filtered Endpoints
1. **Blood Donation Requests** (`GET /api/request`)
   - Query Parameter: `status` (pending, inprogress, done, canceled)
   - Used in: All Requests page and Dashboard All Requests page

2. **User Management** (`GET /api/user`)
   - Query Parameter: `status` (active, blocked)
   - Used in: Admin All Users page

#### Custom Hooks
- `useRequests()` - Manages request fetching with status filtering
- `useUsers()` - Manages user fetching with status filtering
- Both hooks return pagination state and filter handlers

#### Example Request Flow
```
User selects filter → Hook updates status state → Query key changes 
→ React Query invalidates cache → API called with filter parameter
→ MongoDB applies filter before pagination → Only filtered records counted
→ Component renders accurate total and page numbers
```

### Folder Structure

```
server/
├── src/
│   ├── config/
│   │   └── mongodb.js              # MongoDB connection configuration
│   ├── controllers/                # Business logic for each feature
│   │   ├── authController.js       # JWT token generation
│   │   ├── areaController.js       # Districts and Upazilas
│   │   ├── userController.js       # User management
│   │   ├── requestController.js    # Blood donation requests
│   │   ├── blogController.js       # Blog management
│   │   ├── paymentController.js    # Stripe payment handling
│   │   └── statsController.js      # Admin statistics
│   ├── middlewares/                # Express middlewares
│   │   ├── verifyToken.js          # JWT verification
│   │   └── verifyAdmin.js          # Admin authorization
│   ├── models/
│   │   └── collections.js          # MongoDB collection definitions
│   ├── routes/                     # API route definitions
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── area.js                 # Area endpoints
│   │   ├── user.js                 # User endpoints
│   │   ├── request.js              # Request endpoints
│   │   ├── blog.js                 # Blog endpoints
│   │   ├── payment.js              # Payment endpoints
│   │   └── stats.js                # Statistics endpoints
│   └── index.js                    # Main application entry point
├── package.json
├── .env
└── vercel.json
```

## API Endpoints

### Authentication
- `POST /api/auth/token` - Generate JWT token for user

### User Management
- `POST /api/users` - Create a new user (201)
- `GET /api/users` - Get all users with pagination (200)
- `GET /api/users/profile` - Get user profile by email (200)
- `PUT /api/users/profile` - Update user profile (200)
- `GET /api/users/admin/:email` - Check if user is admin (200)
- `PUT /api/users/admin/:id` - Make user admin (200)
- `PUT /api/users/volunteer/:id` - Make user volunteer (200)
- `PUT /api/users/block/:id` - Block user (200)
- `PUT /api/users/activate/:id` - Activate user (200)
- `DELETE /api/users/:id` - Delete user (200)
- `GET /api/users/search/donors` - Search donors by blood group and location (200)
- `GET /api/users/search/all` - Get all users for search (200)

### Blood Donation Requests
- `POST /api/requests` - Create blood donation request (201)
- `GET /api/requests` - Get all donation requests with pagination (200)
- `GET /api/requests/user` - Get current user's requests (200)
- `GET /api/requests/:id` - Get request by ID (200)
- `PUT /api/requests/:id` - Update donation request (200)
- `PUT /api/requests/status/:id` - Assign donor to request (200)
- `PUT /api/requests/done/:id` - Mark request as completed (200)
- `PUT /api/requests/cancel/:id` - Cancel request (200)
- `DELETE /api/requests/:id` - Delete request (200)

### Blogs
- `POST /api/blogs` - Create blog post (201)
- `GET /api/blogs` - Get all blogs (200)
- `GET /api/blogs/published` - Get published blogs only (200)
- `GET /api/blogs/:id` - Get blog by ID (200)
- `PUT /api/blogs/publish/:id` - Publish blog (200)
- `DELETE /api/blogs/:id` - Delete blog (200)

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent (200)
- `POST /api/payments` - Process donation payment (201)
- `GET /api/payments/:email` - Get user's donation history (200)

### Location Data
- `GET /api/areas/districts` - Get all districts (200)
- `GET /api/areas/upazilas` - Get upazilas by district (200)

### Statistics
- `GET /api/stats` - Get admin statistics (200)

## API Response Format

All successful responses return appropriate HTTP status codes:
- **201 Created** - Resource successfully created
- **200 OK** - Request successful
- **403 Forbidden** - Unauthorized access
- **500 Internal Server Error** - Server error

## Live Demo

https://life-flow-donor.vercel.app/

## Author

Rakib - [github.com/rakibmerndev](https://github.com/rakibmerndev)
