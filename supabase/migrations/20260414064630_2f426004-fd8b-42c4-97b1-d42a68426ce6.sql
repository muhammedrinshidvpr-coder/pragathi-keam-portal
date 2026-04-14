
CREATE TABLE public.cutoff_ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch text NOT NULL,
  year integer NOT NULL,
  general_rank integer,
  obc_rank integer,
  sc_rank integer,
  st_rank integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cutoff_ranks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cutoff ranks are publicly readable" ON public.cutoff_ranks
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert cutoff_ranks" ON public.cutoff_ranks
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cutoff_ranks" ON public.cutoff_ranks
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cutoff_ranks" ON public.cutoff_ranks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
