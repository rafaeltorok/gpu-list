type GpuPerformanceRowProps = {
  header: string;
  data: string | number;
  headerClass: string;
};

export default function GpuPerformanceRow({
  header,
  data,
  headerClass,
}: GpuPerformanceRowProps) {
  return (
    <tr>
      <th>{header}</th>
      <td className={headerClass}>{data}</td>
    </tr>
  );
}
