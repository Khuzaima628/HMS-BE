import "colors";
import app from "./app";
import "@src/config/db";

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`.bgCyan.black);
});
