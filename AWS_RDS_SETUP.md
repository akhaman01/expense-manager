# AWS RDS Setup Complete

## Configuration
- **Endpoint**: database-1.cfw2eemcibky.ap-south-1.rds.amazonaws.com
- **Username**: admin
- **Database**: expense_manager

## Setup Steps

1. **Install MySQL driver**:
   ```bash
   npm install mysql2
   ```

2. **Set password in .env**:
   ```
   DB_PASSWORD=your-actual-password
   ```

3. **Create database**:
   Connect to RDS and run:
   ```sql
   CREATE DATABASE expense_manager;
   ```

4. **Start server**:
   ```bash
   npm run server
   ```

## Tables Created Automatically
- `expenses` - stores all expense data
- `people` - stores room members

## API Endpoints Updated
- `GET /api/data/:roomId`
- `POST /api/expenses/:roomId`
- `DELETE /api/expenses/:id`
- `POST /api/people/:roomId`
- `DELETE /api/people/:roomId/:name`