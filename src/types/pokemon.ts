// src/types/pokemon.ts

export type PokemonGameData = {
  id: string;
  name: string;
  imageUrl: string;
  types: string[];  // 🟩 ¡Esto es lo que te está faltando acotarle a TypeScript!
  height: number;
  weight: number;
};