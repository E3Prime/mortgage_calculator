initialize();

/** @param {number} ms */
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const dynamicCommasRegex = /\B(?=(\d{3})+(?!\d))/g;
const numsOnlyRegex = /[^\d]/g;

function initialize() {
  const mortgageCalculatorElem = /** @type {HTMLFormElement} */ (document.getElementById('mortgageCalculator'));
  const clearInfoBtn = /** @type {HTMLButtonElement} */ (mortgageCalculatorElem.querySelector('#clearInfo'));

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
    const principal = Number(mortgageAmount.value.replaceAll(',', ''));
    const monthlyRate = Number(interestRate.value) / 100 / 12;
    const totalPayments = Number(mortgageTerm.value) * 12;

    if (repaymentChoice.checked) {
      const monthlyPayment = calculateRepayment(principal, monthlyRate, totalPayments);
      const totalRepayment = (Number(monthlyPayment) * totalPayments).toFixed(2);
      displayResults(monthlyPayment, totalRepayment);
    } else if (interestChoice.checked) {
      const monthlyPayment = calculateInterestOnly(principal, monthlyRate);
      displayResults(monthlyPayment);
    }
  };

  clearInfoBtn.addEventListener('click', () => mortgageCalculatorElem.reset());
  mortgageCalculatorElem.addEventListener('input', formatMortgage);
  mortgageCalculatorElem.addEventListener('submit', calculateMortgage);
}

/**
 * @param {number} principal
 * @param {number} monthlyRate
 * @param {number} totalPayments
 */
function calculateRepayment(principal, monthlyRate, totalPayments) {
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
  const monthlyPayment = principal * (numerator / denominator);
  return monthlyPayment.toFixed(2);
}

/**
 * @param {number} principal
 * @param {number} monthlyRate
 */
function calculateInterestOnly(principal, monthlyRate) {
  const monthlyPayment = principal * monthlyRate;
  return monthlyPayment.toFixed(2);
}

/**
 * @param {string} monthlyPayment
 * @param {string} totalPayments
 */
async function displayResults(monthlyPayment, totalPayments = '') {
  const mortgageResultsElem = /** @type {HTMLElement} */ (document.getElementById('mortgageResults'));
  let formattedMonthlyPayment = '';
  let formattedTotalPayments = '';

  if (monthlyPayment && totalPayments) {
    formattedMonthlyPayment = monthlyPayment.replace(dynamicCommasRegex, ',');
    formattedTotalPayments = totalPayments.replace(dynamicCommasRegex, ',');
  } else {
    formattedMonthlyPayment = monthlyPayment.replace(dynamicCommasRegex, ',');
  }

  const resultsElem = `
  <div class="results" style="display: block">
    <h3>Your results</h3>
    <p>Your results shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again</p>
    <div class="result-info">
      <div>
        <h4>Your monthly repayments</h4>
        <p>$${formattedMonthlyPayment}</p>
      </div>
      <hr />
      <div>
        ${
          totalPayments
            ? `
          <h4>Total you'll repay over the term</h4>
          <p>$${formattedTotalPayments}</p>
        `
            : ''
        }
      </div>
    </div>
  </div>
  `;

  mortgageResultsElem.innerHTML = resultsElem;
}
