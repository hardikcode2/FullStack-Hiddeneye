# Hidden Eye

**Hidden Eye** is an anonymous post web application designed exclusively for college students. It provides a safe, judgment-free platform where users can share their thoughts, experiences, and questions without fear or pressure.

---

## Features

- **Anonymous Posting:** Share thoughts and ideas without revealing your identity.  
- **College-Only Access:** Only users with valid college emails can register and access the platform.  
- **Secure Authentication:** User authentication powered by JWT and password hashing.  
- **User-Friendly Interface:** Clean, responsive design built with TailwindCSS.  
- **Real-Time Interaction:** View posts and interact with others seamlessly.  
- **Safe & Supportive Environment:** Encourages open discussion without judgment.  

---

## Tech Stack

- **Frontend:** Next.js 15, TailwindCSS  
- **Backend:** Node.js via Next.js API Routes  
- **Database:** MySQL (Cloud-ready with Aiven)  
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing  
- **Deployment:** Vercel  

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone 
cd hidden-eye
npm install
```
### 2. Create a .env.local file in the root folder and add required environment variables

### 3. Run the development server
npm run dev

---

### 4. Deployment

-The app is deployed on Vercel for real-time accessibility.

-MySQL database is hosted on Aiven cloud for reliability and scalability.



## Security & Privacy

-Password Hashing: All user passwords are hashed using bcrypt before storing in the database.

-JWT Authentication: Ensures secure session management and access control.

-College Email Verification: Prevents unauthorized users from accessing the platform.

You are Good to go!
