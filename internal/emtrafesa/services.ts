import { api } from "../../config/api";
import type { Branch } from "./types";

export async function getBranches(): Promise<Branch[]> {
  const req = await fetch("https://emtrafesa.pe/Home/GetSucursales", {
    headers: api.headers,
  });

  const res = (await req.json()) as Branch[];

  return res;
}
