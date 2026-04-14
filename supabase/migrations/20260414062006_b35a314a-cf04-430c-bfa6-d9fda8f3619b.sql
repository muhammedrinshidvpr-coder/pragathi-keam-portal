
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  registration_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Only authenticated users can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only authenticated users can delete events" ON public.events FOR DELETE TO authenticated USING (true);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Volunteer',
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contacts are publicly readable" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage contacts" ON public.contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Only authenticated users can update contacts" ON public.contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only authenticated users can delete contacts" ON public.contacts FOR DELETE TO authenticated USING (true);

-- Create social_links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_identifier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social links are publicly readable" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage social_links" ON public.social_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Only authenticated users can update social_links" ON public.social_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only authenticated users can delete social_links" ON public.social_links FOR DELETE TO authenticated USING (true);

-- Create academic_resources table
CREATE TABLE public.academic_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'PYQ',
  file_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are publicly readable" ON public.academic_resources FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage resources" ON public.academic_resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Only authenticated users can update resources" ON public.academic_resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only authenticated users can delete resources" ON public.academic_resources FOR DELETE TO authenticated USING (true);
