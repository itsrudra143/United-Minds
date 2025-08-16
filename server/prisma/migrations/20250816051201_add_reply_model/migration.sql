-- CreateTable
CREATE TABLE "public"."Reply" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "threadId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reply_threadId_idx" ON "public"."Reply"("threadId");

-- CreateIndex
CREATE INDEX "Reply_authorId_idx" ON "public"."Reply"("authorId");

-- CreateIndex
CREATE INDEX "Reply_parentId_idx" ON "public"."Reply"("parentId");

-- CreateIndex
CREATE INDEX "Thread_categoryId_idx" ON "public"."Thread"("categoryId");

-- CreateIndex
CREATE INDEX "Thread_authorId_idx" ON "public"."Thread"("authorId");

-- AddForeignKey
ALTER TABLE "public"."Reply" ADD CONSTRAINT "Reply_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reply" ADD CONSTRAINT "Reply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
