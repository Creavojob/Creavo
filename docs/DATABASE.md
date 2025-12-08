# Database Schema

## Users Table
```sql
CREATE TABLE "Users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  userType ENUM('freelancer', 'client') NOT NULL,
  companyName VARCHAR(255),
  bio TEXT,
  profileImage VARCHAR(255),
  phone VARCHAR(20),
  portfolio VARCHAR(255),
  skills TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  totalReviews INTEGER DEFAULT 0,
  paypalEmail VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Jobs Table
```sql
CREATE TABLE "Jobs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clientId UUID NOT NULL REFERENCES "Users"(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  skills TEXT[] DEFAULT '{}',
  budget DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  duration VARCHAR(50),
  experience ENUM('entry', 'intermediate', 'expert') DEFAULT 'intermediate',
  status ENUM('open', 'in-progress', 'completed', 'closed') DEFAULT 'open',
  visibility ENUM('public', 'private') DEFAULT 'public',
  attachment VARCHAR(255),
  deadline TIMESTAMP,
  views INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Applications Table
```sql
CREATE TABLE "Applications" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jobId UUID NOT NULL REFERENCES "Jobs"(id),
  freelancerId UUID NOT NULL REFERENCES "Users"(id),
  bidAmount DECIMAL(10,2) NOT NULL,
  coverLetter TEXT,
  attachments VARCHAR(255)[] DEFAULT '{}',
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
  ratedBySeller BOOLEAN DEFAULT FALSE,
  ratedByBuyer BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Payments Table
```sql
CREATE TABLE "Payments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicationId UUID NOT NULL REFERENCES "Applications"(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  paypalTransactionId VARCHAR(255),
  status ENUM('pending', 'authorized', 'captured', 'released', 'refunded', 'failed') DEFAULT 'pending',
  type ENUM('escrow', 'freelancer-payment') DEFAULT 'escrow',
  releaseDate TIMESTAMP,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

- User (1) → (M) Job (über clientId)
- User (1) → (M) Application (über freelancerId)
- Job (1) → (M) Application
- Application (1) → (1) Payment

## Indices für Performance

```sql
CREATE INDEX idx_jobs_clientId ON "Jobs"(clientId);
CREATE INDEX idx_jobs_status ON "Jobs"(status);
CREATE INDEX idx_applications_jobId ON "Applications"(jobId);
CREATE INDEX idx_applications_freelancerId ON "Applications"(freelancerId);
CREATE INDEX idx_payments_applicationId ON "Payments"(applicationId);
```
