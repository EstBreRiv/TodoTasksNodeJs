-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "tittle" TEXT,
    "description" TEXT,
    "state" TEXT DEFAULT 'pending',
    "priority" TEXT DEFAULT 'low',
    "dueDate" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
