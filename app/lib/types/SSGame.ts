export interface SSGame {
  header: Header
  response: Response
}

export interface Header {
  APIversion: string
  dateTime: string
  commandRequested: string
  success: string
  error: string
}

export interface Response {
  serveurs: Serveurs
  jeux: Jeux[]
}

export interface Serveurs {
  cpu1: string
  cpu2: string
  cpu3: string
  cpu4: string
  threadsmin: string
  nbscrapeurs: string
  apiacces: string
  closefornomember: string
  closeforleecher: string
  maxthreadfornonmember: string
  threadfornonmember: string
  maxthreadformember: string
  threadformember: string
}

export interface Jeux {
  id: string
  noms: Nom[]
  systeme: Systeme
  editeur: Editeur
  developpeur: Developpeur
  joueurs: Joueurs
  note: Note
  topstaff: any
  rotation: string
  controles: string
  couleurs: string
  synopsis: Synopsis[]
  classifications: Classification[]
  dates: Date[]
  genres: Genre[]
  medias: Media[]
}

export interface Nom {
  region: string
  text: string
}

export interface Systeme {
  id: string
  text: string
}

export interface Editeur {
  id: string
  text: string
}

export interface Developpeur {
  id: string
  text: string
}

export interface Joueurs {
  text: string
}

export interface Note {
  text: string
}

export interface Synopsis {
  langue: string
  text: string
}

export interface Classification {
  type: string
  text: string
}

export interface Date {
  region: string
  text: string
}

export interface Genre {
  id: string
  nomcourt: string
  principale: string
  parentid: string
  noms: Nom2[]
}

export interface Nom2 {
  langue: string
  text: string
}

export interface Media {
  type: string
  parent: string
  url: string
  region?: string
  crc: string
  md5: string
  sha1: string
  size: string
  format: string
  subparent?: string
  id?: string
}
