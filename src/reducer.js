export const initialState = {
  user: null,
  allUsers: [],
  conversations: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      console.log("user in reducer is", action.user);
      return {
        ...state,
        user: action.user,
      };
    case "USERS":
      return {
        ...state,
        allUsers: action.allUsers,
      };
    case "CONVERSATIONS":
      console.log("conversations in", action.conversations);
      return {
        ...state,
        conversations: action.conversations,
      };

    default:
      return state;
  }
};

export default reducer;
