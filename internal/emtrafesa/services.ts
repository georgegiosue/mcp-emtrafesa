import { api } from "../../config/api";

export async function getBranches() {
  const req = await fetch("https://emtrafesa.pe/Home/GetSucursales", {
    headers: api.headers,
  });

  const res = await req.json();

  return res;
}
