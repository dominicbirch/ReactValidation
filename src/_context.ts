import { createContext } from "react"
import { SubjectProps } from "./_form"

export const ValidationContext = createContext<SubjectProps | undefined>(undefined);
