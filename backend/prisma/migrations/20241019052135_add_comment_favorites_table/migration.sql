-- CreateTable
CREATE TABLE "t_comment_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_comment_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_comment_favorites_user_id_comment_id_key" ON "t_comment_favorites"("user_id", "comment_id");

-- AddForeignKey
ALTER TABLE "t_comment_favorites" ADD CONSTRAINT "t_comment_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_comment_favorites" ADD CONSTRAINT "t_comment_favorites_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "t_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
