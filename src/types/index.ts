// src/types/index.ts

/**
 * @typedef {Object} UserProfile
 * @property {string} display_name - Il nome visualizzato dell'utente.
 * @property {string} avatar_url - L'URL dell'avatar dell'utente.
 */
export type UserProfile = {
  display_name: string;
  avatar_url: string;
};

/**
 * @typedef {Object} AIContent
 * @property {number} id - L'ID univoco del contenuto AI.
 * @property {string} user_id - L'ID dell'utente che ha generato il contenuto.
 * @property {'IMAGE' | 'VIDEO' | 'POST'} content_type - Il tipo di contenuto generato (immagine, video, o post testuale).
 * @property {string} prompt - Il prompt utilizzato per generare il contenuto.
 * @property {string | null} generated_url - L'URL del contenuto generato (per immagini/video), o null.
 * @property {string | null} generated_text - Il testo del contenuto generato (per post), o null.
 * @property {string} ai_strategy_plan - Il piano di strategia AI per la viralità del contenuto.
 * @property {number} votes - Il numero di voti ricevuti dal contenuto.
 * @property {UserProfile} user - Le informazioni di profilo dell'utente che ha generato il contenuto.
 */
export type AIContent = {
  id: number;
  user_id: string;
  content_type: 'IMAGE' | 'VIDEO' | 'POST';
  prompt: string;
  generated_url: string | null;
  generated_text: string | null;
  ai_strategy_plan: string;
  votes: number;
  user: UserProfile; // Utilizziamo il tipo UserProfile definito sopra
};

/**
 * @typedef {Object} Contest
 * @property {number} id - L'ID univoco del contest.
 * @property {string} theme_prompt - Il tema o il prompt del contest.
 * // TODO: Aggiungi qui altri campi del contest se presenti nel backend, ad esempio 'start_date', 'end_date', 'status', 'prize'.
 */
export type Contest = {
  id: number;
  theme_prompt: string;
};

/**
 * @typedef {Object} Notification
 * @property {string} message - Il messaggio della notifica.
 * @property {'success' | 'error'} type - Il tipo di notifica (successo o errore).
 */
export type Notification = {
  message: string;
  type: 'success' | 'error';
};

// Puoi aggiungere qui altri tipi man mano che il tuo progetto cresce e le API si evolvono.