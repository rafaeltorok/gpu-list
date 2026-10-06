import type { GpuType } from "../../../../../shared/types/types";

type DataRowProps = {
  header: string;
  data: string | number;
  headerClass: string;
  editMode: boolean;
  value: number;
  id: string;
  gpuData: GpuType;
  setGpuData: (gpu: GpuType) => void;
};

export default function DataRow({
  header,
  data,
  headerClass,
  editMode,
  value,
  id,
  gpuData,
  setGpuData,
}: DataRowProps) {
  return (
    <>
      {editMode ? (
        <tr>
          <th>{header}</th>
          <td className={headerClass}>
            <input
              className="gpu-data-table-edit-field"
              type="number"
              value={value}
              onChange={(e) =>
                setGpuData({ ...gpuData, [id]: Number(e.target.value) })
              }
            />
          </td>
        </tr>
      ) : (
        <tr>
          <th>{header}</th>
          <td className={headerClass}>{data}</td>
        </tr>
      )}
    </>
  );
}
