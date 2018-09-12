import { createStore, applyMiddleware, Dispatch } from "redux";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
// import { TodoItem } from "../model/TodoItem";
import { initStoreAction } from "../actions/actions";
import { rootReducer } from "../reducers/rootReducer";

export interface IState {
    grammarActivities: any;
    session: any;
    questions: any;
    concepts: any;
    display: any;
    responses: any;
    massEdit: any;
    filters: any;
    conceptsFeedback: any;
};

export const initStore = () => {
    return (dispatch: Dispatch<{}>) => {
        return dispatch(initStoreAction());
    };
};

export const configureStore = () => {
    if (process.env.NODE_ENV === "production") {
        return createStore(
            rootReducer,
            applyMiddleware(thunk),
        );
    } else {
        return createStore(
            rootReducer,
            composeWithDevTools(
                applyMiddleware(thunk),
            ),
        );
    }
};
