
async function runQuery() {
  const response = await fetch("tx_deathrow_full.csv");
  const csvText = await response.text();
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/\s+/g, "_").replace(/\n/g, "_"));

  const db = new SQL.Database();
  db.run(`CREATE TABLE deathrow (Execution TEXT, Date_of_Birth TEXT, Date_of_Offence TEXT, Highest_Education_Level TEXT, Last_Name TEXT, First_Name TEXT, TDCJ_Number TEXT, Age_at_Execution TEXT, Date_Received TEXT, Execution_Date TEXT, Race TEXT, County TEXT, Eye_Color TEXT, Weight TEXT, Height TEXT, Native_County TEXT, Native_State TEXT, Last_Statement TEXT);`);

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(x => x.replace(/^"|"$/g, '').replace(/'/g, "''"));
    if (row.length === headers.length) {
      db.run(`INSERT INTO deathrow VALUES ('${row.join("','")}');`);
    }
  }

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
}

document.addEventListener("DOMContentLoaded", runQuery);
