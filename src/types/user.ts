export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
  
export interface Album {
    userId: number;
    id: number;
    title: string;
}

export interface UserFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    city: string;
  };
}

export type CreateUserInput = UserFormData;

export type UpdateUserInput = Pick<User, "id"> & Partial<UserFormData>;

export type UserListItem = Pick<User, "id" | "name" | "email" | "phone" | "website"> & {
  address: Pick<Address, "city">;
  company: Pick<Company, "name">;
};

export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";
export type CityFilter = string;


