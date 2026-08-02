import { BookOpen, Clock, ExternalLink, Gauge, Sparkles, Target, X } from "lucide-react";
import { useEffect } from "react";
import { EmptyState, SectionHeading } from "./shared";
import { buildSkillDetail, titleCase } from "./utils";

function SkillGene({ gene, family, demand, onOpen }) {
  return (
    <button
      type="button"
      className={`dashboard-gene dashboard-gene-${gene.status}`}
      onClick={() => onOpen(buildSkillDetail(gene.skill, gene.status, family, demand))}
      title={`${gene.skill} (${gene.label || titleCase(gene.status)})`}
    >
      <span>{gene.skill}</span>
      <small>{gene.label || titleCase(gene.status)}</small>
    </button>
  );
}

export default function SkillDnaSection({ profiles, selectedId, onSelect, onOpenSkill }) {
  if (!profiles.length) {
    return (
      <EmptyState
        title="Skill DNA will appear here"
        message="Upload a resume or refresh recommendations to compare your skills against target roles."
      />
    );
  }

  const activeProfile = profiles.find((p) => p.id === selectedId) || profiles[0];
  const matched = activeProfile.job_genes.filter((g) => g.status === "matched").length;
  const partial = activeProfile.job_genes.filter((g) => g.status === "partial").length;
  const missing = activeProfile.job_genes.filter((g) => g.status === "missing").length;

  return (
    <section className="dashboard-card dashboard-dna-card">
      <SectionHeading icon={Sparkles} title="Skill DNA">
        <div className="dashboard-dna-tabs">
          {profiles.map((profile) => (
            <button
              type="button"
              key={profile.id}
              className={activeProfile.id === profile.id ? "active" : ""}
              onClick={() => onSelect(profile.id)}
              title={profile.role_title}
            >
              {profile.role_title}
            </button>
          ))}
        </div>
      </SectionHeading>
      <div className="dashboard-dna-summary">
        <div><strong>{matched}</strong><span>Matched</span></div>
        <div><strong>{partial}</strong><span>Partial</span></div>
        <div><strong>{missing}</strong><span>Missing</span></div>
        <div><strong>{Math.round(activeProfile.match_score)}%</strong><span>Overall fit</span></div>
      </div>
      <div className="dashboard-dna-columns">
        <div>
          <h3>Your Skill DNA</h3>
          <div className="dashboard-gene-grid">
            {activeProfile.user_genes.map((gene) => (
              <SkillGene key={`user-${activeProfile.id}-${gene.skill}`} gene={gene} family="Current profile" demand={2} onOpen={onOpenSkill} />
            ))}
          </div>
        </div>
        <div>
          <h3>Job Requires</h3>
          <div className="dashboard-gene-grid">
            {activeProfile.job_genes.map((gene) => (
              <SkillGene key={`job-${activeProfile.id}-${gene.skill}`} gene={gene} family={activeProfile.role_title} demand={4} onOpen={onOpenSkill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkillModal({ detail, onClose }) {
  useEffect(() => {
    if (!detail) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [detail, onClose]);

  if (!detail) return null;

  return (
    <div className="dashboard-modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="dashboard-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${detail.skill} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="dashboard-modal-close" onClick={onClose} aria-label="Close skill details"><X size={18} /></button>
        <div className="dashboard-skill-modal-hero">
          <p className={`dashboard-skill-status dashboard-gene-${detail.status}`}>{titleCase(detail.status)}</p>
          <h2>{titleCase(detail.skill)}</h2>
          <p>{detail.description}</p>
        </div>
        <div className="dashboard-modal-grid">
          <div><Target size={18} /><span>Why companies require it</span><strong>{detail.why}</strong></div>
          <div><Gauge size={18} /><span>Learning difficulty</span><strong>{detail.difficulty}</strong></div>
          <div><Clock size={18} /><span>Estimated learning time</span><strong>{detail.time}</strong></div>
        </div>
        <h3>Recommended learning resources</h3>
        {detail.resources.map((resource) => (
          <a key={resource.url} className="dashboard-resource-link" href={resource.url} target="_blank" rel="noreferrer">
            <BookOpen size={16} />
            <span>{resource.platform}: {resource.title}</span>
            <ExternalLink size={15} />
          </a>
        ))}
        <h3>Related projects</h3>
        <ul className="dashboard-project-list">
          {detail.projects.map((project) => <li key={project}>{project}</li>)}
        </ul>
      </article>
    </div>
  );
}
