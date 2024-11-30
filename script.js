let totalIncome = 0;
let totalExpenses = 0;
let expenses = []; // Array to hold expense objects
let expenseChart; // Variable to hold the Chart.js instance

function toggleCategory() {
    const type = document.getElementById('type').value;
    const categoryContainer = document.getElementById('category-container');
    
    if (type === 'expense') {
        categoryContainer.style.display = 'block'; // Show category input for expenses
    } else {
        categoryContainer.style.display = 'none'; // Hide category input for income
        document.getElementById('category').value = ''; // Clear category input
    }
}

function addItem() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    
    if (type === 'income') {
        totalIncome += amount;
        const incomeList = document.getElementById('income-list');
        const li = document.createElement('li');
        li.textContent = `${description}: $${amount.toFixed(2)}`;
        incomeList.appendChild(li);
        
        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        
        resetFields();
        
    } else if (type === 'expense') {
        totalExpenses += amount;
        const expenseList = document.getElementById('expense-list');
        const category = document.getElementById('category').value || 'Miscellaneous'; // Default to Miscellaneous if no category is provided
        const li = document.createElement('li');
        li.textContent = `${description} (${category}): $${amount.toFixed(2)}`;
        expenseList.appendChild(li);
        
        // Add expense to the array
        expenses.push({ description, amount, category });
        
        document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
        
        resetFields();
        
        updateBalance();
    }
}

function resetFields() {
   document.getElementById('description').value = '';
   document.getElementById('amount').value = '';
   document.getElementById('type').value = 'income';
   toggleCategory(); // Reset category visibility
}

function updateBalance() {
   const balance = totalIncome - totalExpenses;
   document.getElementById('balance').textContent = balance.toFixed(2);
}

function showBreakdown() {
   // Prepare data for the pie chart
   const categories = {};
   expenses.forEach(expense => {
       categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
   });
   
   const labels = Object.keys(categories);
   const dataValues = Object.values(categories);
   
   // Show the pie chart
   const ctx = document.getElementById('expenseChart').getContext('2d');

   // If the chart already exists, destroy it before creating a new one
   if (expenseChart) {
       expenseChart.destroy();
   }

   expenseChart = new Chart(ctx, {
       type: 'pie',
       data: {
           labels: labels.length > 0 ? labels : ['No Expenses'], // Handle case with no expenses
           datasets: [{
               label: 'Expense Breakdown',
               data: dataValues.length > 0 ? dataValues : [1], // Default to 1 if no expenses are present
               backgroundColor: [
                   '#FF6384',
                   '#36A2EB',
                   '#FFCE56',
                   '#4BC0C0',
                   '#9966FF'
               ],
               borderColor: '#fff',
               borderWidth: 1
           }]
       },
       options: {
           responsive: true,
           plugins: {
               legend: {
                   position: 'top',
               },
               title: {
                   display: true,
                   text: 'Expense Breakdown'
               }
           }
       }
   });
   
   // Show the canvas and hide the button
   document.getElementById('expenseChart').style.display = 'block';
}