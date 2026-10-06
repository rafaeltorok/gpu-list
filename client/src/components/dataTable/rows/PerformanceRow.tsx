type PerformanceRowProps = {
  header: string;
  data: string | number;
  headerClass: string;
};

export default function PerformanceRow({
  header,
  data,
  headerClass,
}: PerformanceRowProps) {
  return (
    <div className="table-row">
      <div className="table-row-label">{header}</div>
      <div className={`${headerClass} table-row-data`}>{data}</div>
    </div>
  );
}
