export interface AiAssistOption {
  id: 'markdown' | 'chatgpt' | 'claude';
  label: string;
  url: string;
}

export interface NavigationLink {
  label: string;
  url: string;
}
