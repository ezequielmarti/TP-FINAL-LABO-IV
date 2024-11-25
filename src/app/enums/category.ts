import { Injectable } from "@angular/core";

export enum Category {
    Entretenimiento = 'entertainment',
    Internacional = 'world',
    Empresarial = 'business',
    Salud = 'health',
    Deportes = 'sport',
    Ciencia = 'science',
    Tecnologia = 'technology'
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor() { }

    static getEnumName(value: string): string {
        const enumKey = Object.keys(Category).find(key => Category[key as keyof typeof Category] === value);
        return enumKey || 'Categoría desconocida';  // Si no se encuentra el valor, se devuelve un valor por defecto
    }
}