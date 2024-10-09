-- CreateTable
CREATE TABLE "t_idea_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_idea_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_idea_favorites_user_id_idea_id_key" ON "t_idea_favorites"("user_id", "idea_id");

-- AddForeignKey
ALTER TABLE "t_idea_favorites" ADD CONSTRAINT "t_idea_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_idea_favorites" ADD CONSTRAINT "t_idea_favorites_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "t_ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
