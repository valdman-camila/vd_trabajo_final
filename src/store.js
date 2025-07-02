import {writable} from "svelte/store";

export const llamadoGato = writable(0);
export const gatoEspecifico = writable(null);

export const jugadorTipo = writable(null);
export const jugadorColor = writable(null);