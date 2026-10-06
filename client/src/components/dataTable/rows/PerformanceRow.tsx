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
    <tr>
      <th>{header}</th>
      <td className={headerClass}>{data}</td>
    </tr>
  );
}
