export interface LaunchLinks {
  mission_patch?: string | null;
  mission_patch_small?: string | null;
}

export interface LaunchRocket {
  rocket_name: string;
}

export interface Launch {
  flight_number: number;
  mission_name: string;
  rocket?: LaunchRocket;
  links?: LaunchLinks;
  details?: string | null;
}
