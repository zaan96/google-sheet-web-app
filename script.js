document.addEventListener("DOMContentLoaded", function() {
    const sheetUrl = 'https://spreadsheets.google.com/feeds/cells/12rGc9YERGT9yCck1GLxcgdQLYrJ-ePoVVTUbJszyDa0/1/public/values?alt=json';
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    // Fetch Google Sheet data
    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            const rows = [];
            const entries = data.feed.entry;
            let currentRow = [];
            let currentRowNum = 1;

            // Process the data into rows and columns
            entries.forEach(entry => {
                const row = entry.gs$cell.row;
                const col = entry.gs$cell.col;
                const value = entry.gs$cell.inputValue;

                if (row !== currentRowNum) {
                    rows.push(currentRow);
                    currentRow = [];
                    currentRowNum = row;
                }

                currentRow[col - 1] = value;
            });

            rows.push(currentRow);  // Push the last row

            // Populate table with data
            rows.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });

            // Add search functionality
            searchInput.addEventListener('input', function() {
                const query = searchInput.value.toLowerCase();
                const rows = tableBody.getElementsByTagName('tr');

                Array.from(rows).forEach(row => {
                    const cells = row.getElementsByTagName('td');
                    let found = false;

                    // Check if any cell matches the search query
                    Array.from(cells).forEach(cell => {
                        if (cell.textContent.toLowerCase().includes(query)) {
                            found = true;
                        }
                    });

                    // Show or hide rows based on search result
                    row.style.display = found ? '' : 'none';
                });
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
