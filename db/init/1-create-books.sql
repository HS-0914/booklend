DROP TABLE IF EXISTS "public"."books";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS books_id_seq;

-- Table Definition
CREATE TABLE "public"."books" (
    "id" int4 NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "title" varchar,
    "author" varchar,
    "publisher" varchar,
    "published_year" varchar,
    "isbn" varchar NOT NULL,
    "volume" varchar,
    "kdc" varchar,
    "status" varchar NOT NULL DEFAULT 'available'::character varying,
    PRIMARY KEY ("id")
);


-- Indices
CREATE UNIQUE INDEX "PK_f3f2f25a099d24e12545b70b022" ON public.books USING btree (id);

