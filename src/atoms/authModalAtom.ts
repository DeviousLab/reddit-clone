import { atom } from "recoil";

export interface AuthModalState {
  open: boolean;
  variant: "signin" | "signup" | "forgot-password"
}

const defaultModalState: AuthModalState = {
  open: false,
  variant: "signin",
}

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});