interface PerformanceItemProps {
  label: string;
  data: string;
}

export default function PerformanceItem({ label, data }: PerformanceItemProps) {
  return (
    <div className="spec-item">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{data}</span>
    </div>
  );
}
