import { createContext, useReducer } from "react";
export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: null,
  isVisibleLogin: false,
  isVisibleRegister: false,
  isVisibleEditProfile: false,
  isVisibleDonate: false,
  isVisibleApprove: false,
  modalDonateId: null,
  editIsPressed: 0,
  approveListModal: [],
  editProfileModal: [],
  kocamtesting: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ISPRESSED":
      return { ...state, editIsPressed: state.editIsPressed + 1 };
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
    case "EDITPROFILEBUKA":
      return {
        ...state,
        isVisibleEditProfile: true,
        editProfileModal: payload,
      };
    case "EDITPROFILETUTUP":
      return {
        ...state,
        isVisibleEditProfile: false,
        editProfileModal: [],
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
        approveListModal: payload.approveModal,
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
