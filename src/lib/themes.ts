import { ThemeMode } from '../types';

export interface AtelierTheme {
  id: ThemeMode;
  name: string;
  subtitle: string;
  mood: string;
  isDark: boolean;
  swatches: [string, string, string, string]; // [Background, Accent, Text, Gold/Secondary]
}

export const ATELIER_THEMES: AtelierTheme[] = [
  {
    id: 'rose',
    name: 'Atelier Rose',
    subtitle: 'Rose Gold & Champagne',
    mood: 'Classic morning radiance and poised focus',
    isDark: false,
    swatches: ['#FFF8F4', '#C94F7C', '#4A2545', '#D4AF37'],
  },
  {
    id: 'plum',
    name: 'Plum Noir',
    subtitle: 'Bordeaux Velvet Midnight',
    mood: 'Intimate candlelit glamour for deep focus',
    isDark: true,
    swatches: ['#1E0E1D', '#F7B7C9', '#FFF8F4', '#E6C79C'],
  },
  {
    id: 'sage',
    name: 'Matcha Silk',
    subtitle: 'Sage Botanique & Quiet Luxury',
    mood: 'Restorative serenity that soothes tired eyes',
    isDark: false,
    swatches: ['#F6F8F5', '#6E8B70', '#1E3324', '#C8B282'],
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    subtitle: 'Haute Lilac & Frosted Pearl',
    mood: 'Ethereal couture clarity and crisp thought',
    isDark: false,
    swatches: ['#FAF8FC', '#8B6F96', '#34243A', '#DECBB7'],
  },
  {
    id: 'espresso',
    name: 'Espresso Royale',
    subtitle: 'Tuscan Terracotta & Rich Academia',
    mood: 'Warm Italian leather and dark academic rigor',
    isDark: false,
    swatches: ['#FAF5EE', '#A25852', '#2C1E18', '#D19B4C'],
  },
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    subtitle: 'Celestial Rose & Ink Navy',
    mood: 'High-powered executive night and starlight',
    isDark: true,
    swatches: ['#0B1120', '#F0B6C8', '#F8FAFC', '#F59E0B'],
  },
];

