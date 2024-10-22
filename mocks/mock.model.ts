export interface Mock extends Response {
  url: string;
  responses?: Response[];
}

export interface Response {
  response: Object | null;
  status?: number;
  request?: {
    method: string;
    body?: Object;
  };
}
