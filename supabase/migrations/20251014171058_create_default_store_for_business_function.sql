set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_default_store_for_business()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insert a new store row linked to the new business (NEW.id)
  INSERT INTO public.stores (business_id, name, location)
  VALUES (NEW.id, 'Main Store', 'Headquarters');

  -- The trigger must return the new row (NEW) to complete the insertion of the business
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER tr_create_default_store AFTER INSERT ON public.businesses FOR EACH ROW EXECUTE FUNCTION create_default_store_for_business();


