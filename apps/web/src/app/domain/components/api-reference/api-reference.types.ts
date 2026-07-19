export interface ApiProp {
  name: string;
  description: string;
  type: string;
  default: string;
}

export interface ApiSection {
  selector: string;
  description: string;
  props: ApiProp[];
}
