# Prisma Integration Guide for Chatbot Service

This guide explains how the chatbot service uses Prisma ORM to persist chat sessions and messages in PostgreSQL.

## 🗄️ Database Schema

The chatbot service uses the following Prisma models:

### ChatSession
```prisma
model ChatSession {
  id          String    @id @default(cuid())
  userId      String
  title       String?   @default("Health Consultation")
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    ChatMessage[]
}
```

### ChatMessage
```prisma
model ChatMessage {
  id              String      @id @default(cuid())
  sessionId       String
  userId          String
  role            MessageRole
  content         String
  metadata        String?
  timestamp       DateTime    @default(now())

  session         ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user            User        @relation("UserSentMessages", fields: [userId], references: [id])
}
```

### MessageRole Enum
```prisma
enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Configure Database Connection
Create or update `.env` file:
```env
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Migrations
```bash
npx prisma migrate dev --name init_chatbot
```

### 5. View Database (Optional)
```bash
npx prisma studio
```
This opens a visual database browser at http://localhost:5555

## 💾 How Data is Stored

### When a Message is Sent:

1. **Check/Create Session**
   - Checks if session exists in database
   - Creates new session if it doesn't exist
   - Associates session with user

2. **Save User Message**
   - Creates `ChatMessage` record with role=USER
   - Links to session and user
   - Stores message content

3. **Generate AI Response**
   - Loads last 20 messages from database for context
   - Sends to Gemini API with conversation history
   - Gets AI response

4. **Save AI Message**
   - Creates `ChatMessage` record with role=ASSISTANT
   - Links to same session
   - Stores AI response content

## 📊 Database Operations

### Create a New Session
```typescript
const session = await prisma.chatSession.create({
  data: {
    id: sessionId,
    userId: userId,
    title: 'Health Consultation',
    isActive: true,
  },
});
```

### Save a Message
```typescript
const message = await prisma.chatMessage.create({
  data: {
    sessionId: sessionId,
    userId: userId,
    role: MessageRole.USER,
    content: content.trim(),
  },
});
```

### Get Chat History
```typescript
const messages = await prisma.chatMessage.findMany({
  where: { sessionId },
  orderBy: { timestamp: 'asc' },
});
```

### Get All User Sessions
```typescript
const sessions = await prisma.chatSession.findMany({
  where: { 
    userId,
    isActive: true,
  },
  include: {
    _count: {
      select: { messages: true },
    },
  },
  orderBy: { createdAt: 'desc' },
});
```

### Delete Session and Messages
```typescript
// Messages are deleted automatically due to cascade
await prisma.chatSession.delete({
  where: { id: sessionId },
});
```

## 🔧 Common Prisma Commands

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma Client after schema changes |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma studio` | Open visual database browser |
| `npx prisma db push` | Sync schema without migrations (dev only) |
| `npx prisma db pull` | Pull schema from database |
| `npx prisma migrate reset` | Reset database (⚠️ deletes all data) |

## 🎯 Key Benefits

✅ **Type Safety**: TypeScript types auto-generated from schema
✅ **Auto-complete**: IDE suggestions for all database operations
✅ **Cascade Deletes**: Deleting a session automatically deletes its messages
✅ **Optimized Queries**: Efficient database queries with includes/selects
✅ **Migration History**: Track all database changes
✅ **Multiple Databases**: Works with PostgreSQL, MySQL, SQLite, etc.

## 🔍 Querying Examples

### Get Session with Messages
```typescript
const session = await prisma.chatSession.findUnique({
  where: { id: sessionId },
  include: {
    messages: {
      orderBy: { timestamp: 'asc' },
    },
  },
});
```

### Count User's Messages
```typescript
const messageCount = await prisma.chatMessage.count({
  where: { userId },
});
```

### Get Recent Sessions
```typescript
const recentSessions = await prisma.chatSession.findMany({
  where: { userId },
  orderBy: { updatedAt: 'desc' },
  take: 10,
});
```

### Filter Messages by Role
```typescript
const userMessages = await prisma.chatMessage.findMany({
  where: {
    sessionId,
    role: MessageRole.USER,
  },
});
```

## 🛡️ Best Practices

1. **Always Close Connection**
   ```typescript
   await prisma.$disconnect();
   ```

2. **Use Transactions for Multiple Operations**
   ```typescript
   await prisma.$transaction([
     prisma.chatSession.create({ data: {...} }),
     prisma.chatMessage.create({ data: {...} }),
   ]);
   ```

3. **Handle Errors Gracefully**
   ```typescript
   try {
     await prisma.chatSession.create({...});
   } catch (error) {
     if (error.code === 'P2002') {
       // Handle unique constraint violation
     }
   }
   ```

4. **Use Select for Performance**
   ```typescript
   const session = await prisma.chatSession.findUnique({
     where: { id: sessionId },
     select: {
       id: true,
       title: true,
       createdAt: true,
     },
   });
   ```

## 🔄 Migration Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npx prisma migrate dev --name description`
3. **Review Migration**: Check `prisma/migrations` folder
4. **Apply to Production**: `npx prisma migrate deploy`

## 🐛 Troubleshooting

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Can't connect to database"
- Check `DIRECT_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials

### "Migration conflicts"
```bash
npx prisma migrate resolve --rolled-back "migration_name"
```

### "Schema out of sync"
```bash
npx prisma db push
```

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 💡 Tips

- Use `prisma studio` to inspect your data visually
- Keep migrations in version control
- Never edit generated files in `node_modules/@prisma/client`
- Use `include` for relations, `select` for performance
- Leverage TypeScript types for auto-completion
