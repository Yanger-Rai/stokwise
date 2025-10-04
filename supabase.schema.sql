/**
 * -----------------------------------------------------------
 * 1. ENABLING RLS AND CREATING TABLES
 * -----------------------------------------------------------
 * These tables mirror the types defined in src/types/stores.type.ts
 *
 * NOTE: When a user signs up via Auth, an entry is automatically created
 * in the 'auth.users' table. Our 'profiles' table extends this.
 */

-- Enable Row Level Security (RLS) on all tables for security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- 1. PROFILES Table (Extends auth.users)
-- -----------------------------------------------------------

-- We assume the profiles table is already created via a migration or a template.
-- If not, you must ensure it exists and has the necessary foreign key constraint.

CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text
);

-- Function to automatically create a profile entry on new user sign-up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.email); -- Using email as temp full_name on creation
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- RLS: Users can view and update their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- -----------------------------------------------------------
-- 2. BUSINESSES Table (The Multi-tenant Entity)
-- -----------------------------------------------------------

CREATE TABLE public.businesses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id uuid REFERENCES public.profiles (id) NOT NULL,
    name text NOT NULL,
    slug text NOT NULL UNIQUE -- Used for URL routing (e.g., stokwise.app/myslug)
);

-- RLS: Owners can CRUD their businesses
CREATE POLICY "Owners can manage their businesses"
ON public.businesses
FOR ALL USING (auth.uid() = owner_id);


-- -----------------------------------------------------------
-- 3. STORES Table (Branches/Locations)
-- -----------------------------------------------------------

CREATE TABLE public.stores (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id uuid REFERENCES public.businesses (id) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    location text
);

-- RLS: Users can only see/manage stores belonging to their businesses
CREATE POLICY "Business members can manage stores"
ON public.stores
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = stores.business_id AND businesses.owner_id = auth.uid())
);


-- -----------------------------------------------------------
-- 4. CATEGORIES Table
-- -----------------------------------------------------------

-- Categories are still scoped to the business level, but RLS checks through the business owner.
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    business_id uuid REFERENCES public.businesses (id) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);

-- RLS: Business members can manage categories
CREATE POLICY "Business members can manage categories"
ON public.categories
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = categories.business_id AND businesses.owner_id = auth.uid())
);


-- -----------------------------------------------------------
-- 5. PRODUCTS Table (Store-Specific Catalog)
-- -----------------------------------------------------------

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    -- This is the crucial link: Product belongs to a single Store
    store_id uuid REFERENCES public.stores (id) NOT NULL, 
    category_id uuid REFERENCES public.categories (id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    sku text NOT NULL,
    base_price numeric NOT NULL,
    image_url text
);

-- RLS: Business members can manage products if the store belongs to their business
CREATE POLICY "Business members can manage products"
ON public.products
FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.businesses
        JOIN public.stores ON stores.business_id = businesses.id
        WHERE stores.id = products.store_id AND businesses.owner_id = auth.uid()
    )
);


-- -----------------------------------------------------------
-- 6. INVENTORY Table (Stock Tracking - simplified with new product schema)
-- -----------------------------------------------------------

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    -- We only need the product_id now, as store_id is on the products table.
    product_id uuid REFERENCES public.products (id) NOT NULL,
    stock_quantity integer NOT NULL,
    min_level integer NOT NULL,
    selling_price numeric,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Constraint: Ensure only one inventory record per product (simplified model)
    UNIQUE (product_id)
);

-- RLS: Business members can manage inventory (via product's store ownership)
CREATE POLICY "Business members can manage inventory"
ON public.inventory
FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM public.businesses
        JOIN public.stores ON stores.business_id = businesses.id
        JOIN public.products ON products.store_id = stores.id
        WHERE products.id = inventory.product_id AND businesses.owner_id = auth.uid()
    )
);
