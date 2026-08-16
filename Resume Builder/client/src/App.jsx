import { ResumeProvider } from "./context/ResumeContext";
import Header from "./components/Header";
import PersonalInfoForm from "./components/form/PersonalInfoForm";
import SkillsForm from "./components/form/SkillsForm";
import ExperienceForm from "./components/form/ExperienceForm";
import EducationForm from "./components/form/EducationForm";
import PreviewPanel from "./components/preview/PreviewPanel";

// App is intentionally just layout: state lives in ResumeContext,
// each section is one component, and this file only decides where
// things sit on screen.
function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        {/* Form column */}
        <div className="flex flex-col gap-5">
          <PersonalInfoForm />
          <SkillsForm />
          <ExperienceForm />
          <EducationForm />
        </div>

        {/* Preview column — sticky on desktop so it stays in view
            while the form scrolls underneath it. */}
        <div className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-112px)]">
          <PreviewPanel />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <AppShell />
    </ResumeProvider>
  );
}
