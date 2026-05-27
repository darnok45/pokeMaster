import { PokemonGameData } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Obtiene la lista básica de los 151 originales para el autocompletado del juego
export async function getPokemonList151(): Promise<{ id: string; name: string }[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=151`);
  if (!response.ok) throw new Error('Error al obtener el catálogo');
  const data = await response.json();
  
  return data.results.map((p: any) => {
    const id = p.url.split('/').filter(Boolean).pop();
    return {
      id,
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    };
  });
}

// Obtiene los datos detallados de un Pokémon por ID o Nombre para la comparación
export async function getPokemonGameData(idOrName: string): Promise<PokemonGameData> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName.toLowerCase()}`);
  if (!response.ok) throw new Error('Pokémon no encontrado');
  const data = await response.json();

  return {
    id: data.id.toString(),
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map((t: any) => t.type.name),
    height: data.height,
    weight: data.weight,
  };
}