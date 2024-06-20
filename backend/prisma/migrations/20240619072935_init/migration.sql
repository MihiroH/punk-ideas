-- CreateTable
CREATE TABLE "m_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "age" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "m_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_ideas" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "author_ip" BYTEA NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "open_level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "t_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_idea_files" (
    "id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_idea_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_comments" (
    "id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "author_ip" BYTEA NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "t_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_idea_categories" (
    "id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_idea_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_reports" (
    "id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "reporter_ip" BYTEA NOT NULL,
    "report_reason_id" INTEGER NOT NULL,
    "report_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_report_reasons" (
    "id" SERIAL NOT NULL,
    "reason_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_report_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_users_email_key" ON "m_users"("email");

-- AddForeignKey
ALTER TABLE "t_ideas" ADD CONSTRAINT "t_ideas_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_idea_files" ADD CONSTRAINT "t_idea_files_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "t_ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_comments" ADD CONSTRAINT "t_comments_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "t_ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_comments" ADD CONSTRAINT "t_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_idea_categories" ADD CONSTRAINT "t_idea_categories_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "t_ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_idea_categories" ADD CONSTRAINT "t_idea_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "m_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_reports" ADD CONSTRAINT "t_reports_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "t_ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_reports" ADD CONSTRAINT "t_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_reports" ADD CONSTRAINT "t_reports_report_reason_id_fkey" FOREIGN KEY ("report_reason_id") REFERENCES "m_report_reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
