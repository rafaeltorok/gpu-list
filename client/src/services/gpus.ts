import axios from "axios";
import type { GpuInputType, GpuType } from "../types/gpu";

const baseUrl: string = "/api/gpus";

async function getAll(): Promise<GpuType[]> {
  const response = await axios.get<GpuType[]>(baseUrl);
  return response.data;
}

async function create(newObject: GpuInputType): Promise<GpuType> {
  const response = await axios.post<GpuType>(baseUrl, newObject);
  return response.data;
}

async function update(id: string, newObject: GpuInputType): Promise<GpuType> {
  const response = await axios.put<GpuType>(`${baseUrl}/${id}`, newObject);
  return response.data;
}

async function remove(id: string): Promise<void> {
  await axios.delete<void>(`${baseUrl}/${id}`);
}

export default Object.freeze({ getAll, create, update, remove });
