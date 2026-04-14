
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can read roles
CREATE POLICY "Admins can read roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Assign admin role to existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('6ce39094-dd7b-45f3-99d1-5e0d525e88d0', 'admin');

-- Drop old write policies on events
DROP POLICY "Only authenticated users can manage events" ON public.events;
DROP POLICY "Only authenticated users can update events" ON public.events;
DROP POLICY "Only authenticated users can delete events" ON public.events;

-- New admin-only write policies on events
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop old write policies on contacts
DROP POLICY "Only authenticated users can manage contacts" ON public.contacts;
DROP POLICY "Only authenticated users can update contacts" ON public.contacts;
DROP POLICY "Only authenticated users can delete contacts" ON public.contacts;

-- New admin-only write policies on contacts
CREATE POLICY "Admins can insert contacts" ON public.contacts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contacts" ON public.contacts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contacts" ON public.contacts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop old write policies on academic_resources
DROP POLICY "Only authenticated users can manage resources" ON public.academic_resources;
DROP POLICY "Only authenticated users can update resources" ON public.academic_resources;
DROP POLICY "Only authenticated users can delete resources" ON public.academic_resources;

-- New admin-only write policies on academic_resources
CREATE POLICY "Admins can insert resources" ON public.academic_resources FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update resources" ON public.academic_resources FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete resources" ON public.academic_resources FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop old write policies on social_links
DROP POLICY "Only authenticated users can manage social_links" ON public.social_links;
DROP POLICY "Only authenticated users can update social_links" ON public.social_links;
DROP POLICY "Only authenticated users can delete social_links" ON public.social_links;

-- New admin-only write policies on social_links
CREATE POLICY "Admins can insert social_links" ON public.social_links FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social_links" ON public.social_links FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete social_links" ON public.social_links FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
