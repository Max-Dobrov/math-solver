import './style.css';
import React, {useReducer} from "react";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    CHOOSE_OPERATION: 'choose-operation',
    EVALUATE: 'evaluate'
}

function evaluate({previousOperand, currentOperand, operation}) {
    return eval(`${previousOperand}${operation}${currentOperand}`)
}

function reducer(state, { type, payload }){
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite === true) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            if (payload.digit === "0" && state.currentOperand === "0") return state
            if (payload.digit === "." && state.currentOperand.includes(".")) return state
            return { ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}` }
        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) return state
            if (state.currentOperand.length === 1) {
                return { ...state, currentOperand: null }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) return state
            else if (state.previousOperand == null && state.currentOperand !== null) {
                return {
                    previousOperand: state.currentOperand,
                    currentOperand: null,
                    operation: payload.operation
                }
            } else if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                currentOperand: null,
                operation: payload.operation
            }

        case ACTIONS.EVALUATE:
            if (state.operation == null) return
            return {
                ...state,
                overwrite: true,
                currentOperand: evaluate(state),
                previousOperand: null,
                operation: null
            }

        default:
            return state
    }
}

function App() {
    const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

    return (
    <div className="calculator-grid">
        <div className="output">
            <div className="previous-operand">{previousOperand} {operation}</div>
            <div className="current-operand">{currentOperand}</div>
        </div>
        <button className="span-two" onClick={ () => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={ () => dispatch({type: ACTIONS.DELETE_DIGIT}) }>DEL</button>
        <OperationButton operation='/' dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button onClick={ () => dispatch({type: ACTIONS.EVALUATE}) } className="span-two" >=</button>
    </div>
    );
}

export default App;
