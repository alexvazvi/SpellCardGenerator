import type { Card } from '../types';

const STORAGE_KEY = 'savedCards';

/**
 * Valida que un objeto tenga la estructura mínima de una Card.
 * Esto es crucial para la integridad de los datos al leer desde localStorage.
 * @param object - El objeto a validar.
 * @returns - `true` si el objeto es una Card válida, de lo contrario `false`.
 */
const isValidCard = (object: unknown): object is Card => {
  if (typeof object !== 'object' || object === null) {
    return false;
  }
  const card = object as Card;
  return (
    typeof card.id === 'number' &&
    typeof card.cardProps === 'object' &&
    card.cardProps !== null &&
    typeof card.titleProps === 'object' &&
    card.titleProps !== null &&
    typeof card.descriptionProps === 'object' &&
    card.descriptionProps !== null &&
    typeof card.footerProps === 'object' &&
    card.footerProps !== null &&
    typeof card.imageSize === 'object' &&
    card.imageSize !== null &&
    typeof card.imageBackSize === 'object' &&
    card.imageBackSize !== null &&
    typeof card.imageBorder === 'object' &&
    card.imageBorder !== null &&
    typeof card.divider1 === 'object' &&
    card.divider1 !== null &&
    typeof card.divider2 === 'object' &&
    card.divider2 !== null
  );
};

/**
 * Obtiene todas las cartas guardadas del localStorage, validando cada una.
 * @returns {Card[]} Un array de cartas válidas.
 */
export const getSavedCards = (): Card[] => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsedData = JSON.parse(rawData);
    if (Array.isArray(parsedData)) {
      const validCards = parsedData.filter(isValidCard);
      // Opcional: Si se detectan cartas inválidas, se podría limpiar el localStorage
      // if (validCards.length !== parsedData.length) {
      //   localStorage.setItem(STORAGE_KEY, JSON.stringify(validCards));
      // }
      return validCards;
    }
    return [];
  } catch (error) {
    console.error("Error al leer o parsear las cartas guardadas:", error);
    // Si hay un error de parseo, es mejor limpiar el almacenamiento para evitar futuros problemas.
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

/**
 * Guarda una nueva carta en el localStorage.
 * @param {Omit<Card, 'id'>} cardData - Los datos de la carta a guardar, sin el ID.
 * @returns {boolean} `true` si se guardó con éxito, `false` en caso contrario.
 */
export const saveCard = (cardData: Omit<Card, 'id'>): boolean => {
  try {
    const existingCards = getSavedCards();
    const newCard: Card = {
      ...cardData,
      id: Date.now(), // Asigna un ID único basado en el timestamp
    };

    // Validamos la carta que acabamos de crear para máxima seguridad
    if (!isValidCard(newCard)) {
        console.error("Los datos de la carta a guardar son inválidos.", newCard);
        return false;
    }

    const updatedCards = [...existingCards, newCard];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    return true;
  } catch (error) {
    console.error("Error al guardar la carta:", error);
    return false;
  }
};

/**
 * Elimina una carta del localStorage por su ID.
 * @param {number} cardId - El ID de la carta a eliminar.
 * @returns {Card[]} El nuevo array de cartas después de la eliminación.
 */
export const deleteCard = (cardId: number): Card[] => {
  try {
    const existingCards = getSavedCards();
    const updatedCards = existingCards.filter(card => card.id !== cardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    return updatedCards;
  } catch (error) {
    console.error("Error al eliminar la carta:", error);
    return getSavedCards(); // Devuelve el estado anterior si algo falla
  }
};
