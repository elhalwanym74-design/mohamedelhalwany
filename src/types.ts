export type Category = 
  | 'ui-components' 
  | 'interactive-apps' 
  | 'css-effects' 
  | 'utilities' 
  | 'full-templates';

export interface VaultItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  html: string;
  css: string;
  js: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export type EditorTab = 'html' | 'css' | 'js';

export interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  text: string;
  timestamp: string;
  count?: number;
}

export interface PracticeChallenge {
  id: string;
  title: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: string;
  instructions: string;
  requirements: string[];
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  hints: string[];
  testCode: string; // JavaScript to execute in iframe to test the solution
}
