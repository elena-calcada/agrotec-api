import { randomUUID } from "crypto";

import { AppError } from "../../../shared/errors/AppError";

export type ProductProps = {
  name: string;
  technical_description: string;
  image: string;
  category_id: string;
  supplier_id: string;
};

export class Product {
  id: string;
  image: string;
  image_url: string;
  name: string;
  technical_description: string;
  supplier_id: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;

  private constructor(props: ProductProps) {
    if (
      !props.name ||
      !props.technical_description ||
      !props.image ||
      !props.category_id ||
      !props.supplier_id
    ) {
      throw new AppError("All fields must be filled!");
    }

    this.id = randomUUID();
    this.image = props.image;
    this.image_url = "";
    this.technical_description = props.technical_description;
    this.name = props.name;
    this.supplier_id = props.supplier_id;
    this.category_id = props.category_id;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(props: ProductProps) {
    const product = new Product(props);
    return product;
  }
}
