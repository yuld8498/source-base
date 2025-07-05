export const NOTIFICATION_TITLE = {
  TRIP_REQUEST: {
    ENGLISH: 'Trip Request',
    FRENCH: 'Demande de déplacement',
  },
  NEW_TRIP_REQUEST: {
    ENGLISH: 'You have a new trip request !',
    FRENCH: 'Vous avez une nouvelle demande de déplacement !',
  },
  NEW_2_WAY_TRIP_REQUEST: {
    ENGLISH: 'You have a new round trip request !',
    FRENCH: `Vous avez une nouvelle demande d'aller-retour`,
  },
  NEW_TRIP_REQUEST_NEED_CONFIRM: {
    ENGLISH: 'You have a new trip request that needs confirm !',
    FRENCH: 'Vous avez une nouvelle demande de voyage qui doit être confirmée !',
  },
  CONFIRM_TRIP_REQUEST_UPDATE: {
    ENGLISH: 'You have a trip request has been updated !',
    FRENCH: 'Votre demande de voyage a été mise à jour !',
  },
  TRIP_REQUEST_UPDATE_STATUS: {
    ENGLISH: 'Trip request has been update status !',
    FRENCH: 'La demande de voyage a été mise à jour !',
  },
  TRIP_REQUEST_CANCEL: {
    ENGLISH: 'Your trip request has been canceled !',
    FRENCH: 'Votre demande de voyage a été annulée !',
  },
  TRIP_REQUEST_START: {
    ENGLISH: 'Your trip request has been start !',
    FRENCH: 'Votre demande de voyage a été lancée !',
  },
  TRIP_REQUEST_ONGOING: {
    ENGLISH: 'Your trip request has been change to ongoing !',
    FRENCH: 'Votre demande de voyage a été modifiée en cours !',
  },
  USER_CHANGE_TRIP_REQUEST: {
    ENGLISH: 'User change trip request !',
    FRENCH: `Demande de déplacement de changement d'utilisateur !`,
  },
  USER_UPDATE_TRIP_REQUEST: {
    ENGLISH: 'User update trip request !',
    FRENCH: `Demande de déplacement de mise à jour de l'utilisateur !`,
  },
  CONFIRMED_BY_FLEET: {
    ENGLISH: 'Trip Request has been confirmed !',
    FRENCH: 'La demande de voyage a été confirmée !',
  },
  PICKED_UP: {
    ENGLISH: 'Driver coming to pick you up !',
    FRENCH: 'Chauffeur venant vous chercher !',
  },
  ARRIVED: {
    ENGLISH: 'Driver has arrived',
    FRENCH: 'Le chauffeur est arrivé',
  },
  FROM: {
    ENGLISH: 'from',
    FRENCH: 'de',
  },
  TO: {
    ENGLISH: 'to',
    FRENCH: 'à',
  },
  TRIP_REQUEST_ASSIGNED: {
    ENGLISH: 'Trip Request assigned',
    FRENCH: 'Demande de voyage attribuée',
  },
  TRIP_REQUEST_DELAY: {
    ENGLISH: 'Trip Request delay',
    FRENCH: 'Retard de demande de voyage',
  },
}

export const MESSAGE_GATEWAY = {
  USER_DEACTIVE: 'User had been deactive.',
  REJECT_CONNECT: 'Client connection rejected: Missing authorization header',
}

export const GATEWAY_EMIT_EVENT = {
  CONNECT: 'connection',
  UPDATE_TRIP_REQUEST: 'trip-request-update',
  UPDATE_LOCATION_TRIP_REQUEST: 'trip-request-update-location',
  CREATE_TRIP_REQUEST: 'trip-request-create',
  DEACTIVATE_USER: 'user-deactivate',
}

export const GATEWAY_SUBCIRBE_EVENT = {
  CONNECT: 'connection',
  DISCONECTION: 'disconection',
  LISTEN_EVENT: 'listen-event',
  MESSAGE: 'message',
}
