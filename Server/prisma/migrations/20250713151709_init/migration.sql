-- CreateTable
CREATE TABLE "community_member" (
    "id_community_member" SERIAL NOT NULL,
    "english_name" TEXT NOT NULL,
    "title" TEXT,
    "about" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "linkedin_url" TEXT,
    "facebook_url" TEXT,
    "additional_info" TEXT,
    "wants_updates" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "admin_notes" TEXT,
    "years_of_experience" DOUBLE PRECISION,
    "community_value_id" INTEGER,

    CONSTRAINT "community_member_pkey" PRIMARY KEY ("id_community_member")
);

-- CreateTable
CREATE TABLE "events" (
    "id_event" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT,
    "time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "participant_events" (
    "id_community_member" INTEGER NOT NULL,
    "id_event" INTEGER NOT NULL,

    CONSTRAINT "participant_events_pkey" PRIMARY KEY ("id_community_member","id_event")
);

-- CreateTable
CREATE TABLE "groups" (
    "id_group" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id_group")
);

-- CreateTable
CREATE TABLE "group_member" (
    "id_community_member" INTEGER NOT NULL,
    "id_group" INTEGER NOT NULL,

    CONSTRAINT "group_member_pkey" PRIMARY KEY ("id_community_member","id_group")
);

-- CreateTable
CREATE TABLE "community_value" (
    "id_community_value" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "community_value_pkey" PRIMARY KEY ("id_community_value")
);

-- CreateTable
CREATE TABLE "participant_comunity_value" (
    "id_community_member" INTEGER NOT NULL,
    "id_community_value" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "participant_comunity_value_pkey" PRIMARY KEY ("id_community_member","id_community_value")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id_job" SERIAL NOT NULL,
    "id_community_member" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "icon" TEXT,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id_job")
);

-- CreateTable
CREATE TABLE "skills" (
    "id_skill" SERIAL NOT NULL,
    "id_community_member" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id_skill")
);

-- CreateTable
CREATE TABLE "tags" (
    "id_tag" SERIAL NOT NULL,
    "id_community_member" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id_tag")
);

-- AddForeignKey
ALTER TABLE "participant_events" ADD CONSTRAINT "participant_events_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_events" ADD CONSTRAINT "participant_events_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "events"("id_event") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_id_group_fkey" FOREIGN KEY ("id_group") REFERENCES "groups"("id_group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_comunity_value" ADD CONSTRAINT "participant_comunity_value_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_comunity_value" ADD CONSTRAINT "participant_comunity_value_id_community_value_fkey" FOREIGN KEY ("id_community_value") REFERENCES "community_value"("id_community_value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_id_community_member_fkey" FOREIGN KEY ("id_community_member") REFERENCES "community_member"("id_community_member") ON DELETE RESTRICT ON UPDATE CASCADE;
