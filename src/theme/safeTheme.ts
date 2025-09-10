export type ThemeColors = {
  bg: string; card: string; text: string; subtext: string;
  accent: string; pillBg: string; pillText: string; border: string;
  chipBg: string; chipBorder: string;
};
export type Theme = {
  colors: ThemeColors;
  spacing: (n:number)=>number;
  radii: { sm:number; md:number; lg:number; xl:number; round:number };
  shadows: { card: any };
  fonts: { bold:string; medium:string; regular:string };
};

let t: any = {};
try { t = require('./tokens'); } catch { t = {}; }

const theme: Theme = {
  colors: {
    bg: '#1f140d',
    card: '#2a1b12',
    text: '#f5ece3',
    subtext: '#cdb9a8',
    accent: '#d98c3b',
    pillBg: '#3a281d',
    pillText: '#e9cfb4',
    border: 'rgba(255,255,255,0.08)',
    chipBg: '#3a2a1f',
    chipBorder: 'rgba(255,255,255,0.08)',
    ...(t.colors || {}),
  },
  spacing: t.spacing ?? ((n:number)=> n * 8),
  radii: t.radii ?? { sm:10, md:16, lg:20, xl:28, round:999 },
  shadows: t.shadows ?? { card: { shadowColor:'#000', shadowOpacity:0.35, shadowRadius:10, elevation:6 } },
  fonts: t.fonts ?? { bold:'System', medium:'System', regular:'System' },
};

export default theme;