import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('Postgres foundation: migrations, isolation, idempotency and stale saves', async()=>{
 const db=new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth;
   create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql as 'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid';
   grant usage on schema auth to authenticated;
   insert into auth.users values ('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002');`);
  await db.exec(await readFile(new URL('../supabase/migrations/202609140001_foundation.sql',import.meta.url),'utf8'));
  const first='00000000-0000-4000-8000-000000000001', second='00000000-0000-4000-8000-000000000002';
  const campaign='10000000-0000-4000-8000-000000000001', command='20000000-0000-4000-8000-000000000001';
  const body={name:'Isolation fixture',startDate:'2026-01-01'};
  async function asUser(user:string,sql:string,args:unknown[]=[]){
   await db.exec('begin; set local role authenticated;');
   try {await db.query("select set_config('request.jwt.claim.sub',$1,true)",[user]);const result=await db.query(sql,args);await db.exec('commit');return result;}
   catch(e){await db.exec('rollback');throw e;}
  }
  const call='select public.imperium_save_draft($1,$2,$3::jsonb,$4) as result';
  const one=await asUser(first,call,[campaign,0,JSON.stringify(body),command]);
  const retry=await asUser(first,call,[campaign,0,JSON.stringify(body),command]);
  assert.deepEqual(one.rows,retry.rows);
  assert.equal((one.rows[0] as any).result.draftVersion,1);
  await assert.rejects(asUser(first,call,[campaign,0,JSON.stringify({...body,name:'Conflict'}),command]),/IDEMPOTENCY_CONFLICT/);
  await assert.rejects(asUser(first,call,[campaign,0,JSON.stringify(body),'20000000-0000-4000-8000-000000000002']),/VERSION_CONFLICT/);
  await assert.rejects(asUser(second,'select public.imperium_get_draft($1)',[campaign]),/NOT_FOUND/);
  await assert.rejects(asUser(second,call,[campaign,0,JSON.stringify(body),command]),/NOT_FOUND/);
  assert.deepEqual((await asUser(second,'select public.imperium_list_campaigns() as result')).rows,[{result:[]}]);
  await assert.rejects(asUser(first,'select * from sim.actors'),/permission denied/);
  await assert.rejects(asUser(first,'select * from app.campaigns'),/permission denied/);
  const two=await asUser(first,call,[campaign,1,JSON.stringify({...body,name:'Updated'}),'20000000-0000-4000-8000-000000000002']);
  assert.equal((two.rows[0] as any).result.draftVersion,2);
  // Cross-campaign foreign keys reject an entity from a different world.
  const foreign='10000000-0000-4000-8000-000000000002';
  await db.query('insert into app.campaigns(id,owner_user_id,name,sim_time) values($1,$2,$3,$4)',[foreign,second,'Other','2026-01-01']);
  await db.query('insert into sim.entities(campaign_id,id,kind,name) values($1,$2,$3,$4)',[campaign,command,'actor','A']);
  await assert.rejects(db.query('insert into sim.actors(campaign_id,id,tier) values($1,$2,$3)',[foreign,command,'detailed']),/foreign key/);
 } finally {await db.close();}
});
