alter table "public"."products" drop column "base_price";

alter table "public"."products" add column "price" numeric not null;


