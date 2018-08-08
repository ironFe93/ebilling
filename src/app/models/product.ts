export class Product {
  _id: string;
  cod: string;
  cod_medida: string;
  categoria: string;
  descripcion: string;
  ref_price: number;
  inventario: {
    cantidad: number;
  };
}
