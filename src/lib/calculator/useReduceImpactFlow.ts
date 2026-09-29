import * as React from "react";

import {
  buildReducedImpactProducts,
  type CalculatorSubmissionResponse,
  type CalculatorSubmissionService,
} from "./submission";
import type { UserProductConsumption } from "./types";

const PRODUCT_SELECTION_DELAY_MS = 1500;
const CALCULATION_MINIMUM_DURATION_MS = 1000;

const wait = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

interface UseReduceImpactFlowOptions {
  canCalculate: boolean;
  frequency: number;
  isMobile: boolean;
  products: UserProductConsumption[];
  selectedProductKey: string | null;
  submissionService: CalculatorSubmissionService;
  onConfirmFrequency: () => void;
  onSelectProduct: (productKey: string) => void;
  onSelectAlternative: (alternative: string) => void;
  onSelectSupplement: (supplement: string) => void;
  onSetActiveAccordion: (index: 0 | 1 | 2 | 3 | null) => void;
}

export const useReduceImpactFlow = ({
  canCalculate,
  frequency,
  isMobile,
  products,
  selectedProductKey,
  submissionService,
  onConfirmFrequency,
  onSelectProduct,
  onSelectAlternative,
  onSelectSupplement,
  onSetActiveAccordion,
}: UseReduceImpactFlowOptions) => {
  const [newResponse, setNewResponse] =
    React.useState<CalculatorSubmissionResponse | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [calculationError, setCalculationError] = React.useState<string | null>(
    null,
  );
  const [engagementsConfirmed, setEngagementsConfirmed] = React.useState(false);
  const [hasOmega3Consent, setHasOmega3Consent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [badgeVisible, setBadgeVisible] = React.useState(false);
  const [pendingProductKey, setPendingProductKey] = React.useState<
    string | null
  >(null);
  const [pendingAlternative, setPendingAlternative] = React.useState<
    string | null
  >(null);
  const [pendingSupplement, setPendingSupplement] = React.useState<
    string | null
  >(null);
  const badgeQuestionsRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const newResponseRef = React.useRef<HTMLDivElement>(null);
  const pendingProductTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const pendingAlternativeTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const pendingSupplementTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  React.useEffect(
    () => () => {
      if (pendingProductTimeoutRef.current) {
        clearTimeout(pendingProductTimeoutRef.current);
      }
      if (pendingAlternativeTimeoutRef.current) {
        clearTimeout(pendingAlternativeTimeoutRef.current);
      }
      if (pendingSupplementTimeoutRef.current) {
        clearTimeout(pendingSupplementTimeoutRef.current);
      }
    },
    [],
  );

  const calculateReducedImpact = async () => {
    if (!selectedProductKey) return;

    setIsCalculating(true);
    setNewResponse(null);
    setCalculationError(null);
    setEngagementsConfirmed(false);
    setBadgeVisible(false);

    const [result] = await Promise.all([
      submissionService({
        products: buildReducedImpactProducts(products, {
          selectedProductKey,
          replacementFrequencyPerYear: frequency,
        }),
      }),
      wait(CALCULATION_MINIMUM_DURATION_MS),
    ]);

    if (typeof result === "string") {
      setCalculationError(result);
    } else {
      setNewResponse(result);
    }

    setIsCalculating(false);
  };

  const calculateNewImpact = async () => {
    if (!canCalculate) return;
    await calculateReducedImpact();
  };

  const confirmFrequency = () => {
    onConfirmFrequency();
    if (!isMobile) {
      void calculateReducedImpact();
    }
  };

  const selectProductWithDelay = (productKey: string) => {
    if (pendingProductTimeoutRef.current) {
      clearTimeout(pendingProductTimeoutRef.current);
    }

    setPendingProductKey(productKey);
    pendingProductTimeoutRef.current = setTimeout(() => {
      onSelectProduct(productKey);
      onSetActiveAccordion(1);
      pendingProductTimeoutRef.current = null;
      setPendingProductKey(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  const selectAlternativeWithDelay = (alternative: string) => {
    if (pendingAlternativeTimeoutRef.current) {
      clearTimeout(pendingAlternativeTimeoutRef.current);
    }

    setPendingAlternative(alternative);
    pendingAlternativeTimeoutRef.current = setTimeout(() => {
      onSelectAlternative(alternative);
      onSetActiveAccordion(3);
      pendingAlternativeTimeoutRef.current = null;
      setPendingAlternative(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  const selectSupplementWithDelay = (supplement: string) => {
    if (pendingSupplementTimeoutRef.current) {
      clearTimeout(pendingSupplementTimeoutRef.current);
    }

    setPendingSupplement(supplement);
    pendingSupplementTimeoutRef.current = setTimeout(() => {
      onSelectSupplement(supplement);
      onSetActiveAccordion(null);
      pendingSupplementTimeoutRef.current = null;
      setPendingSupplement(null);
    }, PRODUCT_SELECTION_DELAY_MS);
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
  };

  const validateEmail = (errorMessage: string) => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(errorMessage);
      return false;
    }

    setEmailError(null);
    return true;
  };

  const showBadge = (emailErrorMessage: string) => {
    if (!validateEmail(emailErrorMessage)) return;
    setBadgeVisible(true);
  };

  return {
    newResponse,
    isCalculating,
    calculationError,
    engagementsConfirmed,
    setEngagementsConfirmed,
    hasOmega3Consent,
    setHasOmega3Consent,
    email,
    emailError,
    onEmailChange,
    validateEmail,
    badgeVisible,
    showBadge,
    badgeQuestionsRef,
    badgeRef,
    newResponseRef,
    pendingProductKey,
    pendingAlternative,
    pendingSupplement,
    calculateNewImpact,
    confirmFrequency,
    selectProductWithDelay,
    selectAlternativeWithDelay,
    selectSupplementWithDelay,
  };
};
