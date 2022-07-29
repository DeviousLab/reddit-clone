import { atom } from "recoil";

export interface AuthModalState {
  open: boolean;
  variant: ModalView
}

export type ModalView = "signin" | "signup" | "forgot-password";

const defaultModalState: AuthModalState = {
  open: false,
  variant: "signin",
}

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});