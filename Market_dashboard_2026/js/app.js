document.addEventListener("DOMContentLoaded", function () {
    loadMarketData();
});

function loadMarketData() {
    fetch("data/sample.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            renderIndices(data.indices);
            renderWatchlist(data.watchlist);
            renderPortfolio(data.portfolio);
        })
        .catch(function (error) {
            console.error("Failed to load market data:", error);
        });
}

function renderIndices(indices) {
    var mapping = {
        "S&P 500": "sp500",
        "NASDAQ": "nasdaq",
        "DOW": "dow",
        "Russell 2000": "russell"
    };

    indices.forEach(function (index) {
        var key = mapping[index.name];
        if (!key) return;

        var priceEl = document.getElementById(key + "-price");
        var changeEl = document.getElementById(key + "-change");

        if (priceEl) priceEl.textContent = formatNumber(index.price);
        if (changeEl) {
            var sign = index.change >= 0 ? "+" : "";
            changeEl.textContent = sign + index.change.toFixed(2) + " (" + sign + index.changePercent.toFixed(2) + "%)";
            changeEl.className = "change " + (index.change >= 0 ? "positive" : "negative");
        }
    });
}

function renderWatchlist(watchlist) {
    var tbody = document.getElementById("watchlist-body");
    tbody.innerHTML = "";

    watchlist.forEach(function (stock) {
        var row = document.createElement("tr");
        var sign = stock.change >= 0 ? "+" : "";
        var changeClass = stock.change >= 0 ? "positive" : "negative";

        row.innerHTML =
            "<td><strong>" + stock.symbol + "</strong></td>" +
            "<td>" + stock.name + "</td>" +
            "<td>" + formatCurrency(stock.price) + "</td>" +
            '<td class="' + changeClass + '">' + sign + stock.change.toFixed(2) + " (" + sign + stock.changePercent.toFixed(2) + "%)</td>" +
            "<td>" + formatVolume(stock.volume) + "</td>";

        tbody.appendChild(row);
    });
}

function renderPortfolio(portfolio) {
    var valueEl = document.getElementById("portfolio-value");
    var changeEl = document.getElementById("portfolio-change");
    var gainEl = document.getElementById("portfolio-gain");

    if (valueEl) valueEl.textContent = formatCurrency(portfolio.totalValue);

    if (changeEl) {
        var sign = portfolio.dayChange >= 0 ? "+" : "";
        changeEl.textContent = sign + formatCurrency(portfolio.dayChange);
        changeEl.style.color = portfolio.dayChange >= 0 ? "#66bb6a" : "#ef5350";
    }

    if (gainEl) {
        var sign = portfolio.totalGain >= 0 ? "+" : "";
        gainEl.textContent = sign + formatCurrency(portfolio.totalGain);
        gainEl.style.color = portfolio.totalGain >= 0 ? "#66bb6a" : "#ef5350";
    }
}

function formatNumber(num) {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrency(num) {
    return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}
