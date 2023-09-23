# FCS Project

### 1. **Setting up Your Environment**:

- Initialize a new Node.js project.
- Install Express.js, MongoDB (use mongoose for MongoDB object modeling) and React.
- Use `create-react-app` for the frontend React setup.

### 2. **Database Design**:

For MongoDB, you might have models/collections such as:

- User (with fields like userID, email, password, role(admin, seller, buyer), profileInfo, document, etc.)
- Property (fields like propertyID, owner, type, budget, location, amenities, availability dates, etc.)
- Contract (fields to capture agreement terms, involved parties, and e-signatures)

### 3. **Backend Routes & Logic**:

- **Authentication**: Use packages like `passport` or `jsonwebtoken` to manage authentication and user sessions.
- **Users**: Routes to register, login, update profile, view profile.
- **eKYC**: Interface with the provided eKYC API using packages like `axios`.
- **Property**: Routes to create, modify, delete and fetch property listings.
- **Contract**: Routes to create a digital contract and sign it.
- **Document Verification and e-sign**: Logic for verifying documents and contracts (as you mentioned no external libraries, you'll need to implement your own algorithms which can be complex).

### 4. **React Frontend**:

- **Components**: Breakdown your UI into reusable components.
  - Signup, Login
  - Profile view and edit
  - Property listing, search, view
  - Contract creation and signing interface
  - Admin dashboard

- **State Management**: Consider using `Redux` or React's `Context API` to manage application state.

### 5. **Security**:

This is paramount, especially when you're handling contracts and personal identification documents.

- Ensure all data transmission happens over HTTPS.
- Store passwords in hashed form (use libraries like `bcrypt`).
- Use server-side validation for all incoming data.
- Use appropriate permissions checks (e.g., only admins can view all user details).

### 6. **Hosting and Deployment**:

- **Backend**: Consider platforms like Heroku, DigitalOcean, or AWS EC2.
- **Frontend**: Static hosting platforms like Netlify, Vercel, or even AWS S3 for static websites.
- **MongoDB**: Consider MongoDB Atlas or self-hosting on platforms like DigitalOcean or AWS EC2.

### 7. **Testing**:

This is crucial, given the critical nature of the operations (contracts, e-sign, and personal document handling).

- Write unit tests for your backend logic.
- Use tools like `jest` and `supertest` for backend testing.
- Consider frontend testing tools like `jest`, `react-testing-library`, or `enzyme`.

### Conclusion:

This project is extensive and requires a mix of web development, security, and design knowledge. It might be beneficial to split the project into multiple phases. Start with setting up a basic system with authentication and then incrementally add other features like property listing, eKYC integration, etc.

Additionally, when dealing with tasks like e-signing and document verification without external libraries, the complexity grows significantly. If it becomes too cumbersome, it might be wise to reconsider the no-external-library constraint.