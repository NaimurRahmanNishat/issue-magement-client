// src/redux/hooks.ts

import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;



// // src/redux/hooks.ts

// import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "./store";

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

