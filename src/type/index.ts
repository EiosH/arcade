export type DataFormat<T> = {
  data: string;
  type: T;
};

export enum DataType {
  MESSAGE = "message",
  SIGNAL = "signal",
}

export enum SignalType {
  LOGIN = "login",
  LOGOUT = "logout",
  OFFER_CALL = "offer_call",
  OFFER_ANSWER = "offer_answer",
  ICE_CANDIDATE = "ice_candidate",
}

export type SignalData = DataFormat<SignalType>;
export type MessageData = string;
