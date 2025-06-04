// Portfolio data
const portfolioData = {
  portfolio: {
    totalValue: 2456780,
    totalInvested: 2100000,
    todayGain: 12340,
    todayGainPercentage: 0.51,
    benchmarkReturn: 0.43,
    portfolioReturn: 0.67
  },
  holdings: [
    {
      symbol: "RELIANCE",
      company: "Reliance Industries Ltd",
      sector: "Energy",
      quantity: 50,
      avgPrice: 2850,
      currentPrice: 2945,
      invested: 142500,
      currentValue: 147250,
      pnl: 4750,
      dayChange: 15,
      dayChangePercent: 0.51,
      cagr1Y: 12.5,
      cagr3M: 8.2,
      cagr6M: 15.3,
      cagr1M: 5.1,
      cagrYTD: 18.7
    },
    {
      symbol: "TCS",
      company: "Tata Consultancy Services",
      sector: "IT",
      quantity: 30,
      avgPrice: 3650,
      currentPrice: 3789,
      invested: 109500,
      currentValue: 113670,
      pnl: 4170,
      dayChange: 25,
      dayChangePercent: 0.67,
      cagr1Y: 15.2,
      cagr3M: 10.1,
      cagr6M: 18.5,
      cagr1M: 6.7,
      cagrYTD: 22.3
    },
    {
      symbol: "HDFCBANK",
      company: "HDFC Bank Ltd",
      sector: "Banking",
      quantity: 80,
      avgPrice: 1650,
      currentPrice: 1698,
      invested: 132000,
      currentValue: 135840,
      pnl: 3840,
      dayChange: 8,
      dayChangePercent: 0.47,
      cagr1Y: 9.8,
      cagr3M: 6.5,
      cagr6M: 12.1,
      cagr1M: 4.2,
      cagrYTD: 14.6
    },
    {
      symbol: "INFY",
      company: "Infosys Ltd",
      sector: "IT",
      quantity: 60,
      avgPrice: 1580,
      currentPrice: 1634,
      invested: 94800,
      currentValue: 98040,
      pnl: 3240,
      dayChange: 12,
      dayChangePercent: 0.74,
      cagr1Y: 14.1,
      cagr3M: 9.2,
      cagr6M: 16.8,
      cagr1M: 7.1,
      cagrYTD: 20.5
    },
    {
      symbol: "ITC",
      company: "ITC Ltd",
      sector: "FMCG",
      quantity: 200,
      avgPrice: 425,
      currentPrice: 445,
      invested: 85000,
      currentValue: 89000,
      pnl: 4000,
      dayChange: 3,
      dayChangePercent: 0.68,
      cagr1Y: 8.5,
      cagr3M: 5.2,
      cagr6M: 11.3,
      cagr1M: 3.8,
      cagrYTD: 13.2
    }
  ],
  sectorAllocation: [
    {sector: "IT", value: 211710, percentage: 8.6},
    {sector: "Banking", value: 135840, percentage: 5.5},
    {sector: "Energy", value: 147250, percentage: 6.0},
    {sector: "FMCG", value: 89000, percentage: 3.6},
    {sector: "Others", value: 1873980, percentage: 76.3}
  ],
  taxSummary: {
    shortTermGains: 25600,
    longTermGains: 45200,
    realizedLosses: 8900,
    taxLiability: 12880
  },
  benchmarkData: {
    name: "NIFTY 50",
    portfolioCAGR: 16.8,
    benchmarkCAGR: 14.2,
    outperformance: 2.6
  }
};

// Charts instances
let sectorChart = null;
let performanceChart = null;

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(num, decimals = 2) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

function formatPercentage(num) {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

// Tab switching functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // Load chart if analytics tab is selected
      if (tabId === 'analytics') {
        setTimeout(() => {
          initializePerformanceChart();
        }, 100);
      }
    });
  });
}

// Populate holdings table
function populateHoldingsTable() {
  const tbody = document.getElementById('holdings-tbody');
  tbody.innerHTML = '';

  portfolioData.holdings.forEach(holding => {
    const row = document.createElement('tr');
    
    const pnlClass = holding.pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
    const dayChangeClass = holding.dayChange >= 0 ? 'pnl-positive' : 'pnl-negative';
    const dayChangeSign = holding.dayChange >= 0 ? '+' : '';
    const pnlSign = holding.pnl >= 0 ? '+' : '';
    
    row.innerHTML = `
      <td>
        <div class="stock-info">
          <div class="stock-symbol">${holding.symbol}</div>
          <div class="stock-company">${holding.company}</div>
        </div>
      </td>
      <td>${holding.quantity}</td>
      <td>${formatCurrency(holding.avgPrice)}</td>
      <td>${formatCurrency(holding.currentPrice)}</td>
      <td class="${pnlClass}">${pnlSign}${formatCurrency(holding.pnl)}</td>
      <td class="${dayChangeClass}">
        ${dayChangeSign}${formatCurrency(holding.dayChange)}<br>
        <small>(${formatPercentage(holding.dayChangePercent)})</small>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Populate CAGR table
function populateCAGRTable() {
  const tbody = document.getElementById('cagr-tbody');
  tbody.innerHTML = '';

  portfolioData.holdings.forEach(holding => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <div class="stock-info">
          <div class="stock-symbol">${holding.symbol}</div>
        </div>
      </td>
      <td class="pnl-positive">${holding.cagr1M.toFixed(1)}%</td>
      <td class="pnl-positive">${holding.cagr3M.toFixed(1)}%</td>
      <td class="pnl-positive">${holding.cagr6M.toFixed(1)}%</td>
      <td class="pnl-positive">${holding.cagr1Y.toFixed(1)}%</td>
      <td class="pnl-positive">${holding.cagrYTD.toFixed(1)}%</td>
    `;
    
    tbody.appendChild(row);
  });
}

// Initialize sector allocation chart
function initializeSectorChart() {
  const ctx = document.getElementById('sectorChart').getContext('2d');
  
  if (sectorChart) {
    sectorChart.destroy();
  }
  
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
  
  sectorChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: portfolioData.sectorAllocation.map(item => item.sector),
      datasets: [{
        data: portfolioData.sectorAllocation.map(item => item.percentage),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = portfolioData.sectorAllocation.find(item => item.sector === label)?.value || 0;
              return `${label}: ${value}% (${formatCurrency(total)})`;
            }
          }
        }
      }
    }
  });
}

// Initialize performance chart
function initializePerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;
  
  if (performanceChart) {
    performanceChart.destroy();
  }
  
  // Generate sample performance data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const portfolioPerformance = [100, 105, 108, 112, 118, 125];
  const benchmarkPerformance = [100, 103, 106, 108, 114, 119];
  
  performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Your Portfolio',
          data: portfolioPerformance,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        },
        {
          label: 'NIFTY 50',
          data: benchmarkPerformance,
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Performance (%)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Months'
          }
        }
      }
    }
  });
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('search-holdings');
  const tbody = document.getElementById('holdings-tbody');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
      const stockSymbol = row.querySelector('.stock-symbol').textContent.toLowerCase();
      const stockCompany = row.querySelector('.stock-company').textContent.toLowerCase();
      
      if (stockSymbol.includes(searchTerm) || stockCompany.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Chat functionality
function initializeChat() {
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  const questionButtons = document.querySelectorAll('.question-btn');

  // Predefined responses
  const responses = {
    "what's my best performing stock?": "Based on your portfolio, TCS is your best performing stock with a 1-year CAGR of 15.2% and YTD returns of 22.3%. It has consistently outperformed other holdings across all timeframes.",
    "how is my portfolio diversified?": "Your portfolio shows heavy concentration in 'Others' category (76.3%). Consider diversifying more across sectors. Currently: IT (8.6%), Energy (6.0%), Banking (5.5%), FMCG (3.6%). I recommend reducing concentration and adding more sectoral diversity.",
    "what are my tax implications?": "Your estimated tax liability is ₹12,880. This includes short-term gains of ₹25,600 (taxed at your slab rate) and long-term gains of ₹45,200. Since your LTCG is below ₹1L threshold, no LTCG tax applies. You also have ₹8,900 in realized losses for offset.",
    "should i rebalance my portfolio?": "Yes, consider rebalancing. Your 'Others' allocation is too high at 76.3%. Suggest: Increase IT/Banking allocation, reduce concentration risk, and consider adding healthcare/pharma sectors. Your current performance is good (16.8% vs 14.2% benchmark), but diversification can reduce risk."
  };

  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
      <div class="message-content">${content}</div>
      <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleMessage(message) {
    addMessage(message, true);
    
    // Simulate typing delay
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let response = "I understand your question about your portfolio. Let me analyze your data and provide insights based on your current holdings and performance metrics.";
      
      // Check for matching responses
      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }
      
      // Additional keyword-based responses
      if (lowerMessage.includes('performance') || lowerMessage.includes('return')) {
        response = "Your portfolio is performing well with a 16.8% CAGR compared to NIFTY 50's 14.2%. You're outperforming the benchmark by 2.6%. Today you're up ₹12,340 (+0.51%).";
      } else if (lowerMessage.includes('risk') || lowerMessage.includes('volatility')) {
        response = "Your portfolio shows moderate risk with good diversification potential. Main risk: 76.3% in 'Others' category. Consider spreading across more defined sectors to reduce concentration risk.";
      } else if (lowerMessage.includes('dividend') || lowerMessage.includes('income')) {
        response = "Based on your holdings, HDFCBANK and ITC are good dividend yielders. Reliance also provides steady dividends. Consider tracking dividend income for better tax planning.";
      }
      
      addMessage(response);
    }, 1000);
  }

  sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      handleMessage(message);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });

  questionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const question = button.textContent;
      handleMessage(question);
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  populateHoldingsTable();
  populateCAGRTable();
  initializeSearch();
  initializeChat();
  
  // Initialize sector chart after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeSectorChart();
  }, 100);
});

// Handle window resize for charts
window.addEventListener('resize', () => {
  if (sectorChart) {
    sectorChart.resize();
  }
  if (performanceChart) {
    performanceChart.resize();
  }
});