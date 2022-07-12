'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  console.log(movements);
  console.log(sort);
  const movs = sort ? movements.slice().sort((a,b) => a - b ) : movements;
  console.log(movs);
  containerMovements.innerHTML = '';
  movs.forEach(function(mov,i){
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html =`
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date"> 3 DAYS AGO</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `
  containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
//displayMovements(movements);

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov, 0);
  console.log(acc.balance)
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const out = acc.movements.filter(mov => mov < 0 ).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`
  labelSumOut.textContent = `${Math.abs(out)}€`
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(mov => mov*1.2/100)
  .filter((int, i , arr) => {
    console.log(arr);
    return int>=1;
  })
  .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`
}

const createUserNames = function(accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}

createUserNames(accounts);

const ipdateUI = function(acc){
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
}

//Envent handler
let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value );
  console.log(currentAccount);

  if( currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    ipdateUI(currentAccount);  
  }
  console.log(currentAccount);
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  console.log(currentAccount);
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
  acc => acc.userName === inputTransferTo.value
  );
    // Clear input fields
    inputTransferAmount.value = inputTransferTo.value = '';
  if( amount> 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName){
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    ipdateUI(currentAccount);  
  }

})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const loanApproval = currentAccount.movements.some(mov => mov > 0 && mov> loanAmount*0.1)
  currentAccount.movements.push(loanAmount);
  inputLoanAmount.value = '';
  ipdateUI(currentAccount);  
  console.log(`The loand for ${loanAmount} was ${loanApproval? 'Approved': 'Rejected'}`);
})

let sorted = false;

btnSort.addEventListener(`click`, function(e){
  e.preventDefault();
  console.log(`Ordene ps`)
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

btnClose.addEventListener(`click`, function(e){
  e.preventDefault();

  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    console.log(index);
    //Delete account
    accounts.splice(index,1);
    console.log(accounts);
    //Hide UI
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = '';

})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const juliaData1 = [3, 5, 2, 12, 7];
// const kateData1 = [4, 1, 15, 8, 3];
// const juliaData2 = [9, 16, 6, 8, 3];
// const KateData2 = [10, 5, 6, 1, 4];

// const checkDogs = function(dogsJulia, dogsKate){
//   const dogsJuliaClean = dogsJulia.slice(1,-2);
//   const allDogs = dogsJuliaClean.concat(dogsKate)
//   allDogs.forEach(function(age, index){
//     age>3? console.log(`Dog number${index+1} is an adult, and it is ${age} years old`) : console.log(`Dog number${index+1} is a puppy, and it is ${age} years old`)
//   })

//   console.log(allDogs);
// }

// checkDogs(juliaData1, kateData1);
// checkDogs(juliaData2, KateData2);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(move =>  move*eurToUsd)
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for(const mov of movements) movementsUSDfor.push(mov*eurToUsd);
// console.log(movementsUSDfor)

// const movementsDescriptions = movements.map(
//   (mov, i) => `Movement ${i+1} : You ${mov> 0 ? 'deposited' : 'Withdrew'} ${Math.abs(mov)}`
// )
// console.log(movementsDescriptions)
/*
const deposits = movements.filter(function(mov){
  return mov > 0;
})
console.log(movements);
console.log(deposits);

const depositsFor =[];
for( const mov of movements) if (mov> 0) depositsFor.push(mov)
console.log(depositsFor)

const withdrawls = movements.filter(mov => mov < 0 );
console.log(withdrawls);*/

// const balance = movements.reduce(function(acc, cur, i, arr){
//   console.log(`Iteration ${i} : ${acc}`);
//    return acc + cur;
// }, 100)
// console.log(balance);

// const balance = movements.reduce((acc, cur) => acc + cur , 0)
// console.log(balance);

// let balance2 = 0;
// for(const mov of movements ) balance2 += mov;
// console.log(balance2)

// Maximun value
// let max = 0;
// max = account1.movements.reduce((acc, cur) => acc>cur? acc : cur )
// console.log(max)

// const juliaData = [5,2,4,1,15,8,3];
// const kateData = [16,6,10,5,6,1,4];

// const calcAverageHumanAge = ages => 
//      ages
//     .map(dogAge => (dogAge <= 2 ? 2*dogAge : 16 + dogAge * 4))
//     .filter(dogAge => dogAge >= 18)
//     .reduce((acc,cur, i , arr) => acc + cur/arr.length , 0 );  
// //console.log(`Las edades son: ${juliaData}, ${kateData} `);

// const avg1 = calcAverageHumanAge(juliaData);
// const avg2 = calcAverageHumanAge(kateData);
// console.log(avg1,avg2);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// //Pipeline
// const totalDepositUSD = movements
// .filter(mov => mov > 0 )
// .map((mov,i,arr) =>  {
//   console.log(arr);
//    return mov*eurToUsd;
// })
// .reduce((acc, mov) => acc + mov , 0);
// console.log(totalDepositUSD);


///////////////////////////////////////
// Array Methods Practice

// // Number 1
// const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(acc => acc> 0).reduce((acc,cur) => acc +cur , 0);

// console.log(bankDepositSum);

// // Number 2
// const numDeposts1000 = accounts.flatMap(acc => acc.movements).reduce((acc,cur)=> (cur>=1000 ? ++acc : acc ), 0 );

// console.log(numDeposts1000);

// // Number 3
//  const {deposits,withdrawals} = accounts.flatMap(acc => acc.movements).reduce((sum, cur) => {
//   // cur > 0 ? sum.deposits += cur : sum.withdrawals += cur;
//   sum[cur>0 ? 'deposits' : 'withdrawals'] += cur;
//   return sum;
//  }, {deposits: 0, withdrawals: 0});

//  console.log(deposits,withdrawals)

//  // Number 4

//  const capitalize = strig => strig.replace(strig[0],strig[0].toUpperCase())
//  const converTitleCase = function(title) {
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with' ];
//   const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : capitalize(word) ).join(' ');
//   return capitalize(titleCase);
//  }
// console.log(converTitleCase('this is a nice title'))
// console.log(converTitleCase('this is a LONG title but not too long'))
// console.log(converTitleCase('and this is another title with an EXAMPLE'))



///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] }, { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] }, { weight: 32, curFood: 340, owners: ['Michael'] },
  ];

 // 1
  // const addRecommendedFood = dogs.map(dog =>{
  //   dog.recommendedFood = dog.weight*0.75*28;
  //   return dog;
  // })
  // console.log(addRecommendedFood);

    dogs.forEach(dog =>  dog.recommendedFood = Math.trunc(dog.weight*0.75*28))
    console.log(dogs);
// 2

//const eatOkay = (curFood, recommendedFood) => recommendedFood*1.1 >= curFood && recommendedFood*0.9 <= curFood ? `1` : `0`;
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log (sarahDog.curFood, sarahDog.recommendedFood)
console.log(`Sarah dog's is eating ${sarahDog.curFood > sarahDog.recommendedFood ? `Too much`: `Too little`}`);

//3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood ).flatMap(dog => dog.owners)
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood ).flatMap(dog => dog.owners)
//4
console.log(`${ownersEatTooMuch.join(' and ')} \`s dogs eat too much and ${ownersEatTooLittle.join(' and ')} \'s eat too little`  );

//5
const exact = dogs.some( (cur) => cur.curFood === cur.recommendedFood)
console.log(exact);

//6
const checkEatingOkay = dog => dog.recommendedFood*1.1 >= dog.curFood && dog.recommendedFood*0.9 <= dog.curFood;
const okay = dogs.some( checkEatingOkay)
console.log(okay);

//7
const okayArray = dogs.filter(checkEatingOkay)
 console.log(okayArray);

//8

const dogsCopy = dogs.slice().sort((a,b) => a.recommendedFood -b.recommendedFood);
console.log(dogsCopy);

