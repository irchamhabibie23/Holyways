import { createContext, useReducer } from "react";
import { API } from "../config/api";
export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: null,
  isVisibleLogin: false,
  isVisibleRegister: false,
  isVisibleDonate: false,
  isVisibleApprove: false,
  modalDonateId: null,
  approveListModal: [],
  kocamtesting: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "LOAD":
      const kocam = API.get(`/funds`);
      return { ...state, kocamtesting: kocam };
    case "USER_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isLogin: true,
        isVisibleRegister: false,
        isVisibleLogin: false,
        user: payload,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogin: false,
        user: null,
      };
    case "LOGINMODALBUKA":
      return {
        ...state,
        isVisibleLogin: true,
      };
    case "LOGINMODALTUTUP":
      return {
        ...state,
        isVisibleLogin: false,
      };
    case "REGISTERMODALBUKA":
      return {
        ...state,
        isVisibleRegister: true,
      };
    case "REGISTERMODALTUTUP":
      return {
        ...state,
        isVisibleRegister: false,
      };
    case "DONATEMODALBUKA":
      return {
        ...state,
        isVisibleDonate: true,
        modalDonateId: payload,
      };
    case "DONATEMODALTUTUP":
      return {
        ...state,
        isVisibleDonate: false,
      };
    case "APPROVEMODALBUKA":
      return {
        ...state,
        isVisibleApprove: true,
        fundID: payload.id,
        approveListModal: [
          ...state.approveListModal,
          {
            ...payload.approveModal,
          },
        ],
      };
    case "APPROVEMODALTUTUP":
      return {
        ...state,
        isVisibleApprove: false,
        approveListModal: [],
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
