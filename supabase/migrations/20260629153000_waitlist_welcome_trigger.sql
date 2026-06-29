-- Fire the waitlist-welcome Edge Function on every new signup.
-- This is the SQL equivalent of a Supabase "Database Webhook" (which is just a
-- trigger calling net.http_post under the hood). Uses pg_net (enabled by default).
-- Auth: the publishable key, which the deployed function accepts for invocation.

create or replace function public.handle_new_waitlist()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url     := 'https://hzsilbjojgqxmzwehvrp.supabase.co/functions/v1/waitlist-welcome',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_UHMPzEURH0mOSXucu5_AlA_ICJPkMaR'
    ),
    body    := jsonb_build_object('type', 'INSERT', 'table', 'waitlist', 'record', to_jsonb(new))
  );
  return new;
end;
$$;

drop trigger if exists on_waitlist_insert on public.waitlist;
create trigger on_waitlist_insert
  after insert on public.waitlist
  for each row execute function public.handle_new_waitlist();
