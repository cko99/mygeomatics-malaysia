/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
export type Theme='light'|'dark'|'system';
const KEY='mygeomatics-theme';
const ThemeContext=createContext<{theme:Theme;setTheme:(t:Theme)=>void}>({theme:'system',setTheme:()=>undefined});
export function ThemeProvider({children}:{children:ReactNode}){ const [theme,setThemeState]=useState<Theme>(()=>{const saved=localStorage.getItem(KEY);return saved==='light'||saved==='dark'||saved==='system'?saved:'system'}); useEffect(()=>{localStorage.setItem(KEY,theme); const dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.classList.toggle('dark',dark);},[theme]); const value=useMemo(()=>({theme,setTheme:(t:Theme)=>setThemeState(t)}),[theme]); return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider> }
export const useTheme=()=>useContext(ThemeContext);
