"use client";
import { createContext, useContext } from "react";
import type { CoachMode } from "../lib/contract";
export const CoachEnvironment = createContext<CoachMode>("mock");
export const CoachDisclosure = createContext("Account processing review is incomplete. Gemini requests remain disabled.");
export const useCoachMode = () => useContext(CoachEnvironment);
export const useCoachDisclosure = () => useContext(CoachDisclosure);
