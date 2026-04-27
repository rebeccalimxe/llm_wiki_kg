import { spawnSync } from "child_process";
import { appendFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const logFile = join(process.cwd(), "lint.log");
const timestamp = new Date().toISOString();

const result = spawnSync("tsc", ["--build"], {
  encoding: "utf8",
  stdio: "pipe",
});

const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
const exitCode = result.status ?? 1;

// Print to terminal
if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);

const status = exitCode === 0 ? "PASS" : "FAIL";
const output = stdout + stderr;
const entry = [
  `[${timestamp}] lint: ${status}`,
  output.trim() || "(no output)",
  "",
].join("\n");

if (!existsSync(logFile)) {
  writeFileSync(logFile, entry);
} else {
  appendFileSync(logFile, entry);
}

process.exit(exitCode);
