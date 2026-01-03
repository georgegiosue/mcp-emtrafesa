export type Terminal = {
  Id: string;
  Nombre: string;
  Direccion: string;
};

export type FAQ = {
  Pregunta: string;
  Respuesta: string;
};

export type Ticket = {
  dateTime: string;
  seats: string[];
  ticketsCodes: string[];
  price: string;
  operationNumber: string;
  origin: string | undefined;
  destination: string | undefined;
};

export type DepartureSchedule = {
  Programacion_Id: number;
  Bus_Croquis_Id: string;
  Embarque_FechaHora: string;
  Desembarque_FechaHora: string;
  Embarque_FechaHora_Str: string;
  Desembarque_FechaHora_Str: string;
  EsDirecto: boolean;
  EsDirecto_Str: string;
  Servicio_Descripcion: string;
  Bus_AsientosLibres: number;
  Bus_Pisos: number;
  Precio_Piso1: number;
  Precio_Piso2: number;
  Embarque_SoloEquipajeDeMano: boolean;
  Embarque_LaHoraEsReferencial: boolean;
  ArrIncremento: ArrIncremento[];
  ObjRestriccion: ObjRestriccion;
};

type ArrIncremento = {
  IdPlanoBus: string;
  NumeroAsiento: number;
  Nivel: number;
};

type ObjRestriccion = {
  Origen: string;
  Aplica: boolean;
  IdProgramacion: string;
};
