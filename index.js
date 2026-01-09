initialize();

function initialize() {
  const mortgageCalculatorElem = /** @type {HTMLFormElement} */ (document.getElementById('mortgageCalculator'));
  const mortgageResultsElem = /** @type {HTMLElement} */ (document.getElementById('mortgageResults'));
  const clearInfoBtn = /** @type {HTMLButtonElement} */ (mortgageCalculatorElem.querySelector('#clearInfo'));
  const dynamicCommasRegex = /\B(?=(\d{3})+(?!\d))/g;
  const numsOnlyRegex = /[^\d]/g;

  /** @param {Event} e */
  const formatMortgage = (e) => {
    const input = /** @type {HTMLInputElement} */ (e.target);
    const inputId = input.id;
    if (inputId === 'mortgageAmount') input.value = input.value.replace(numsOnlyRegex, '').replace(dynamicCommasRegex, ',');
    else if (inputId === 'mortgageTerm') input.value = input.value.replace(numsOnlyRegex, '');
  };

  /** @param {SubmitEvent} e */
  const calculateMortgage = (e) => {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
    const {mortgageAmount, mortgageTerm, interestRate, repaymentChoice, interestChoice} = /** @type {Object.<string, HTMLInputElement>} */ (form);
  };

  clearInfoBtn.addEventListener('click', () => mortgageCalculatorElem.reset());
  mortgageCalculatorElem.addEventListener('input', formatMortgage);
  mortgageCalculatorElem.addEventListener('submit', calculateMortgage);
}
