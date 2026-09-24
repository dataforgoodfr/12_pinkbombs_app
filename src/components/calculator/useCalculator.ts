"use client";

import * as React from "react";

import {
  type CalculatorAction,
  calculatorReducer,
  INITIAL_CALCULATOR_STATE,
  isCurrentStepAnswered,
} from "./state";

export const useCalculator = () => {
  const [state, dispatch] = React.useReducer(
    calculatorReducer,
    INITIAL_CALCULATOR_STATE,
  );

  const send = React.useCallback((action: CalculatorAction) => {
    dispatch(action);
  }, []);

  return {
    state,
    dispatch: send,
    isNextButtonActive: isCurrentStepAnswered(state),
  };
};
