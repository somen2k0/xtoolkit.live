export type Provider = "guerrilla" | "mailgw" | "maildrop";
export type GmailProvider = "gmail" | "outlook" | "hotmail";

export interface GuerrillaAccount {
  email: string;
  user: string;
  domain: string;
  sid_token: string;
  domains: string[];
}

export interface MailgwAccount {
  email: string;
  login: string;
  domain: string;
  token: string;
}

export interface MaildropAccount {
  email: string;
  login: string;
  domain: string;
  token: string;
}

export interface GmailAccount {
  email: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  body?: string;
  bodyContentType?: "html" | "text";
  intro?: string;
  seen?: boolean;
}

export interface HistoryEntry {
  address: string;
  provider: Provider | "gmail";
  createdAt: number;
}

export interface StoredState {
  tempMailProvider: Provider;
  guerrillaDomain: string;
  guerrilla: GuerrillaAccount | null;
  mailgw: MailgwAccount | null;
  maildrop: MaildropAccount | null;
  gmail: GmailAccount | null;
  gmailProvider: GmailProvider;
  history: HistoryEntry[];
  seenMessageIds: string[];
  lastPollAt: number;
  otpAutoCopy: boolean;
}

export const GUERRILLA_DOMAINS = ["guerrillamail.com", "grr.la", "sharklasers.com", "spam4.me"] as const;
export const ALL_TEMPMAIL_DOMAINS = [...GUERRILLA_DOMAINS, "mail.gw"] as const;
export type TempmailDomain = typeof ALL_TEMPMAIL_DOMAINS[number];

export const DEFAULT_STATE: StoredState = {
  tempMailProvider: "guerrilla",
  guerrillaDomain: "guerrillamail.com",
  guerrilla: null,
  mailgw: null,
  maildrop: null,
  gmail: null,
  gmailProvider: "gmail",
  history: [],
  seenMessageIds: [],
  lastPollAt: 0,
  otpAutoCopy: true,
};

export interface InboxState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}
