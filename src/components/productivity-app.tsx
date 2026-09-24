import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Check, CheckCircle2, ChevronRight, Clipboard, Clock3, FileText,
  LayoutDashboard, ListTodo, Mail, Menu, PanelLeftClose, PanelLeftOpen, Plus,
  RotateCcw, Settings, Sparkles, Target, Trash2, TrendingUp, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const views = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "email", label: "Email Generator", icon: Mail },
  { id: "meeting", label: "Meeting Summarizer", icon: FileText },
  { id: "planner", label: "Task Planner", icon: ListTodo },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
type View = (typeof views)[number]["id"];
type Task = { id: number; title: string; duration: string; urgency: "Low" | "Medium" | "High"; importance: "Low" | "Medium" | "High"; done: boolean };

type SavedState = {
  name: string;
  role: string;
  email: { recipient: string; subject: string; purpose: string; keyPoints: string; tone: string; output: string };
  meeting: { notes: string; summary: string; actions: string; decisions: string; deadlines: string };
  tasks: Task[];
  notifications: boolean;
};

const initialState: SavedState = {
  name: "Aphiwe Mashiya",
  role: "Product Manager",
  email: { recipient: "", subject: "", purpose: "", keyPoints: "", tone: "Friendly", output: "" },
  meeting: { notes: "", summary: "", actions: "", decisions: "", deadlines: "" },
  tasks: [
    { id: 1, title: "Review Q4 roadmap", duration: "45 min", urgency: "High", importance: "High", done: false },
    { id: 2, title: "Reply to design feedback", duration: "25 min", urgency: "Medium", importance: "High", done: true },
    { id: 3, title: "Prepare weekly update", duration: "30 min", urgency: "Low", importance: "Medium", done: false },
  ],
  notifications: true,
};

const priorityScore = (task: Task) => ({ Low: 1, Medium: 2, High: 3 }[task.urgency] * 2 + { Low: 1, Medium: 2, High: 3 }[task.importance]);
const firstName = (value: string) => value.trim().split(/\s+/)[0] || "there";

export function ProductivityApp() {
  const [view, setView] = useState<View>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [state, setState] = useState<SavedState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai-workplace-state");
      if (saved) setState({ ...initialState, ...JSON.parse(saved) });
    } catch { /* keep defaults */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem("ai-workplace-state", JSON.stringify(state));
  }, [state, hydrated]);

  const navigate = (next: View) => {
    if (view === "email" && next !== "email") setState((s) => ({ ...s, email: initialState.email }));
    setView(next);
    setMobileOpen(false);
  };
  const completed = state.tasks.filter((task) => task.done).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-300 ${collapsed ? "w-[88px]" : "w-[260px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
          <button className="flex min-w-0 items-center gap-3" onClick={() => navigate("dashboard")} aria-label="Open dashboard">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand"><Sparkles size={19} /></span>
            {!collapsed && <span className="truncate text-left text-base font-bold text-sidebar-foreground">AI Workplace</span>}
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-6" aria-label="Main navigation">
          {views.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} title={collapsed ? item.label : undefined} onClick={() => navigate(item.id)} className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${view === item.id ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}><Icon size={19} className="shrink-0" />{!collapsed && <span>{item.label}</span>}</button>;
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className={`flex items-center gap-3 rounded-lg bg-sidebar-accent p-3 ${collapsed ? "justify-center" : ""}`}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-avatar text-sm font-bold text-avatar-foreground">{firstName(state.name).slice(0, 1).toUpperCase()}</span>
            {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold text-sidebar-foreground">{state.name}</p><p className="truncate text-xs text-sidebar-muted">{state.role}</p></div>}
          </div>
          <Button variant="ghost" size="icon" className="mt-2 hidden w-full text-sidebar-muted lg:flex" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
        </div>
      </aside>

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-[88px]" : "lg:pl-[260px]"}`}>
        <header className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></Button>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{views.find((item) => item.id === view)?.label}</p><p className="hidden text-xs text-muted-foreground sm:block">AI can make mistakes. Always review before professional use.</p></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success sm:flex"><span className="size-1.5 rounded-full bg-success" />Local mode</span><button onClick={() => navigate("settings")} className="grid size-9 place-items-center rounded-full bg-avatar text-sm font-bold text-avatar-foreground" aria-label="Open settings">{firstName(state.name).slice(0, 1).toUpperCase()}</button></div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          {view === "dashboard" && <Dashboard name={state.name} completed={completed} tasks={state.tasks} navigate={navigate} />}
          {view === "email" && <EmailGenerator state={state} setState={setState} />}
          {view === "meeting" && <MeetingSummarizer state={state} setState={setState} />}
          {view === "planner" && <TaskPlanner tasks={state.tasks} setTasks={(tasks) => setState((s) => ({ ...s, tasks }))} />}
          {view === "settings" && <SettingsView state={state} setState={setState} />}
        </main>
        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">AI-generated content may require review. Verify important information before use.</footer>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p></div>;
}

function Dashboard({ name, completed, tasks, navigate }: { name: string; completed: number; tasks: Task[]; navigate: (v: View) => void }) {
  const stats = [
    { label: "Time saved", value: "4.2 hrs", change: "+18% this week", icon: Clock3, tone: "pink" },
    { label: "Tasks completed", value: `${completed + 11}`, change: "3 ahead of target", icon: CheckCircle2, tone: "blue" },
    { label: "Focus score", value: "87%", change: "+6% from last week", icon: Target, tone: "purple" },
    { label: "AI assists", value: "23", change: "8 today", icon: Sparkles, tone: "green" },
  ];
  const actions = [
    { id: "email" as View, title: "Draft an email", text: "Write a clear, on-brand message", icon: Mail },
    { id: "meeting" as View, title: "Summarize notes", text: "Turn discussion into next steps", icon: FileText },
    { id: "planner" as View, title: "Plan my day", text: "Prioritize the work that matters", icon: CalendarDays },
  ];
  return <>
    <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">Thursday, 24 September</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good afternoon, {firstName(name)}.</h1><p className="mt-2 text-muted-foreground">You’re making strong progress. Let’s keep the momentum going.</p></div><Button onClick={() => navigate("planner")} className="w-fit"><Plus /> Plan a task</Button></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, change, icon: Icon, tone }) => <div className="rounded-xl border border-border bg-card p-5 shadow-soft" key={label}><div className={`mb-5 grid size-10 place-items-center rounded-lg metric-${tone}`}><Icon size={19} /></div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-2 text-xs font-medium text-success">{change}</p></div>)}</section>
    <div className="mt-7 grid gap-7 xl:grid-cols-[1.35fr_.9fr]">
      <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">Quick actions</h2><p className="text-sm text-muted-foreground">Start with your most-used tools</p></div></div><div className="grid gap-4 md:grid-cols-3">{actions.map(({ id, title, text, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className="group min-h-44 rounded-xl border border-border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"><span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary"><Icon size={20} /></span><h3 className="mt-6 font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p><ChevronRight className="mt-4 text-primary transition-transform group-hover:translate-x-1" size={17} /></button>)}</div></section>
      <section className="rounded-xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Today’s focus</h2><p className="text-sm text-muted-foreground">Your highest-impact work</p></div><button onClick={() => navigate("planner")} className="text-xs font-semibold text-primary">View planner</button></div><div className="mt-5 space-y-3">{tasks.slice(0, 3).map((task, index) => <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-muted p-3" key={task.id}><span className="grid size-8 place-items-center rounded-md bg-card text-xs font-bold text-primary">{index + 1}</span><div className="min-w-0"><p className={`truncate text-sm font-semibold ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</p><p className="text-xs text-muted-foreground">{task.duration}</p></div><span className={`priority priority-${task.urgency.toLowerCase()}`}>{task.urgency}</span></div>)}</div></section>
    </div>
    <section className="mt-7 rounded-xl border border-border bg-card p-5 shadow-soft"><h2 className="text-lg font-bold">Recent activity</h2><div className="mt-4 grid gap-2 md:grid-cols-3">{[
      ["Email created", "Project status update", "12 min ago"], ["Notes summarized", "Q4 roadmap sync", "Yesterday"], ["Plan updated", "Weekly priority plan", "Monday"],
    ].map(([title, detail, time], index) => <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted" key={title}><span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">{index === 0 ? <Mail size={16}/> : index === 1 ? <FileText size={16}/> : <ListTodo size={16}/>}</span><div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="truncate text-xs text-muted-foreground">{detail} · {time}</p></div></div>)}</div></section>
  </>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}</label>; }
function ToolLayout({ heading, form, output }: { heading: React.ReactNode; form: React.ReactNode; output: React.ReactNode }) { return <>{heading}<div className="grid gap-6 xl:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]"><section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">{form}</section><section className="min-h-[540px] rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">{output}</section></div></>; }
function LoadingBlock({ label }: { label: string }) { return <div className="grid min-h-[430px] place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-xl bg-primary-soft text-primary"><Sparkles className="animate-pulse" /></span><p className="mt-4 font-semibold">{label}</p><p className="mt-1 text-sm text-muted-foreground">Turning your input into clear, useful work…</p><div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-muted"><span className="block h-full w-2/3 animate-progress rounded-full bg-primary" /></div></div></div>; }
function EmptyBlock({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) { return <div className="grid min-h-[430px] place-items-center text-center"><div className="max-w-xs"><span className="mx-auto grid size-14 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon /></span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></div>; }

function EmailGenerator({ state, setState }: { state: SavedState; setState: React.Dispatch<React.SetStateAction<SavedState>> }) {
  const [loading, setLoading] = useState(false); const email = state.email;
  const update = (key: keyof typeof email, value: string) => setState((s) => ({ ...s, email: { ...s.email, [key]: value } }));
  const generate = () => {
    if (!email.recipient || !email.subject || !email.purpose) { toast.error("Add a recipient, subject, and purpose first."); return; }
    setLoading(true); setTimeout(() => {
      const greeting = email.tone === "Formal" ? `Dear ${firstName(email.recipient)},` : `Hi ${firstName(email.recipient)},`;
      const opening = email.tone === "Persuasive" ? `I’m reaching out because ${email.purpose.toLowerCase()}, and I believe this is a timely opportunity for us to move forward.` : email.tone === "Formal" ? `I am writing regarding ${email.purpose.toLowerCase()}.` : `I wanted to connect about ${email.purpose.toLowerCase()}.`;
      const points = email.keyPoints.split(/\n|,/).map((p) => p.trim()).filter(Boolean).map((p) => `• ${p}`).join("\n");
      const close = email.tone === "Formal" ? "Please let me know if you require any additional information.\n\nKind regards," : email.tone === "Persuasive" ? "Could we take the next step this week? I’m happy to make the process easy from here.\n\nBest," : "Let me know what works for you—I’m happy to help.\n\nBest,";
      update("output", `${email.subject}\n\n${greeting}\n\n${opening}${points ? `\n\nHere are the key details:\n${points}` : ""}\n\n${close}\n${state.name}`); setLoading(false); toast.success("Your email draft is ready.");
    }, 850);
  };
  const clear = () => { setState((s) => ({ ...s, email: initialState.email })); toast("Email workspace cleared."); };
  return <ToolLayout heading={<PageHeading eyebrow="Writing assistant" title="Smart Email Generator" description="Turn a few details into a polished email that still sounds like you." />} form={<div className="space-y-5"><Field label="Recipient"><Input value={email.recipient} onChange={(e) => update("recipient", e.target.value)} placeholder="e.g. Sarah Johnson" /></Field><Field label="Subject"><Input value={email.subject} onChange={(e) => update("subject", e.target.value)} placeholder="e.g. Q4 roadmap follow-up" /></Field><Field label="Purpose"><Textarea value={email.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="What should this email achieve?" className="min-h-24" /></Field><Field label="Key points" hint="Add one point per line for the clearest result."><Textarea value={email.keyPoints} onChange={(e) => update("keyPoints", e.target.value)} placeholder={"Share the revised timeline\nConfirm owner approvals\nSchedule a review for Friday"} className="min-h-28" /></Field><Field label="Tone"><div className="grid grid-cols-3 gap-2">{["Formal", "Friendly", "Persuasive"].map((tone) => <button type="button" key={tone} onClick={() => update("tone", tone)} className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition ${email.tone === tone ? "border-primary bg-primary-soft text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`}>{tone}</button>)}</div></Field><Button className="h-11 w-full" onClick={generate} disabled={loading}><Sparkles />{loading ? "Writing…" : "Generate email"}</Button></div>} output={<>{loading ? <LoadingBlock label="Drafting your email" /> : email.output ? <div><div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div><h2 className="font-bold">Your draft</h2><p className="text-xs text-muted-foreground">Edit anything before you send it.</p></div><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Copy email" onClick={() => { navigator.clipboard.writeText(email.output); toast.success("Email copied to clipboard."); }}><Clipboard /></Button><Button variant="ghost" size="icon" aria-label="Clear email" onClick={clear}><Trash2 /></Button></div></div><Textarea aria-label="Generated email" value={email.output} onChange={(e) => update("output", e.target.value)} className="min-h-[430px] resize-none bg-muted/50 leading-7" /></div> : <EmptyBlock icon={Mail} title="Your polished email will appear here" text="Complete the fields and choose a tone. You’ll get an editable draft tailored to your purpose." />}</>} />;
}

function MeetingSummarizer({ state, setState }: { state: SavedState; setState: React.Dispatch<React.SetStateAction<SavedState>> }) {
  const [loading, setLoading] = useState(false); const meeting = state.meeting;
  const update = (key: keyof typeof meeting, value: string) => setState((s) => ({ ...s, meeting: { ...s.meeting, [key]: value } }));
  const generate = () => { if (meeting.notes.trim().length < 30) { toast.error("Add a little more meeting context first."); return; } setLoading(true); setTimeout(() => { const sentences = meeting.notes.split(/[.!?]\n?\s*/).map(s => s.trim()).filter(Boolean); update("summary", `The team aligned on ${sentences.slice(0, 2).join(". ").toLowerCase()}. The discussion focused on execution, ownership, and the next milestone.`); update("actions", sentences.filter(s => /will|need|action|send|prepare|review|follow/i.test(s)).slice(0, 4).map((s, i) => `${i + 1}. ${s}`).join("\n") || `1. ${state.name} to circulate the updated plan.\n2. Team leads to confirm owners and dependencies.\n3. Schedule a progress check-in.`); update("decisions", sentences.filter(s => /decid|agree|approve|confirm/i.test(s)).slice(0, 3).map(s => `• ${s}`).join("\n") || "• Proceed with the agreed priorities.\n• Review progress at the next team check-in."); update("deadlines", sentences.filter(s => /monday|tuesday|wednesday|thursday|friday|week|today|tomorrow|date/i.test(s)).slice(0, 3).map(s => `• ${s}`).join("\n") || "• Initial updates: end of this week\n• Progress review: next team meeting"); setLoading(false); toast.success("Meeting notes summarized."); }, 900); };
  const outputReady = meeting.summary;
  return <ToolLayout heading={<PageHeading eyebrow="Meeting intelligence" title="Meeting Notes Summarizer" description="Capture what mattered, what was decided, and exactly what happens next." />} form={<div><Field label="Meeting notes" hint="Paste rough notes, a transcript, or your own shorthand."><Textarea value={meeting.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Example: The team agreed to move the launch to 15 October. Naledi will update the campaign plan by Friday…" className="min-h-[380px] leading-6" /></Field><div className="mt-5 flex gap-2"><Button className="h-11 flex-1" onClick={generate} disabled={loading}><Sparkles />{loading ? "Analyzing…" : "Summarize notes"}</Button><Button variant="outline" size="icon" className="size-11" aria-label="Clear notes" onClick={() => setState((s) => ({ ...s, meeting: initialState.meeting }))}><Trash2 /></Button></div></div>} output={<>{loading ? <LoadingBlock label="Finding decisions and next steps" /> : outputReady ? <div className="space-y-5">{([['summary','Summary'],['actions','Action Items'],['decisions','Decisions'],['deadlines','Deadlines']] as const).map(([key,label]) => <Field key={key} label={label}><Textarea value={meeting[key]} onChange={(e) => update(key, e.target.value)} className={key === "summary" ? "min-h-28" : "min-h-24"} /></Field>)}<Button variant="outline" onClick={() => { navigator.clipboard.writeText(`Summary\n${meeting.summary}\n\nAction Items\n${meeting.actions}\n\nDecisions\n${meeting.decisions}\n\nDeadlines\n${meeting.deadlines}`); toast.success("Meeting summary copied."); }}><Clipboard /> Copy all</Button></div> : <EmptyBlock icon={FileText} title="Clear outcomes, not more notes" text="Your summary, decisions, action items, and deadlines will appear here as editable sections." />}</>} />;
}

function TaskPlanner({ tasks, setTasks }: { tasks: Task[]; setTasks: (tasks: Task[]) => void }) {
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily"); const [title, setTitle] = useState(""); const [duration, setDuration] = useState("30 min"); const [urgency, setUrgency] = useState<Task["urgency"]>("Medium"); const [importance, setImportance] = useState<Task["importance"]>("High"); const [loading, setLoading] = useState(false);
  const sorted = useMemo(() => [...tasks].sort((a,b) => Number(a.done)-Number(b.done) || priorityScore(b)-priorityScore(a)), [tasks]);
  const add = () => { if (!title.trim()) { toast.error("Name the task you want to plan."); return; } setTasks([...tasks, { id: Date.now(), title: title.trim(), duration, urgency, importance, done: false }]); setTitle(""); toast.success("Task added and prioritized."); };
  const optimize = () => { if (!tasks.length) { toast.error("Add a task before optimizing your plan."); return; } setLoading(true); setTimeout(() => { setTasks(sorted); setLoading(false); toast.success(`${mode} plan optimized around impact and urgency.`); }, 700); };
  return <><PageHeading eyebrow="Priority planner" title="AI Task Planner" description="Shape a realistic plan around urgency, importance, and the time you actually have." /><div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"><section className="rounded-xl border border-border bg-card p-5 shadow-soft"><div className="grid grid-cols-2 rounded-lg bg-muted p-1">{["Daily","Weekly"].map((item) => <button key={item} onClick={() => setMode(item as typeof mode)} className={`rounded-md py-2 text-sm font-semibold transition ${mode === item ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}>{item}</button>)}</div><div className="mt-6 space-y-5"><Field label="Task"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Finalize launch brief" onKeyDown={(e) => e.key === "Enter" && add()} /></Field><Field label="Estimated time"><select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option>15 min</option><option>30 min</option><option>45 min</option><option>1 hour</option><option>2 hours</option></select></Field><Choice label="Urgency" value={urgency} setValue={(v) => setUrgency(v as Task["urgency"])} /><Choice label="Importance" value={importance} setValue={(v) => setImportance(v as Task["importance"])} /><Button className="h-11 w-full" onClick={add}><Plus /> Add task</Button></div></section><section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div className="min-w-0"><h2 className="truncate text-lg font-bold">{mode} focus plan</h2><p className="text-sm text-muted-foreground">{tasks.filter(t => !t.done).length} tasks remaining · ordered by impact</p></div><Button variant="outline" onClick={optimize} disabled={loading}><Sparkles /> <span className="hidden sm:inline">{loading ? "Optimizing…" : "Optimize"}</span></Button></div><div className="relative mt-7 space-y-3 before:absolute before:bottom-5 before:left-[18px] before:top-5 before:w-px before:bg-border">{sorted.length ? sorted.map((task, index) => <div key={task.id} className="relative grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background p-3.5"><button aria-label={task.done ? "Mark incomplete" : "Mark complete"} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))} className={`z-10 grid size-9 place-items-center rounded-full border ${task.done ? "border-success bg-success text-success-foreground" : "border-primary/30 bg-primary-soft text-primary"}`}>{task.done ? <Check size={16}/> : <span className="text-xs font-bold">{index+1}</span>}</button><div className="min-w-0"><Input value={task.title} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t,title:e.target.value}:t))} className={`h-7 border-0 px-0 font-semibold shadow-none focus-visible:ring-0 ${task.done ? "line-through text-muted-foreground" : ""}`} /><div className="mt-1 flex flex-wrap gap-2"><span className="text-xs text-muted-foreground"><Clock3 className="mr-1 inline" size={12}/>{task.duration}</span><span className={`priority priority-${task.urgency.toLowerCase()}`}>{task.urgency} urgency</span><span className="priority bg-secondary text-secondary-foreground">{task.importance} impact</span></div></div><Button variant="ghost" size="icon" aria-label="Delete task" onClick={() => { setTasks(tasks.filter(t => t.id !== task.id)); toast("Task removed."); }}><Trash2 /></Button></div>) : <EmptyBlock icon={ListTodo} title="Your plan is wide open" text="Add your first task and it will be placed according to urgency and impact." />}</div></section></div></>;
}
function Choice({ label, value, setValue }: { label: string; value: string; setValue: (value:string)=>void }) { return <Field label={label}><div className="grid grid-cols-3 gap-2">{["Low","Medium","High"].map(item => <button key={item} onClick={() => setValue(item)} className={`rounded-lg border py-2 text-xs font-semibold ${value === item ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground"}`}>{item}</button>)}</div></Field>; }

function SettingsView({ state, setState }: { state: SavedState; setState: React.Dispatch<React.SetStateAction<SavedState>> }) {
  return <><PageHeading eyebrow="Preferences" title="Settings" description="Personalize how your local assistant addresses you and manages your workspace." /><div className="max-w-3xl space-y-6"><section className="rounded-xl border border-border bg-card p-6 shadow-soft"><h2 className="text-lg font-bold">Profile</h2><p className="mt-1 text-sm text-muted-foreground">Used to personalize generated content and greetings.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Your name"><Input value={state.name} onChange={(e) => setState(s => ({...s,name:e.target.value}))} /></Field><Field label="Role"><Input value={state.role} onChange={(e) => setState(s => ({...s,role:e.target.value}))} /></Field></div><Button className="mt-5" onClick={() => toast.success("Preferences saved locally.")}><Check /> Save preferences</Button></section><section className="rounded-xl border border-border bg-card p-6 shadow-soft"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><div><h2 className="font-bold">Productivity reminders</h2><p className="mt-1 text-sm text-muted-foreground">Show helpful local prompts while you work.</p></div><Switch checked={state.notifications} onCheckedChange={(checked) => setState(s => ({...s,notifications:checked}))} /></div></section><section className="rounded-xl border border-destructive/20 bg-card p-6"><h2 className="font-bold">Reset workspace</h2><p className="mt-1 text-sm text-muted-foreground">Remove drafts, notes, tasks, and preferences stored in this browser.</p><Button variant="outline" className="mt-5 text-destructive" onClick={() => { setState(initialState); localStorage.removeItem("ai-workplace-state"); toast.success("Workspace reset."); }}><RotateCcw /> Reset local data</Button></section></div></>;
}
