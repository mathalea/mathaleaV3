/**
 * setInteractive à 0 on enlève tout, à 1 on les met tous en interactif, à 2 on ne change rien
 */
export interface InterfaceGlobalOptions { v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number, trans?: boolean, sound?: '0' | '1' | '2' | '3', es?: string, title: string, presMode: 'page' | 'exos' | 'liste' | 'questions', setInteractive: string, isSolutionAccessible: boolean, isInteractiveFree: boolean, recorder?: 'capytale' | 'labomep' | 'moodle' | 'anki' }

export interface InterfaceParams { uuid: string, id?: string, alea?: string, interactif?: '0' | '1', cd?: '0' | '1', sup?: string, sup2?: string, sup3?: string, sup4?: string, nbQuestions?: number, duration?: number, cols?: number }

export interface InterfaceReferentiel { uuid: string, id: string, url: string, titre: string, tags: { interactif: boolean, interactifType: string, amc: boolean }, datePublication?: string, dateModification?: string, annee?: string }
