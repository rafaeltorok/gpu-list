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
        <div className="table-row">
          <div className="table-row-label">{header}</div>
          <div className={headerClass}>
            <input
              className="table-row-edit-field"
              type="number"
              value={value}
              onChange={(e) =>
                setGpuData({ ...gpuData, [id]: Number(e.target.value) })
              }
            />
          </div>
        </div>
      ) : (
        <div className="table-row">
          <div className="table-row-label">{header}</div>
          <div className={`${headerClass} table-row-data`}>{data}</div>
        </div>
      )}
    </>
  );
}
