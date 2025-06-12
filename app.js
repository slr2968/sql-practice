initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
}).then(SQL => {
  const runQuery = async () => {
    const response = await fetch("tx_deathrow_full.csv");
    const csvText = await response.text();

    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.replace(/\s+/g, "_").replace(/\n/g, "_"));

    const db = new SQL.Database();
    db.run(`CREATE TABLE deathrow (${headers.map(h => `${h} TEXT`).join(", ")});`);

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(x =>
        x.replace(/^"|"$/g, "").replace(/'/g, "''")
      );
      if (row.length === headers.length) {
        db.run(`INSERT INTO deathrow VALUES ('${row.join("','")}');`);
      }
    }

    document.querySelector("button").onclick = () => {
      const sqlCode = document.getElementById("sql").value;
      let results = "";
      try {
        const res = db.exec(sqlCode);
        if (res.length > 0) {
          const cols = res[0].columns;
          const values = res[0].values;
          results += cols.join("\t") + "\n";
          values.forEach(row => {
            results += row.join("\t") + "\n";
          });
        } else {
          results = "Query executed successfully.";
        }
      } catch (e) {
        results = "Error: " + e.message;
      }
      document.getElementById("output").textContent = results;
    };
  };

  runQuery().catch(err => {
    document.getElementById("output").textContent = "Error loading CSV or database: " + err.message;
    console.error(err);
  });
});
