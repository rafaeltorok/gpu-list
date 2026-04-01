type GpuDataRowProps = {
  header: string;
  data: string | number;
  headerClass: string;
};

export default function GpuDataRow({
  header,
  data,
  headerClass,
}: GpuDataRowProps) {
  return (
    <tr>
      <th>{header}</th>
      <td className={headerClass}>{data}</td>
    </tr>
  );
}
