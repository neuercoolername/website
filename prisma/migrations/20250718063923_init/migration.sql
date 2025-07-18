-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "links" TEXT[],
    "related" TEXT[],
    "tags" TEXT[],
    "isMajor" BOOLEAN NOT NULL DEFAULT false,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
