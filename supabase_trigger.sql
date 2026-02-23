-- Trigger para crear perfil de usuario automáticamente al registrarse con Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, plan, credits_total, credits_used)
  values (new.id, new.email, 'starter', 20, 0);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
