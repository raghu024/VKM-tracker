export interface WeekData {
  week: number;
  sessionName: string;
  focusArea: string;
  sessionType: "Group Session" | "Individual Session";
  tasks: string[];
  maxPoints: number;
}

export const weeksData: WeekData[] = [
  {
    week: 1,
    sessionName: "Lifestyle Changes & OMM",
    focusArea: "Daily discipline, habits, clarity",
    sessionType: "Group Session",
    tasks: [
      "Document your current daily routine and identify 3 areas for improvement",
      "Create a morning ritual plan and follow it for 7 days (share screenshots/journal)",
      "Set up your OMM (One Main Metric) tracker and share your first week's data",
    ],
    maxPoints: 30,
  },
  {
    week: 2,
    sessionName: "Team Aspiration & Goal Setting",
    focusArea: "Business & team goals",
    sessionType: "Individual Session",
    tasks: [
      "Write down your 90-day business vision with measurable goals",
      "Create a team goal alignment document with individual KPIs",
      "Share a screenshot of your goal tracking system in action",
    ],
    maxPoints: 30,
  },
  {
    week: 3,
    sessionName: "Business Model Changes",
    focusArea: "Scaling model, B2B/B2C channels",
    sessionType: "Individual Session",
    tasks: [
      "Map out your current business model canvas and identify gaps",
      "Research and document 2 new B2B or B2C channel opportunities",
      "Create an action plan for implementing one new revenue channel",
    ],
    maxPoints: 30,
  },
  {
    week: 4,
    sessionName: "Role Clarity",
    focusArea: "Team responsibilities & KPIs",
    sessionType: "Group Session",
    tasks: [
      "Create an organizational chart with clear role definitions",
      "Define KPIs for each team member and share the document",
      "Conduct a team alignment meeting and share meeting notes/recording",
    ],
    maxPoints: 30,
  },
  {
    week: 5,
    sessionName: "Culture & Values",
    focusArea: "Company identity & behaviour",
    sessionType: "Group Session",
    tasks: [
      "Draft your company's core values document (minimum 5 values with descriptions)",
      "Create a culture handbook or one-pager for your team",
      "Share evidence of a team activity that reinforces your company culture",
    ],
    maxPoints: 30,
  },
  {
    week: 6,
    sessionName: "Growth Accelerator & Review-to-React",
    focusArea: "Monthly business review, performance correction & strategic improvements",
    sessionType: "Group Session",
    tasks: [
      "Complete a monthly business review report with key metrics",
      "Identify top 3 performance gaps and create corrective action plans",
      "Share your strategic improvement roadmap for the next 30 days",
    ],
    maxPoints: 30,
  },
  {
    week: 7,
    sessionName: "Marketing Strategies – 1",
    focusArea: "Organic marketing strategies & content growth",
    sessionType: "Individual Session",
    tasks: [
      "Create a 30-day content calendar with at least 20 posts planned",
      "Publish 5 pieces of organic content and share analytics screenshots",
      "Document your content creation process/SOP",
    ],
    maxPoints: 30,
  },
  {
    week: 8,
    sessionName: "Marketing Strategies – 2",
    focusArea: "Paid marketing, ads strategy & funnels",
    sessionType: "Individual Session",
    tasks: [
      "Design a marketing funnel diagram for your primary offering",
      "Create and launch at least one paid ad campaign (share screenshots)",
      "Set up tracking/analytics for your funnel and share initial results",
    ],
    maxPoints: 30,
  },
  {
    week: 9,
    sessionName: "Marketing Strategies – 3",
    focusArea: "Advanced growth campaigns & automation systems",
    sessionType: "Individual Session",
    tasks: [
      "Set up at least one marketing automation workflow (email sequence, chatbot, etc.)",
      "Create a lead nurturing campaign with documented touchpoints",
      "Share metrics from your automation systems showing engagement data",
    ],
    maxPoints: 30,
  },
  {
    week: 10,
    sessionName: "Sales Strategies – 1",
    focusArea: "Sales process design & scripts",
    sessionType: "Individual Session",
    tasks: [
      "Document your complete sales process from lead to close",
      "Create at least 2 sales scripts for different scenarios",
      "Record a practice sales call and share for feedback",
    ],
    maxPoints: 30,
  },
  {
    week: 11,
    sessionName: "Sales Strategies – 2",
    focusArea: "Conversion psychology & objection handling",
    sessionType: "Individual Session",
    tasks: [
      "Create an objection handling playbook with top 10 objections and responses",
      "Document 3 conversion optimization techniques you've implemented",
      "Share before/after conversion metrics from your improvements",
    ],
    maxPoints: 30,
  },
  {
    week: 12,
    sessionName: "Sales Strategies – 3",
    focusArea: "Closing systems, scaling sales & revenue optimization & FINAL REVIEW",
    sessionType: "Individual Session",
    tasks: [
      "Build and document your closing system/playbook",
      "Create a sales scaling plan with projected metrics",
      "Submit your final transformation report: before vs. after metrics across all 12 weeks",
    ],
    maxPoints: 30,
  },
];
