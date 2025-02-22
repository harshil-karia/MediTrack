/*
  Warnings:

  - A unique constraint covering the columns `[aadharNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_aadharNumber_key" ON "User"("aadharNumber");
