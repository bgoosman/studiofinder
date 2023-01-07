export interface BookingStrategy {
  type: string;
}

export interface EmailStrategy extends BookingStrategy {
  email: string;
  subject: string;
  body: string;
  iana: string;
}
