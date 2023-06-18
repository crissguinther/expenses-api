-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "personalInfoUserId" INTEGER,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalInfo" (
    "userId" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "personalInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_personalInfoUserId_key" ON "users"("personalInfoUserId");

-- CreateIndex
CREATE UNIQUE INDEX "personalInfo_userId_key" ON "personalInfo"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personalInfoUserId_fkey" FOREIGN KEY ("personalInfoUserId") REFERENCES "personalInfo"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
