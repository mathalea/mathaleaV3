/**
 * setInteractive à 0 on enlève tout, à 1 on les met tous en interactif, à 2 on ne change rien
 */
export interface InterfaceGlobalOptions {v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number, trans?: boolean, sound?: number, es?: string, title: string, presMode: 'page'|'exos'|'liste'|'questions', setInteractive: string, isSolutionAccessible: boolean, isInteractiveFree: boolean }

export interface InterfaceParams {uuid: string, id?:string, alea?: string, interactif?: '0'|'1', cd?: '0'|'1', sup?: string, sup2?: string, sup3?: string, sup4?: string, nbQuestions?: number, duration?: number, cols?: number }
