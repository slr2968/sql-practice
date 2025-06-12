initSqlJs({
  locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.6.2/dist/${file}`
}).then(SQL => {
  console.log("✅ sql.js initialized");
  const db = new SQL.Database();
  console.log("📦 Database initialized");

  db.run(`CREATE TABLE deathrow (
    "Execution" TEXT, "Date_of_Birth" TEXT, "Date_of_Offence" TEXT,
    "Highest_Education_Level" TEXT, "Last_Name" TEXT, "First_Name" TEXT,
    "TDCJ_Number" TEXT, "Age_at_Execution" TEXT, "Date_Received" TEXT,
    "Execution_Date" TEXT, "Race" TEXT, "County" TEXT, "Eye_Color" TEXT,
    "Weight" TEXT, "Height" TEXT, "Native_County" TEXT, "Native_State" TEXT,
    "Last_Statement" TEXT
  );`);

  // Sample record to test
  db.run(`INSERT INTO deathrow VALUES (
    '553', '1983-09-24', '2004-11-21', '9.0', 'Young', 'Christopher Anthony',
    '999508', '34', '2006-03-31', '2018-07-17', 'Black', 'Bexar', 'Brown',
    '216.0', '6\' 1\"', 'Bexar', 'Texas', 'I\'m good Warden.'
  );`);

  const runQuery = () => {
    const sql = document.getElementById("sql").value;
    console.log("Running query text >>>", sql);
    let results;
    try {
      results = db.exec(sql);
      console.log("📊 SQL query executed:", sql);
    } catch (err) {
      console.error("❌ SQL error:", err);
      alert("SQL Error: " + err.message);
      return;
    }

    const container = document.getElementById("results");
    container.innerHTML = ""; // Clear previous

    if (results.length === 0) {
      container.textContent = "No results.";
      return;
    }

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    results[0].columns.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    results[0].values.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    container.appendChild(table);
  };

  document.getElementById("run").addEventListener("click", runQuery);
  runQuery(); // Run on initial load
});
