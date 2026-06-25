import { db } from "@/db";
import { aiChats } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Smart dictionary of topics, analogies, and scientific explanations for our AI Brain Coach
const NEURO_KNOWLEDGE_BASE: Record<string, {
  title: string;
  analogy: string;
  explanation: string;
  strategies: string[];
  terms: string[];
  related: { title: string; href: string }[];
}> = {
  procrastination: {
    title: "The Neuroscience of Procrastination",
    analogy: "The Anterior Cingulate Cortex (ACC) is like an accountant with a calculator, while your Amygdala is a toddler crying for a cookie.",
    explanation: "Procrastination is not a time-management issue; it's an emotional-regulation issue. Your ACC calculates the effort required for a hard task and compares it to the expected reward. If the task is abstract or far in the future, your ACC sees a low reward but high effort, causing mental friction. Your Amygdala senses this friction as a threat (stress) and triggers an urge to escape. Procrastinating on social media or video games releases immediate dopamine, which relieves the threat temporarily. This teaches your Basal Ganglia to make procrastination your default automated routine.",
    strategies: [
      "**The 2-Minute Rule**: Tell yourself you'll only work for 120 seconds. This lowers the 'activation cost' calculated by your ACC, helping you bypass the initial friction.",
      "**Gamify the Reward**: Connect completion of a small work block with an immediate dopamine treat (like a favorite drink or walk).",
      "**Reduce Visual Cues**: Place your phone in another room. By removing the immediate cue of instant dopamine, you prevent the habit loop from initiating."
    ],
    terms: ["Anterior Cingulate Cortex (ACC)", "Basal Ganglia", "Dopamine", "Reward Prediction Error"],
    related: [
      { title: "The ACC & Effort", href: "/topics/anterior-cingulate-cortex-effort" },
      { title: "The Habit Loop", href: "/topics/habit-loop-basal-ganglia" }
    ]
  },
  memory: {
    title: "How to Optimize Your Brain's Memory Circuits",
    analogy: "Your Hippocampus is a temporary shipping dock, while your Neocortex is a massive permanent warehouse.",
    explanation: "To store a memory, two neurons must communicate repeatedly until physical changes occur. This is called Long-Term Potentiation (LTP)—or Hebb's Law: 'neurons that fire together, wire together'. When you learn something new, it's stored temporarily in the Hippocampus. But the dock has limited space. During deep, non-REM sleep, the hippocampus replays these signals to the Neocortex (consolidation), moving them into permanent storage. Passive reading doesn't trigger the protein synthesis required to build these pathways; only active recall (forcing your brain to retrieve the information) does.",
    strategies: [
      "**Active Recall**: Instead of highlighting and rereading, close the book and quiz yourself. This forces the synapses to fire, triggering LTP.",
      "**Spaced Repetition**: Review the material right when you are about to forget it (e.g., 1 day, 3 days, 1 week, 1 month later) to signal your brain that this pathway must be permanently insulated.",
      "**Prioritize Slow-Wave Sleep**: Sleeping is when your brain actually clicks 'Save' on your memories. Cutting sleep short erases the day's cognitive progress."
    ],
    terms: ["Long-Term Potentiation (LTP)", "Hippocampus", "Neocortex", "Memory Consolidation"],
    related: [
      { title: "Long-Term Potentiation (LTP)", href: "/topics/long-term-potentiation" },
      { title: "The Spacing Effect", href: "/topics/spacing-effect-synaptic-consolidation" }
    ]
  },
  phone: {
    title: "Why You Can't Stop Checking Your Phone",
    analogy: "Your smartphone is a digital slot machine tucked in your pocket.",
    explanation: "Every swipe down a feed calculates a 'Reward Prediction Error' (RPE) in your brain. If you check your phone and get a boring email, dopamine stays flat. But if you check and see a funny meme, an exciting text, or a new follower, your brain registers a 'Positive Prediction Error' and spikes dopamine. Because you cannot predict *when* you will get an exciting notification, your brain is kept in a state of constant seeking. The anticipation of the reward releases far more dopamine than the reward itself, automating the habit loop in your Basal Ganglia.",
    strategies: [
      "**Greyscale Mode**: Turn your screen to greyscale. This removes the highly stimulating visual cues that trigger your Reticular Activating System (RAS).",
      "**Friction Addition**: Put your social apps in deep folders or delete them, requiring a browser login. This increases the ACC's calculated cost of execution.",
      "**Scheduled Checks**: Set specific, fixed times to check your phone (e.g., 12:00 PM and 5:00 PM), moving from a variable reward schedule to a predictable, flat dopamine response."
    ],
    terms: ["Reward Prediction Error (RPE)", "Basal Ganglia", "Reticular Activating System (RAS)", "Dopamine"],
    related: [
      { title: "Reward Prediction Error", href: "/topics/reward-prediction-error" },
      { title: "Prefrontal Control & Attention", href: "/topics/prefrontal-control-selective-attention" }
    ]
  },
  sleep: {
    title: "The Neurobiology of Deep Rest & Recovery",
    analogy: "Sleep is like a nightly dishwasher cycle for your brain tissue.",
    explanation: "As you stay awake, your cells burn energy, accumulating a toxic byproduct called Adenosine. This builds up 'sleep pressure.' During deep non-REM sleep, the Glymphatic System becomes highly active: your brain cells shrink by 60%, allowing Cerebrospinal Fluid (CSF) to wash through the tissue like a dishwasher. This washes away adenosine and harmful proteins like beta-amyloid. In REM sleep, your brain completely shuts off noradrenaline (adrenaline), allowing your emotional centers to process traumatic or stressful events without physical panic, acting as overnight emotional therapy.",
    strategies: [
      "**View Morning Sunlight**: Get 10 minutes of direct outdoor light before 9 AM to stop melatonin production and set your body's circadian clock.",
      "**Maintain Caffeine Curfew**: Avoid caffeine after 12:00 PM. Caffeine blocks adenosine receptors but doesn't stop adenosine from accumulating, leading to a major crash later.",
      "**Cool Down Your Bedroom**: Your core body temperature must drop by 2-3 degrees Fahrenheit to initiate and sustain deep sleep."
    ],
    terms: ["Adenosine", "Glymphatic System", "REM Sleep", "Suprachiasmatic Nucleus"],
    related: [
      { title: "Adenosine & Sleep Pressure", href: "/topics/adenosine-sleep-pressure" },
      { title: "The Glymphatic System", href: "/topics/glymphatic-system-brain-wash" }
    ]
  },
  motivation: {
    title: "Restoring Your Brain's Baseline Motivation",
    analogy: "Your dopamine receptors are like sensitive ears that can become deafened by constant blasting music.",
    explanation: "Motivation is driven by the Mesolimbic Dopamine Pathway. When you chase a goal, the Ventral Tegmental Area (VTA) sprays dopamine into the Nucleus Accumbens, giving you focus, drive, and physical energy. However, chronic hyper-stimulation (scrolling short-form video, video games, constant sugar) floods your brain with dopamine. To protect itself from excitotoxicity, the brain pulls back its receptors (downregulation). Suddenly, normal tasks like studying, exercising, or reading feel terribly boring because you lack the receptor density to feel motivated by normal, healthy dopamine levels.",
    strategies: [
      "**Do a 'Dopamine Reset'**: Take a 24-48 hour break from hyper-stimulants (screens, video games, junk food). This allows your receptors to naturally migrate back to the cell surface, restoring sensitivity.",
      "**Embrace Boredom**: Let yourself sit in silence for 10 minutes without picking up your phone. This lowers your baseline stimulation threshold.",
      "**Focus on the Process**: Celebrate the effort rather than the end result. This keeps dopamine spikes flat and controlled, protecting your receptor density."
    ],
    terms: ["Mesolimbic Dopamine Pathway", "Receptor Downregulation", "Ventral Tegmental Area (VTA)", "Nucleus Accumbens"],
    related: [
      { title: "The Mesolimbic Dopamine Pathway", href: "/topics/mesolimbic-dopamine-pathway" },
      { title: "Dopamine Downregulation & Detox", href: "/topics/dopamine-detox-receptor-downregulation" }
    ]
  },
  stress: {
    title: "How to De-escalate the HPA Stress Axis",
    analogy: "The HPA axis is a fire alarm pull-station that doesn't care if there's a real fire or just a burnt piece of toast.",
    explanation: "When you perceive a threat, your Hypothalamic-Pituitary-Adrenal (HPA) axis activates. Your adrenal glands pump Cortisol and Adrenaline into your bloodstream, shutting down digestion and immunity while surging heart rate and blood sugar. While this is great for escaping a predator, chronic psychological stress keeps cortisol high. Over time, chronic cortisol acts like acid to your Hippocampus, stopping neurogenesis and shrinking memory density. Meanwhile, it causes your Amygdala (fear center) to grow more branches, keeping you in a state of high anxiety and hyper-vigilance.",
    strategies: [
      "**The Physiological Sigh**: Take two quick, consecutive inhales through your nose, followed by a long, slow exhale through your mouth. Doing this twice instantly triggers your parasympathetic nervous system, slowing down heart rate via the vagus nerve.",
      "**Cognitive Appraisal**: Reframe stress. Tell yourself: 'My pounding heart isn't fear; it's my brain delivering oxygen so I can perform at my peak.'",
      "**Vagus Nerve Stimulation**: Splashing cold water on your face or humming loudly vibrates the vocal cords, stimulating the vagus nerve to slow down your HPA stress chemicals."
    ],
    terms: ["HPA Axis", "Cortisol", "Amygdala", "Physiological Sigh", "Vagus Nerve"],
    related: [
      { title: "The HPA Axis & Cortisol", href: "/topics/hpa-axis-cortisol-stress" },
      { title: "Chronic Stress & Brain Remodeling", href: "/topics/chronic-stress-brain-damage" }
    ]
  }
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.toLowerCase().trim();
    
    // Find matching topic from our smart dictionary
    let matchedKey = "procrastination"; // Default response topic if no keywords match
    
    if (cleanQuery.includes("procrastinat") || cleanQuery.includes("lazy") || cleanQuery.includes("focus") || cleanQuery.includes("distract")) {
      matchedKey = "procrastination";
    } else if (cleanQuery.includes("memory") || cleanQuery.includes("learn") || cleanQuery.includes("remember") || cleanQuery.includes("study") || cleanQuery.includes("forget")) {
      matchedKey = "memory";
    } else if (cleanQuery.includes("phone") || cleanQuery.includes("social media") || cleanQuery.includes("screen") || cleanQuery.includes("tiktok") || cleanQuery.includes("addict") || cleanQuery.includes("checking")) {
      matchedKey = "phone";
    } else if (cleanQuery.includes("sleep") || cleanQuery.includes("tired") || cleanQuery.includes("rest") || cleanQuery.includes("dream") || cleanQuery.includes("insomnia") || cleanQuery.includes("caffeine") || cleanQuery.includes("coffee")) {
      matchedKey = "sleep";
    } else if (cleanQuery.includes("motivation") || cleanQuery.includes("willpower") || cleanQuery.includes("drive") || cleanQuery.includes("detox") || cleanQuery.includes("dopamine")) {
      matchedKey = "motivation";
    } else if (cleanQuery.includes("stress") || cleanQuery.includes("anxious") || cleanQuery.includes("worry") || cleanQuery.includes("overthink") || cleanQuery.includes("panic") || cleanQuery.includes("fear")) {
      matchedKey = "stress";
    }

    const data = NEURO_KNOWLEDGE_BASE[matchedKey];
    
    // Generate an elegant, conversational reply with personalized touches depending on user question
    const aiResponse = `### 🧠 NeuroLens AI Coach Response

Hello! That is a fascinating neuroscience question. Let's look at how your brain processes this.

**The Concept:** ${data.title}
**Analogy:** *${data.analogy}*

---

#### 🔬 What's Happening in Your Nervous System?
${data.explanation}

---

#### 🛠️ Practical, Biology-Backed Strategies:
${data.strategies.map(s => `- ${s}`).join("\n")}

---

#### 🏷️ Key Terminology to Impress Your Friends:
${data.terms.map(t => `- **${t}**`).join("\n")}

---

*To deepen your understanding, I highly recommend reading our detailed guides on:*
${data.related.map(r => `- [${r.title}](${r.href})`).join("\n")}

---
_Disclaimer: I am your AI Brain Coach. This is educational content and does not substitute for medical advice._`;

    // Save the conversation to the database so we have a log and can display recent community interactions!
    try {
      await db.insert(aiChats).values({
        userQuery: query,
        aiResponse: aiResponse,
        category: data.title,
      });
    } catch (dbErr) {
      console.error("Could not log AI Chat to DB:", dbErr);
    }

    return NextResponse.json({
      query,
      response: aiResponse,
      category: data.title,
      relatedTopics: data.related,
    });
  } catch (error: any) {
    console.error("AI Coach POST error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
