begin;
create schema if not exists app;
create schema if not exists sim;
create schema if not exists intel;
create schema if not exists history;
create schema if not exists jobs;
create schema if not exists memory;
revoke all on schema app, sim, intel, history, jobs, memory from public, anon, authenticated;

create table app.campaigns (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null references auth.users(id),
 name text not null check (length(name) between 1 and 120),
 status text not null default 'draft' check (status in ('draft','active','ended')),
 revision bigint not null default 0 check (revision >= 0),
 sim_time timestamptz not null,
 created_at timestamptz not null default now()
);
create index campaigns_owner on app.campaigns(owner_user_id);
create table app.world_drafts (
 campaign_id uuid primary key references app.campaigns(id),
 version bigint not null default 1,
 document jsonb not null check (jsonb_typeof(document)='object'),
 updated_at timestamptz not null default now()
);
create table app.commands (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null,
 user_id uuid not null references auth.users(id),
 kind text not null,
 body jsonb not null,
 result jsonb not null,
 created_at timestamptz not null default now(),
 primary key(campaign_id,id)
);
create table sim.entities (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null default gen_random_uuid(),
 kind text not null,
 name text not null,
 revision bigint not null default 0,
 primary key(campaign_id,id)
);
create table sim.actors (
 campaign_id uuid not null,
 id uuid not null,
 tier text not null check(tier in ('background','detailed')),
 objectives jsonb not null default '[]',
 constraints jsonb not null default '[]',
 planning_due_at timestamptz,
 primary key(campaign_id,id),
 foreign key(campaign_id,id) references sim.entities(campaign_id,id)
);
create table history.events (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null default gen_random_uuid(),
 revision bigint not null,
 sim_time timestamptz not null,
 recorded_at timestamptz not null default now(),
 kind text not null,
 severity integer not null check(severity between 0 and 5),
 true_payload jsonb not null,
 primary key(campaign_id,id)
);
create index events_timeline on history.events(campaign_id,sim_time);
create table history.decisions (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null default gen_random_uuid(),
 actor_id uuid not null,
 sim_time timestamptz not null,
 title text not null,
 confirmed_proposal jsonb not null,
 primary key(campaign_id,id),
 foreign key(campaign_id,actor_id) references sim.actors(campaign_id,id)
);
create table history.causal_nodes (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null default gen_random_uuid(),
 event_id uuid,
 decision_id uuid,
 primary key(campaign_id,id),
 check(num_nonnulls(event_id,decision_id)=1),
 foreign key(campaign_id,event_id) references history.events(campaign_id,id),
 foreign key(campaign_id,decision_id) references history.decisions(campaign_id,id),
 unique(campaign_id,event_id), unique(campaign_id,decision_id)
);
create table history.causal_edges (
 campaign_id uuid not null,
 source_id uuid not null,
 target_id uuid not null,
 kind text not null check(kind in ('caused','enabled','constrained','mitigated','amplified','prevented')),
 primary key(campaign_id,source_id,target_id,kind),
 foreign key(campaign_id,source_id) references history.causal_nodes(campaign_id,id),
 foreign key(campaign_id,target_id) references history.causal_nodes(campaign_id,id),
 check(source_id<>target_id)
);
create table sim.resources (
 campaign_id uuid not null,
 id uuid not null,
 unit text not null,
 indivisible boolean not null default false,
 primary key(campaign_id,id),
 foreign key(campaign_id,id) references sim.entities(campaign_id,id)
);
create table sim.stock_accounts (
 campaign_id uuid not null,
 id uuid not null default gen_random_uuid(),
 holder_id uuid not null,
 resource_id uuid not null,
 quantity numeric(24,6) not null check(quantity>=0),
 reserved numeric(24,6) not null default 0 check(reserved>=0 and reserved<=quantity),
 primary key(campaign_id,id),
 unique(campaign_id,holder_id,resource_id),
 foreign key(campaign_id,holder_id) references sim.entities(campaign_id,id),
 foreign key(campaign_id,resource_id) references sim.resources(campaign_id,id)
);
create table sim.stock_movements (
 campaign_id uuid not null,
 id uuid not null,
 account_id uuid not null,
 event_id uuid not null,
 delta numeric(24,6) not null check(delta<>0),
 reason text not null,
 primary key(campaign_id,id),
 foreign key(campaign_id,account_id) references sim.stock_accounts(campaign_id,id),
 foreign key(campaign_id,event_id) references history.events(campaign_id,id)
);
create table sim.strategic_threads (
 campaign_id uuid not null,
 id uuid not null,
 origin_node_id uuid not null,
 lifecycle text not null check(lifecycle in ('Dormant','Growing','Declining','Active','Critical','Resolved','Neutralized')),
 condition_ast jsonb not null,
 primary key(campaign_id,id),
 foreign key(campaign_id,id) references sim.entities(campaign_id,id),
 foreign key(campaign_id,origin_node_id) references history.causal_nodes(campaign_id,id)
);
create table sim.thread_dependencies (
 campaign_id uuid not null,
 thread_id uuid not null,
 entity_id uuid not null,
 metric text not null,
 primary key(campaign_id,thread_id,entity_id,metric),
 foreign key(campaign_id,thread_id) references sim.strategic_threads(campaign_id,id),
 foreign key(campaign_id,entity_id) references sim.entities(campaign_id,id)
);
create index thread_dependency_lookup on sim.thread_dependencies(campaign_id,entity_id,metric);
create table intel.claims (
 campaign_id uuid not null,
 id uuid not null default gen_random_uuid(),
 observer_id uuid not null,
 subject_id uuid not null,
 predicate text not null,
 value jsonb not null,
 confidence numeric(7,6) check(confidence between 0 and 1),
 learned_at timestamptz not null,
 primary key(campaign_id,id),
 foreign key(campaign_id,observer_id) references sim.actors(campaign_id,id),
 foreign key(campaign_id,subject_id) references sim.entities(campaign_id,id)
);
create table jobs.turns (
 campaign_id uuid not null references app.campaigns(id),
 id uuid not null default gen_random_uuid(),
 status text not null check(status in ('accepted','running','interrupted','completed','failed','ended')),
 start_time timestamptz not null,
 target_time timestamptz not null,
 committed_time timestamptz not null,
 fencing_token bigint not null,
 primary key(campaign_id,id),
 check(target_time>start_time and committed_time>=start_time and committed_time<=target_time)
);
create unique index one_active_turn on jobs.turns(campaign_id) where status in ('accepted','running','interrupted','failed');
create table jobs.checkpoints (
 campaign_id uuid not null,
 turn_id uuid not null,
 sequence bigint not null,
 revision bigint not null,
 state_hash text not null,
 primary key(campaign_id,turn_id,sequence),
 foreign key(campaign_id,turn_id) references jobs.turns(campaign_id,id)
);

-- No browser or public Data API access to canonical tables, including owners.
do $$ declare t record; begin
 for t in select schemaname,tablename from pg_tables where schemaname in ('app','sim','intel','history','jobs','memory') loop
  execute format('alter table %I.%I enable row level security',t.schemaname,t.tablename);
  execute format('revoke all on %I.%I from public, anon, authenticated',t.schemaname,t.tablename);
 end loop;
end $$;

create function public.imperium_list_campaigns() returns jsonb
language sql stable security definer set search_path = '' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'status',c.status,'revision',c.revision,'simTime',c.sim_time) order by c.created_at desc),'[]'::jsonb)
 from app.campaigns c where c.owner_user_id=auth.uid();
$$;
create function public.imperium_get_draft(p_campaign_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare r jsonb;
begin
 select jsonb_build_object('id',c.id,'name',c.name,'status',c.status,'revision',c.revision,'simTime',c.sim_time,'draft',d.document,'draftVersion',d.version)
 into r from app.campaigns c join app.world_drafts d on d.campaign_id=c.id
 where c.id=p_campaign_id and c.owner_user_id=auth.uid();
 if r is null then raise exception 'NOT_FOUND'; end if;
 return r;
end $$;
create function public.imperium_save_draft(p_campaign_id uuid, p_expected_version bigint, p_document jsonb, p_command_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid:=auth.uid(); c app.campaigns; old app.commands; v bigint; result jsonb; body jsonb;
begin
 if owner_id is null then raise exception 'UNAUTHENTICATED'; end if;
 if p_campaign_id is null or p_command_id is null or p_expected_version is null or p_expected_version<0 then raise exception 'INVALID_REQUEST'; end if;
 if jsonb_typeof(p_document) is distinct from 'object' or octet_length(p_document::text)>262144
 or coalesce(length(trim(p_document->>'name')),0) not between 1 and 120
 or coalesce(p_document->>'startDate','') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'INVALID_DRAFT'; end if;
 -- Serialize creation/retries too, so an absent row cannot race another creation.
 perform pg_advisory_xact_lock(hashtextextended(p_campaign_id::text,0));
 select * into c from app.campaigns where id=p_campaign_id for update;
 if found then
  if c.owner_user_id<>owner_id then raise exception 'NOT_FOUND'; end if;
  if c.status<>'draft' then raise exception 'NOT_DRAFT'; end if;
 elsif p_expected_version<>0 then raise exception 'NOT_FOUND';
 else
  insert into app.campaigns(id,owner_user_id,name,sim_time) values(p_campaign_id,owner_id,trim(p_document->>'name'),(p_document->>'startDate')::date);
 end if;
 body:=jsonb_build_object('expectedVersion',p_expected_version,'document',p_document);
 select * into old from app.commands where campaign_id=p_campaign_id and id=p_command_id;
 if found then
  if old.user_id<>owner_id or old.body<>body then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
  return old.result;
 end if;
 select version into v from app.world_drafts where campaign_id=p_campaign_id;
 if coalesce(v,0)<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
 v:=coalesce(v,0)+1;
 insert into app.world_drafts(campaign_id,version,document) values(p_campaign_id,v,p_document)
 on conflict(campaign_id) do update set version=excluded.version,document=excluded.document,updated_at=now();
 update app.campaigns set name=trim(p_document->>'name'),sim_time=(p_document->>'startDate')::date,revision=revision+1 where id=p_campaign_id;
 result:=public.imperium_get_draft(p_campaign_id);
 insert into app.commands(campaign_id,id,user_id,kind,body,result) values(p_campaign_id,p_command_id,owner_id,'save_draft',body,result);
 return result;
end $$;
revoke all on function public.imperium_list_campaigns() from public,anon;
revoke all on function public.imperium_get_draft(uuid) from public,anon;
revoke all on function public.imperium_save_draft(uuid,bigint,jsonb,uuid) from public,anon;
grant execute on function public.imperium_list_campaigns() to authenticated;
grant execute on function public.imperium_get_draft(uuid) to authenticated;
grant execute on function public.imperium_save_draft(uuid,bigint,jsonb,uuid) to authenticated;
comment on function public.imperium_save_draft(uuid,bigint,jsonb,uuid) is 'Owner-scoped, idempotent draft save. Does not launch or simulate a campaign.';
commit;
