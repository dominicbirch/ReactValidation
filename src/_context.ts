import { createContext } from "react"
import type { SubjectProps } from "./_form"

export const ValidationContext = createContext<SubjectProps | undefined>(undefined);
