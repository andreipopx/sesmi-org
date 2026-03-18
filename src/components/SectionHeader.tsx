interface SectionHeaderProps {
  label: string;
}

const SectionHeader = ({ label }: SectionHeaderProps) => (
  <div className="section-header-line py-8">
    ────────────── [ {label} ] ──────────────
  </div>
);

export default SectionHeader;
