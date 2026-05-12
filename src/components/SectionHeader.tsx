interface SectionHeaderProps {
  label: string;
}

const SectionHeader = ({ label }: SectionHeaderProps) => (
  <p
    className="font-mono uppercase text-muted"
    style={{
      fontSize: '11px',
      letterSpacing: '0.08em',
      marginBottom: '48px',
    }}
  >
    {label}
  </p>
);

export default SectionHeader;
