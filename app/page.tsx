'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
import { Landmark, Globe2, Shield, Building2, ChartNoAxesCombined, ArrowUpRight, Plus, ChevronRight, Save, X, BookOpen, Settings2, LogOut, Check, ArrowLeft, CircleHelp, Compass } from 'lucide-react';
import { newDraft, sections, reviewDraft, DraftSchema, type WorldDraft } from '../packages/contracts/draft';

type Campaign={id:string;name:string;status:string;simTime:string;revision:number};
type Saved=Campaign & {draft:WorldDraft;draftVersion:number};
const tabs=[{name:'Home',icon:Landmark},{name:'Map & Intelligence',icon:Globe2},{name:'Military',icon:Shield},{name:'Government',icon:Building2},{name:'Finance & Economy',icon:ChartNoAxesCombined}];
const domains=[
 {title:'The world beyond your borders',eyebrow:'MAP & INTELLIGENCE',copy:'Nations pursue their own ambitions. Your intelligence will reveal what your government knows—not everything that is true.',items:['Political & alliance layers','Country assessments','World events & reporting']},
 {title:'Command through intent',eyebrow:'MILITARY',copy:'Set strategic objectives. Weigh your commanders’ courses of action. Every deployment draws on real forces, supplies and authority.',items:['Force organization & readiness','Operations & release authority','Equipment & procurement']},
 {title:'Power is never absolute',eyebrow:'GOVERNMENT',copy:'Your institutions, ministers and political blocs shape what is possible. Build support, negotiate legislation and govern within your authority.',items:['Institutions & political blocs','People & assessed dossiers','Legislation & appropriations']},
 {title:'The means behind the ambition',eyebrow:'FINANCE & ECONOMY',copy:'Balance the treasury with strategic investment. Supply chains, industrial capacity and past decisions will shape future resilience.',items:['Treasury & sovereign debt','Strategic industries & energy','Resources & trade dependencies']}
];
export default function Page(){
 const [tab,setTab]=useState(0),[db,setDb]=useState<SupabaseClient|null>(null),[session,setSession]=useState<Session|null>(null);
 const [campaigns,setCampaigns]=useState<Campaign[]>([]),[selected,setSelected]=useState<Saved|null>(null),[draft,setDraft]=useState<WorldDraft>(newDraft);
 const [editor,setEditor]=useState(false),[step,setStep]=useState(0),[authOpen,setAuthOpen]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[online,setOnline]=useState(true),[configured,setConfigured]=useState<boolean|null>(null),[review,setReview]=useState(false),[info,setInfo]=useState<string|null>(null);
 const pendingSave=useRef<{id:string;key:string;body:string}|null>(null);
 useEffect(()=>{
  if(!authOpen&&!info)return;
  const previous=document.activeElement as HTMLElement|null;
  const dialog=document.querySelector<HTMLElement>('[role="dialog"]');
  dialog?.querySelector<HTMLElement>('button,input')?.focus();
  function keyboard(event:KeyboardEvent){
   if(event.key==='Escape'){setAuthOpen(false);setInfo(null);setPassword('');}
   if(event.key==='Tab'){
    const items=Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]')??[]);
    const first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
   }
  }
  document.addEventListener('keydown',keyboard);return()=>{document.removeEventListener('keydown',keyboard);previous?.focus();};
 },[authOpen,info]);
 useEffect(()=>{
  const update=()=>setOnline(navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
  let unsubscribe:(()=>void)|undefined;
  fetch('/api/v1/config').then(r=>r.json()).then(config=>{
   if(!config.supabaseKey){setConfigured(false);return;}
   const client=createClient(config.supabaseUrl,config.supabaseKey);setDb(client);setConfigured(true);
   const {data}=client.auth.onAuthStateChange((_event,next)=>{setSession(next);if(!next){setCampaigns([]);setSelected(null);setEditor(false);setDraft(newDraft());}});unsubscribe=()=>data.subscription.unsubscribe();
  }).catch(()=>setConfigured(false));
  return()=>{unsubscribe?.();window.removeEventListener('online',update);window.removeEventListener('offline',update);};
 },[]);
 async function api(path:string,options:RequestInit={}){
  const token=(await db?.auth.getSession())?.data.session?.access_token;
  const response=await fetch('/api/v1/'+path,{...options,headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`,...options.headers}});
  const body=await response.json();if(!response.ok)throw new Error(body.error==='VERSION_CONFLICT'?'This draft changed elsewhere. Reload it before saving.':body.error??'Request failed');return body.data;
 }
 useEffect(()=>{if(session)api('campaigns').then(setCampaigns).catch(e=>setNotice(e.message));},[session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps
 async function signIn(e:React.FormEvent){e.preventDefault();if(!db)return;setBusy(true);setNotice('');try{const result=await db.auth.signInWithPassword({email,password});if(result.error)setNotice(result.error.message);else{setAuthOpen(false);setNotice('Signed in. Your campaign drafts are ready.');}}catch{setNotice('Sign-in could not connect. Check your connection and try again.');}finally{setBusy(false);setPassword('');}}
 function createWorld(){pendingSave.current=null;setSelected(null);setDraft(newDraft());setEditor(true);setStep(0);setReview(false);setNotice('');}
 async function openWorld(id:string){setBusy(true);try{const saved=await api(`campaigns/${id}/draft`);pendingSave.current=null;setSelected(saved);setDraft(saved.draft);setEditor(true);setStep(0);setReview(false);}catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}
 async function save(){if(!session){setAuthOpen(true);return;}const parsed=DraftSchema.safeParse(draft);if(!parsed.success){setNotice(parsed.error.issues[0].message);return;}setBusy(true);setNotice('');try{
  const body=JSON.stringify({expectedVersion:selected?.draftVersion??0,document:parsed.data});
  if(!pendingSave.current||pendingSave.current.body!==body)pendingSave.current={id:selected?.id??pendingSave.current?.id??crypto.randomUUID(),key:crypto.randomUUID(),body};
  const pending=pendingSave.current;
  const saved=await api(`campaigns/${pending.id}/draft`,{method:'PUT',headers:{'Idempotency-Key':pending.key},body:pending.body});
  pendingSave.current=null;setSelected(saved);setCampaigns(await api('campaigns'));setNotice('Draft saved to your Supabase project.');
 }catch(e){setNotice((e as Error).message);}finally{setBusy(false);}}
 function field(key:keyof WorldDraft,value:string|boolean){setDraft(current=>({...current,[key]:value}));}
 const completed=sections.filter(([key])=>draft[key].trim()).length;
 return <div className="app-frame">
  <aside className="sidebar"><a className="brand" href="/" aria-label="Imperium home"><Landmark/><span>IMPERIUM<small>COUNCIL & COMMAND</small></span></a><div className="sidebar-label">THE CHAMBER</div><nav>{tabs.map(({name,icon:Icon},i)=><button key={name} className={tab===i?'nav-item active':'nav-item'} onClick={()=>{setTab(i);setEditor(false);}}><Icon size={18}/><span>{name}</span>{tab===i&&<span className="nav-dot"/>}</button>)}</nav><div className="sidebar-bottom"><button onClick={()=>setInfo('Archives preserve original events and decision history. Search and causal exploration will become available with the simulation engine.')}><BookOpen size={17}/> Imperial archives</button><button onClick={()=>setInfo('Private development build. AI providers are disabled. Supabase stores owner-scoped campaign drafts; full campaign simulation is still being built.')}><Settings2 size={17}/> Settings</button><div className="sidebar-note">A persistent world.<br/>A lasting consequence.</div></div></aside>
  <div className="main-wrap"><header className="topbar"><div className="breadcrumb">YOUR COMMAND <span>/</span> {editor?'WORLD CREATION':tabs[tab].name.toUpperCase()}</div><div className="top-actions"><span className="stage"><span/> FOUNDATION BUILD</span><button className="profile" onClick={()=>session?db?.auth.signOut():setAuthOpen(true)} title={session?'Sign out':'Sign in'}>{session?<LogOut size={16}/>:<span>DB</span>}</button></div></header>
  <main>
   {!online&&<div className="notice">You’re offline. The chamber is available; saving requires a connection.</div>}
   {notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss message"><X size={16}/></button></div>}
   {editor?<>
    <div className="page-heading"><div><div className="eyebrow">THE FOUNDATIONS OF A WORLD</div><h1>{draft.name||'Create your world'}</h1><p>Define the nation you will govern. Every detail becomes part of its story.</p></div><button className="button secondary" onClick={()=>setEditor(false)}><ArrowLeft size={16}/> Back</button></div>
    <div className="editor-layout"><aside className="steps"><button className={step===0?'selected':''} onClick={()=>{setStep(0);setReview(false);}}>01 <span>Campaign basics</span></button>{sections.map(([key,title],i)=><button key={key} className={step===i+1?'selected':''} onClick={()=>{setStep(i+1);setReview(false);}}>{String(i+2).padStart(2,'0')} <span>{title}</span>{draft[key].trim()&&<Check size={14}/>}</button>)}<button className={review?'selected':''} onClick={()=>setReview(true)}>10 <span>Review world</span></button></aside>
    <section className="editor-panel">{review?<><div className="eyebrow">REVIEW WORLD</div><h2>Your world, before the first day</h2><p>{completed} of {sections.length} domain notes complete. This first build saves setup notes; structured validation and Begin Reign are not enabled yet.</p><ul className="review-list">{reviewDraft(draft).map(item=><li key={item}>{item}</li>)}</ul></>:step===0?<><div className="eyebrow">01 / CAMPAIGN BASICS</div><h2>Where does your reign begin?</h2><p>The more detail you provide during World Creation, the more consistent and realistic the simulation can be.</p><div className="form-grid"><label>Campaign name<input value={draft.name} onChange={e=>field('name',e.target.value)} placeholder="Imperial Roman Republic — Main Campaign" maxLength={120}/></label><label>Simulation start date<input type="date" value={draft.startDate} onChange={e=>field('startDate',e.target.value)}/></label><label>Your nation<input value={draft.nation} onChange={e=>field('nation',e.target.value)} placeholder="Imperial Roman Republic"/></label><label>Your office<input value={draft.role} onChange={e=>field('role',e.target.value)} placeholder="Emperor"/></label><label>Default time advance<select value={draft.duration} onChange={e=>field('duration',e.target.value)}>{['3 days','1 week','2 weeks','1 month','3 months','6 months'].map(x=><option key={x}>{x}</option>)}</select></label><label className="checkbox-label"><input type="checkbox" checked={draft.grounding} onChange={e=>field('grounding',e.target.checked)}/> Request historical grounding</label></div><div className="field-note">Meetings take no game time. Time passes only when you end the turn. Historical data import is not connected yet.</div></>:<><div className="eyebrow">{String(step+1).padStart(2,'0')} / WORLD DEFINITION</div><h2>{sections[step-1][1]}</h2><p>{sections[step-1][2]}</p><label className="long-form">Your setup notes<textarea rows={13} value={draft[sections[step-1][0]]} onChange={e=>field(sections[step-1][0],e.target.value)} placeholder="Describe your intended world. Include exact figures and rules where you know them; leave unknowns explicit." maxLength={20000}/></label><div className="field-note">These are draft notes, not canonical simulation state. AI-assisted conversion and detailed forms are still in development.</div></>}
    <div className="editor-footer"><span>{selected?`Saved draft · version ${selected.draftVersion}`:'Unsaved draft'}</span><div><button className="button secondary" onClick={()=>{setStep(Math.min(8,step+1));setReview(step===8);}}>Next section <ChevronRight size={15}/></button><button className="button primary" disabled={busy||!online} onClick={save}><Save size={16}/>{busy?'Saving…':'Save draft'}</button></div></div></section></div>
   </>:tab===0?<>
    <div className="page-heading"><div><div className="eyebrow">WELCOME TO THE CHAMBER</div><h1>Every decision leaves a legacy.</h1><p>Your council awaits. The world will remember.</p></div><span className="edition">VOL. I <span>—</span> THE BEGINNING</span></div>
    <section className="hero"><div className="hero-grain"/><div className="hero-copy"><div className="hero-kicker"><span/> A NEW REIGN</div><h2>A world of ambition.<br/>A seat of consequence.</h2><p>Build a nation. Assemble your council. Navigate a world with motives of its own.</p><button className="button gold" onClick={createWorld}>Create new world <ArrowUpRight size={18}/></button><div className="hero-caption">YOUR WORLD. YOUR AUTHORITY. YOUR HISTORY.</div></div><div className="architecture-art" aria-hidden="true"><div className="art-sun"/><div className="pediment"/><div className="entablature"/><div className="columns">{[1,2,3,4,5].map(x=><div className="column" key={x}><i/><b/><i/></div>)}</div><div className="temple-base"/><div className="art-caption">SENATUS · POPULUS · IMPERIUM</div></div></section>
    <div className="section-heading"><h2>Your campaigns <span>{campaigns.length.toString().padStart(2,'0')}</span></h2><button className="text-button" onClick={createWorld}>New campaign <Plus size={16}/></button></div>
    {campaigns.length?<div className="campaign-grid">{campaigns.map(c=><button className="campaign-card" key={c.id} onClick={()=>openWorld(c.id)}><span className="campaign-icon"><Landmark/></span><div><span className="eyebrow">WORLD DRAFT</span><h3>{c.name}</h3><p>{c.simTime.slice(0,10)} · Continue world creation</p></div><ChevronRight size={18}/></button>)}</div>:<section className="empty-state"><div className="empty-emblem"><Compass size={28}/></div><div><h3>Your history is yet to be written.</h3><p>{session?'Create your first campaign to begin defining your world.':'Create a world draft, then sign in to save it across devices.'}</p></div><button className="button secondary" onClick={session?createWorld:()=>setAuthOpen(true)}>{session?'Begin world creation':'Sign in to save'}<ChevronRight size={15}/></button></section>}
    <div className="section-heading"><h2>The principles of your reign</h2><span className="small-muted">BUILT FOR CONSEQUENCE</span></div><div className="principles"><article><span className="principle-number">I.</span><h3>A world that remembers</h3><p>Policies, alliances and rivalries form causal threads that endure across years.</p><span>LONG-TERM MEMORY</span></article><article><span className="principle-number">II.</span><h3>Power with limits</h3><p>Institutions, politics and hard inventories constrain every strategic ambition.</p><span>CANONICAL WORLD STATE</span></article><article><span className="principle-number">III.</span><h3>Knowledge, not omniscience</h3><p>Trust your assessments. Read the signals. Other actors keep their own counsel.</p><span>INDEPENDENT ACTOR AGENCY</span></article></div>
   </>:<><div className="page-heading"><div><div className="eyebrow">{domains[tab-1].eyebrow}</div><h1>{domains[tab-1].title}</h1><p>{domains[tab-1].copy}</p></div></div><div className="domain-empty"><div className="domain-seal">{(()=>{const Icon=tabs[tab].icon;return <Icon size={52}/>;})()}</div><h2>The operating picture begins with your world.</h2><p>There is no active campaign yet. This screen will show campaign-specific, player-known information when the simulation engine is connected.</p><button className="button gold" onClick={createWorld}>Define your world <ArrowUpRight size={16}/></button></div><div className="domain-features">{domains[tab-1].items.map(item=><div key={item}><span className="status-ring"/><span>{item}</span><small>IN DEVELOPMENT</small></div>)}</div></>}
   <footer><span>IMPERIUM <span className="footer-divider">/</span> COUNCIL & COMMAND</span><button onClick={()=>setInfo('Foundation build: campaign drafts and secure storage are being connected. Simulation, AI council, maps and Begin Reign are not available yet. No paid model calls are made.')}><CircleHelp size={14}/> About this build</button></footer>
  </main></div><nav className="mobile-nav">{tabs.map(({name,icon:Icon},i)=><button key={name} className={tab===i?'active':''} onClick={()=>{setTab(i);setEditor(false);}} aria-label={name}><Icon size={21}/><span>{['Home','Map','Military','Government','Finance'][i]}</span></button>)}</nav>
  {authOpen&&<div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
   <button className="close" onClick={()=>{setAuthOpen(false);setPassword('');}} aria-label="Close sign in"><X/></button>
   <Landmark className="modal-mark"/><div className="eyebrow">YOUR PRIVATE CHAMBER</div><h2 id="auth-title">Welcome back.</h2>
   <p>Sign in with your game account to save and resume campaign drafts. This is separate from your Supabase dashboard login.</p>
   {notice&&<div className="notice" role="alert">{notice}</div>}
   {configured===false?<div className="notice">Authentication is awaiting project configuration. Your draft can still be edited in this session.</div>:<form onSubmit={signIn}>
    <label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
    <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
    <button className="button gold" disabled={busy||!db}>{busy?'Signing in…':'Sign in'}<ArrowUpRight size={16}/></button>
   </form>}
  </section></div>}
  {info&&<div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label="Build information"><button className="close" onClick={()=>setInfo(null)} aria-label="Close information"><X/></button><div className="eyebrow">FOUNDATION BUILD</div><h2>Built in deliberate stages.</h2><p>{info}</p><button className="button secondary" onClick={()=>setInfo(null)}>Return to the chamber</button></section></div>}
 </div>;
}
