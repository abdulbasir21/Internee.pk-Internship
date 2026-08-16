import { useResume } from "../../context/ResumeContext";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import SectionCard from "../ui/SectionCard";

export default function PersonalInfoForm() {
  const { resume, updatePersonalInfo, fieldErrors } = useResume();
  const info = resume.personalInfo;

  const set = (field) => (e) => updatePersonalInfo(field, e.target.value);

  return (
    <SectionCard
      step={1}
      title="Personal info"
      description="Name and email are the only things that are required."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="pi-name"
          label="Full name"
          required
          placeholder="Jordan Lee"
          value={info.name}
          onChange={set("name")}
          error={fieldErrors.name}
        />
        <Input
          id="pi-email"
          label="Email"
          required
          type="email"
          placeholder="jordan@example.com"
          value={info.email}
          onChange={set("email")}
          error={fieldErrors.email}
        />
        <Input
          id="pi-phone"
          label="Phone"
          placeholder="+1 (555) 123-4567"
          value={info.phone}
          onChange={set("phone")}
        />
        <Input
          id="pi-location"
          label="Location"
          placeholder="Austin, TX"
          value={info.location}
          onChange={set("location")}
        />
        <Input
          id="pi-linkedin"
          label="LinkedIn"
          placeholder="linkedin.com/in/jordanlee"
          className="sm:col-span-2"
          value={info.linkedin}
          onChange={set("linkedin")}
        />
      </div>
      <div className="mt-4">
        <TextArea
          id="pi-summary"
          label="Summary"
          rows={3}
          placeholder="A sentence or two on what you're looking for and what you bring."
          value={info.summary}
          onChange={set("summary")}
        />
      </div>
    </SectionCard>
  );
}
