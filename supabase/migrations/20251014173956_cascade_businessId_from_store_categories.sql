alter table "public"."categories" drop constraint "categories_business_id_fkey";

alter table "public"."stores" drop constraint "stores_business_id_fkey";

alter table "public"."categories" add constraint "categories_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_business_id_fkey";

alter table "public"."stores" add constraint "stores_business_id_fkey" FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE not valid;

alter table "public"."stores" validate constraint "stores_business_id_fkey";


