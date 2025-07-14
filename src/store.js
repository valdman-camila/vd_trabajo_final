import { writable } from "svelte/store";

export const llamadoGato = writable(0);
export const gatoEspecifico = writable(null);

export const jugadorTipo = writable(null);
export const jugadorColor = writable(null);
export const jugadorGatoTerminado = writable(false);
export const GatoTerminadoJuego1 = writable(false);

export const resultadoJuego1 = writable(null);
export const resultadoJuego2 = writable(null);
