-- Homepage Testimonials
create table if not exists public.homepage_testimonials (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  name text not null,
  size text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  comment text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.homepage_testimonials enable row level security;

-- Anyone can read active testimonials
create policy "Public read testimonials"
  on public.homepage_testimonials for select
  using (is_active = true);

-- Only admins can insert / update / delete
create policy "Admin manage testimonials"
  on public.homepage_testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

-- Homepage Featured Products
create table if not exists public.homepage_featured (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  name text not null,
  pieces text not null default '',
  price numeric(10,2) not null,
  original_price numeric(10,2) not null,
  image_url text not null default '',
  link text not null default '',
  coupon_code text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.homepage_featured enable row level security;

create policy "Public read featured"
  on public.homepage_featured for select
  using (is_active = true);

create policy "Admin manage featured"
  on public.homepage_featured for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed default testimonials (matches current hardcoded data)
insert into public.homepage_testimonials (sort_order, name, size, rating, comment) values
(1, 'Priya S.', 'S-M', 5, 'Finally! No bulge under my leggings at the gym. I wore it through an entire spin class and not a single leak. Obsessed.'),
(2, 'Ananya R.', 'L-XL', 5, 'Wore it on a 6-hour flight and felt totally fresh. The fact that it''s disposable makes travel SO much easier. Game changer!'),
(3, 'Kavya M.', 'S-M', 5, 'I was sceptical but it''s genuinely slimmer than any pad I''ve worn. It stayed put during my morning run. 10/10 would recommend.'),
(4, 'Shruti T.', '2XL-3XL', 5, 'Love the stretch band – it doesn''t dig in at all. Comfortable for 12 hours straight. No rashes, no leaks. Zero drama.'),
(5, 'Meghna D.', 'L-XL', 5, 'The individual pouches are such a thoughtful touch. Discrete disposal is a big deal for me. These are now a permanent part of my stash.'),
(6, 'Ishita B.', 'S-M', 5, 'My horse riding session used to be such a nightmare during periods. Not anymore! PoppiGo stayed in place the entire time. Unreal.');

-- Seed default featured products (matches current hardcoded data)
insert into public.homepage_featured (sort_order, name, pieces, price, original_price, image_url, link, coupon_code) values
(1, 'Ultra-Slim Period Panty (S-M)', '6 PCs', 339, 399, '', 'https://www.amazon.in/dp/B0FHWT4FJS?th=1&psc=1', 'POPPIGO'),
(2, 'Ultra-Slim Period Panty (L-XL)', '6 PCs', 339, 459, '', 'https://www.amazon.in/dp/B0FJ1VKSM6?th=1&psc=1', 'POPPIGO'),
(3, 'Ultra-Slim Period Panty (2XL-3XL)', '6 PCs', 399, 469, '', 'https://www.amazon.in/dp/B0FJ1YZQQ2?th=1&psc=1', 'POPPIGO');
