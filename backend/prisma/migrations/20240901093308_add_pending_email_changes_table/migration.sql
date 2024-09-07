-- CreateTable
CREATE TABLE "t_pending_email_changes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "t_pending_email_changes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "t_pending_email_changes" ADD CONSTRAINT "t_pending_email_changes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
